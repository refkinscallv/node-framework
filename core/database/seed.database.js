'use strict'

/**
 * db:seed
 *
 * Runs seeder files from database/seeders/, sorted by filename.
 *
 * Usage:
 *   npm run db:seed
 *   npm run db:seed --seeder=UsersSeeder
 *   npm run db:seed --list
 *   npm run db:seed --verbose
 */

require('module-alias/register')
require('dotenv').config()

const { Sequelize } = require('sequelize')
const fs   = require('fs')
const path = require('path')
const config = require('@app/config')

// ── args ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const flags = {
    verbose: args.includes('--verbose'),
    list:    args.includes('--list'),
    seeder:  (args.find((a) => a.startsWith('--seeder=')) || '').replace('--seeder=', '') || null,
}

// ── logger ────────────────────────────────────────────────────────────────────

const TAG = 'db:seed   '

function info(msg)  { console.log(`${TAG} ${msg}`) }
function warn(msg)  { console.warn(`${TAG} warn: ${msg}`) }
function error(msg) { console.error(`${TAG} error: ${msg}`) }
function sql(msg)   { if (flags.verbose) console.log(`           ${msg}`) }

// ── helpers ───────────────────────────────────────────────────────────────────

function findModelFiles(dir) {
    if (!fs.existsSync(dir)) return []
    let out = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            out = out.concat(findModelFiles(full))
        } else if (entry.name.endsWith('.model.js')) {
            out.push(full)
        }
    }
    return out
}

function findSeeders() {
    const seedersPath = path.join(__dirname, '../../database/seeders')
    if (!fs.existsSync(seedersPath)) return []
    return fs
        .readdirSync(seedersPath)
        .filter((f) => f.endsWith('.js') && !f.startsWith('_'))
        .sort()
        .map((f) => ({
            name:     f.replace(/^\d+_/, '').replace('.js', ''),
            file:     path.join(seedersPath, f),
            filename: f,
        }))
}

// ── main ──────────────────────────────────────────────────────────────────────

async function seed() {
    const allSeeders = findSeeders()

    if (flags.list) {
        if (allSeeders.length === 0) {
            info('no seeders found in database/seeders/')
        } else {
            allSeeders.forEach(({ filename }) => info(filename))
        }
        return
    }

    let toRun = allSeeders

    if (flags.seeder) {
        toRun = allSeeders.filter(
            ({ name, filename }) =>
                name     === flags.seeder ||
                filename === flags.seeder ||
                filename.replace('.js', '') === flags.seeder
        )
        if (toRun.length === 0) {
            error(`seeder not found: ${flags.seeder}`)
            info('use --list to see available seeders')
            process.exit(1)
        }
    }

    if (toRun.length === 0) {
        warn('nothing to run')
        return
    }

    const start = Date.now()

    info(`connecting  ${config.database.dialect}://${config.database.host}:${config.database.port}/${config.database.database}`)

    const sequelize = new Sequelize(
        config.database.database,
        config.database.username,
        config.database.password,
        {
            host:     config.database.host,
            port:     config.database.port,
            dialect:  config.database.dialect,
            logging:  flags.verbose ? (msg) => sql(msg) : false,
            timezone: config.database.timezone,
            pool:     config.database.pool,
            define:   config.database.define,
        }
    )

    await sequelize.authenticate()

    const modelsPath = path.join(__dirname, '../../app/models')
    const models     = {}

    for (const filePath of findModelFiles(modelsPath)) {
        try {
            const def      = require(filePath)
            const instance = def(sequelize, Sequelize.DataTypes)
            models[instance.name] = instance
        } catch (err) {
            error(`could not load ${path.basename(filePath)} — ${err.message}`)
        }
    }

    for (const model of Object.values(models)) {
        if (typeof model.associate === 'function') {
            try { model.associate(models) } catch (_) {}
        }
    }

    let passed = 0
    let failed = 0

    for (const { name, file, filename } of toRun) {
        const t0 = Date.now()
        try {
            const seeder = require(file)
            if (typeof seeder.run !== 'function') {
                throw new Error('missing run(models, sequelize) export')
            }
            await seeder.run(models, sequelize)
            info(`${filename}  +${Date.now() - t0}ms`)
            passed++
        } catch (err) {
            error(`${filename}  ${err.message}`)
            if (flags.verbose) console.error(err.stack)
            failed++
        }
    }

    await sequelize.close()

    info(`${passed} passed, ${failed} failed  (${Date.now() - start}ms)`)
}

seed().catch((err) => {
    error(err.message)
    process.exit(1)
})