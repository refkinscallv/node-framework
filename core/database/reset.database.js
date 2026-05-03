'use strict'

/**
 * db:reset
 *
 * Drops all tables and recreates them. Optionally runs seeders after.
 * Requires confirmation unless --yes is passed.
 *
 * Usage:
 *   npm run db:reset
 *   npm run db:reset --yes
 *   npm run db:reset --seed --yes
 *   npm run db:reset --verbose
 */

require('module-alias/register')
require('dotenv').config()

const { Sequelize } = require('sequelize')
const fs       = require('fs')
const path     = require('path')
const readline = require('readline')
const config   = require('@app/config')

// ── args ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const flags = {
    yes:     args.includes('--yes'),
    seed:    args.includes('--seed'),
    verbose: args.includes('--verbose'),
}

// ── logger ────────────────────────────────────────────────────────────────────

const TAG = 'db:reset  '

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

function confirm(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        rl.question(question, (answer) => {
            rl.close()
            resolve(['y', 'yes'].includes(answer.trim().toLowerCase()))
        })
    })
}

// ── main ──────────────────────────────────────────────────────────────────────

async function reset() {
    const db = `${config.database.dialect}://${config.database.host}:${config.database.port}/${config.database.database}`

    warn(`this will drop all tables in ${db}`)

    const confirmed = flags.yes || (await confirm(`${TAG} continue? (y/N) `))
    if (!confirmed) {
        info('cancelled')
        process.exit(0)
    }

    const start = Date.now()

    info(`connecting  ${db}`)

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

    const models = {}

    for (const filePath of findModelFiles(path.join(__dirname, '../../app/models'))) {
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

    info(`${Object.keys(models).length} models loaded`)
    info('dropping tables')

    await sequelize.sync({ force: true })

    info('tables recreated')

    if (flags.seed) {
        const seeders = findSeeders()
        if (seeders.length === 0) {
            warn('--seed given but no seeders found in database/seeders/')
        } else {
            let passed = 0
            let failed = 0

            for (const { file, filename } of seeders) {
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

            info(`${passed} passed, ${failed} failed`)
        }
    }

    await sequelize.close()

    info(`done in ${Date.now() - start}ms`)
}

reset().catch((err) => {
    error(err.message)
    if (flags.verbose) console.error(err.stack)
    process.exit(1)
})