'use strict'

/**
 * db:migrate
 *
 * Loads all models from app/models and syncs them to the database.
 *
 * Usage:
 *   npm run db:migrate
 *   npm run db:migrate --alter
 *   npm run db:migrate --force --yes
 *   npm run db:migrate --verbose
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
    force:   args.includes('--force'),
    alter:   args.includes('--alter'),
    verbose: args.includes('--verbose'),
    yes:     args.includes('--yes'),
}

if (flags.force && !flags.yes) {
    console.error('db:migrate  --force drops all tables. add --yes to confirm.')
    process.exit(1)
}

// ── logger ────────────────────────────────────────────────────────────────────

const TAG = 'db:migrate '

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

// ── main ──────────────────────────────────────────────────────────────────────

async function migrate() {
    const start = Date.now()
    const mode  = flags.force ? 'force' : flags.alter ? 'alter' : 'safe'

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
    const modelFiles = findModelFiles(modelsPath)

    if (modelFiles.length === 0) {
        warn('no model files found in app/models')
        await sequelize.close()
        return
    }

    const models = {}

    for (const filePath of modelFiles) {
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
            try {
                model.associate(models)
            } catch (err) {
                warn(`${model.name}.associate — ${err.message}`)
            }
        }
    }

    const names = Object.keys(models)
    info(`${names.length} models  (${names.join(', ')})`)
    info(`sync --${mode}`)

    await sequelize.sync({
        force: flags.force,
        alter: flags.alter && !flags.force,
    })

    await sequelize.close()

    info(`done in ${Date.now() - start}ms`)
}

migrate().catch((err) => {
    error(err.message)
    if (flags.verbose) console.error(err.stack)
    process.exit(1)
})