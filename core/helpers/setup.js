'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { execSync } = require('child_process')

const ROOT = path.join(__dirname, '../..')

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ok = (msg) => console.log(`  \x1b[32m✔\x1b[0m  ${msg}`)
const info = (msg) => console.log(`  \x1b[36mℹ\x1b[0m  ${msg}`)
const fail = (msg) => { console.error(`  \x1b[31m✖\x1b[0m  ${msg}`); process.exit(1) }
const step = (msg) => console.log(`\n\x1b[1m${msg}\x1b[0m`)

// ─── 1. Node.js version check ─────────────────────────────────────────────────

step('1. Checking Node.js version...')

const [major] = process.versions.node.split('.').map(Number)
const required = 24

if (major < required) {
    fail(`Node.js >= ${required} is required. Current: v${process.versions.node}\n     Download: https://nodejs.org/`)
}

ok(`Node.js v${process.versions.node}`)

// ─── 2. Detect package manager ───────────────────────────────────────────────

step('2. Detecting package manager...')

function detectPm() {
    const execPath = process.env.npm_execpath || ''
    if (execPath.includes('yarn')) return 'yarn'
    if (execPath.includes('pnpm')) return 'pnpm'
    if (fs.existsSync(path.join(ROOT, 'pnpm-lock.yaml'))) return 'pnpm'
    if (fs.existsSync(path.join(ROOT, 'yarn.lock'))) return 'yarn'
    return 'npm'
}

const pm = detectPm()
ok(`Using ${pm}`)

// ─── 3. Install dependencies if node_modules is missing ──────────────────────

step('3. Checking dependencies...')

const nmDir = path.join(ROOT, 'node_modules')

if (!fs.existsSync(nmDir)) {
    info('node_modules not found — installing dependencies...')
    try {
        const installCmd = pm === 'yarn' ? 'yarn install' : pm === 'pnpm' ? 'pnpm install' : 'npm install'
        execSync(installCmd, { cwd: ROOT, stdio: 'inherit' })
        ok('Dependencies installed')
    } catch {
        fail('Dependency installation failed. Run manually: npm install')
    }
} else {
    ok('node_modules already present')
}

// ─── 4. Copy .env.example → .env ─────────────────────────────────────────────

step('4. Setting up .env...')

const envPath = path.join(ROOT, '.env')
const envExamplePath = path.join(ROOT, '.env.example')

if (!fs.existsSync(envPath)) {
    if (!fs.existsSync(envExamplePath)) {
        fail('.env.example not found — cannot create .env')
    }
    fs.copyFileSync(envExamplePath, envPath)
    ok('.env created from .env.example')
} else {
    ok('.env already exists')
}

// ─── 5. Generate JWT secrets ──────────────────────────────────────────────────

step('5. Generating JWT secrets...')

const PLACEHOLDERS = [
    'your-secret-key-change-this-in-production',
    'your-refresh-secret-key-change-this-in-production',
    '',
]

function needsSecret(value) {
    return !value || PLACEHOLDERS.includes(value.trim())
}

try {
    let envContent = fs.readFileSync(envPath, 'utf8')
    let changed = false

    function replaceSecret(key) {
        const regex = new RegExp(`^(${key}=)(.*)$`, 'm')
        const match = envContent.match(regex)
        if (match && needsSecret(match[2])) {
            const secret = crypto.randomBytes(48).toString('hex')
            envContent = envContent.replace(regex, `$1${secret}`)
            changed = true
            return true
        }
        return false
    }

    const jwtUpdated = replaceSecret('JWT_SECRET')
    const refreshUpdated = replaceSecret('JWT_REFRESH_SECRET')

    if (changed) {
        fs.writeFileSync(envPath, envContent, 'utf8')
        if (jwtUpdated) ok('JWT_SECRET generated')
        if (refreshUpdated) ok('JWT_REFRESH_SECRET generated')
    } else {
        ok('JWT secrets already configured')
    }
} catch (err) {
    fail(`Failed to update .env: ${err.message}`)
}

// ─── 6. Create runtime directories ───────────────────────────────────────────

step('6. Creating runtime directories...')

const dirs = ['logs', 'tmp', 'public/uploads']

for (const dir of dirs) {
    const fullPath = path.join(ROOT, dir)
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
        ok(`Created ${dir}/`)
    } else {
        ok(`${dir}/ already exists`)
    }
}

// ─── Done ─────────────────────────────────────────────────────────────────────

console.log(`
\x1b[32m\x1b[1m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Setup complete! Your app is ready.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m

  Next steps:

    1. Edit \x1b[1m.env\x1b[0m with your database and mail credentials
    2. Run \x1b[1mnpm run dev\x1b[0m to start the development server
    3. Visit \x1b[1mhttp://localhost:3030\x1b[0m

  Optional:

    npm run db:migrate    Migrate database
    npm run db:seed       Seed database
    npm test              Run test suite

`)
