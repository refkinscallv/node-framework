#!/usr/bin/env node

'use strict'

const { program } = require('commander')
const degit = require('degit')
const chalk = require('chalk')
const ora = require('ora')
const prompts = require('prompts')
const { execSync, spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const PKG = require('./package.json')

// ── Node.js version check ──────────────────────────────────────────────────
const [major] = process.versions.node.split('.').map(Number)
if (major < 18) {
    console.error(chalk.red(`\n✖ Node.js v18+ is required. You are running v${process.versions.node}.\n`))
    process.exit(1)
}

// ── Helpers ────────────────────────────────────────────────────────────────
function isValidProjectName(name) {
    return /^[a-z0-9]([a-z0-9\-_]*[a-z0-9])?$/.test(name)
}

function hasPackageManager(pm) {
    const result = spawnSync(pm, ['--version'], { stdio: 'ignore', shell: true })
    return result.status === 0
}

function detectPackageManager() {
    if (process.env.npm_execpath?.includes('yarn')) return 'yarn'
    if (process.env.npm_execpath?.includes('pnpm')) return 'pnpm'
    if (hasPackageManager('pnpm')) return 'pnpm'
    if (hasPackageManager('yarn')) return 'yarn'
    return 'npm'
}

// ── CLI definition ─────────────────────────────────────────────────────────
program
    .name('create-node-framework')
    .description('Scaffold a new Node Framework (MVC) project')
    .version(PKG.version, '-v, --version')
    .argument('[project-name]', 'Name of the project directory to create')
    .option('--skip-install', 'Skip dependency installation')
    .option('--skip-setup', 'Skip npm run setup (env & JWT key generation)')
    .option('--pm <manager>', 'Package manager to use: npm | yarn | pnpm')
    .action(async (projectNameArg, options) => {
        console.log()
        console.log(chalk.bold.cyan('  ┌─────────────────────────────────────┐'))
        console.log(chalk.bold.cyan('  │     Node Framework Project Creator   │'))
        console.log(chalk.bold.cyan(`  │     v${PKG.version.padEnd(32)}│`))
        console.log(chalk.bold.cyan('  └─────────────────────────────────────┘'))
        console.log()

        // ── Resolve project name ───────────────────────────────────────────
        let projectName = projectNameArg

        if (!projectName) {
            const response = await prompts(
                {
                    type: 'text',
                    name: 'name',
                    message: 'Project name:',
                    initial: 'my-app',
                    validate: (v) =>
                        isValidProjectName(v)
                            ? true
                            : 'Use lowercase letters, numbers, hyphens, and underscores only.',
                },
                { onCancel: () => process.exit(0) }
            )
            projectName = response.name
        }

        if (!projectName) {
            console.error(chalk.red('✖  Project name is required.'))
            process.exit(1)
        }

        if (!isValidProjectName(projectName)) {
            console.error(chalk.red(`✖  Invalid project name "${projectName}". Use lowercase letters, numbers, hyphens and underscores only.`))
            process.exit(1)
        }

        const targetDir = path.resolve(process.cwd(), projectName)

        if (fs.existsSync(targetDir)) {
            const { overwrite } = await prompts(
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Directory "${projectName}" already exists. Overwrite?`,
                    initial: false,
                },
                { onCancel: () => process.exit(0) }
            )
            if (!overwrite) {
                console.log(chalk.yellow('\nAborted.'))
                process.exit(0)
            }
            fs.rmSync(targetDir, { recursive: true, force: true })
        }

        // ── Detect package manager ─────────────────────────────────────────
        const pm = options.pm || detectPackageManager()
        const validPMs = ['npm', 'yarn', 'pnpm']
        if (!validPMs.includes(pm)) {
            console.error(chalk.red(`✖  Unknown package manager "${pm}". Use: npm | yarn | pnpm`))
            process.exit(1)
        }

        console.log(chalk.dim(`  Creating project in: ${targetDir}`))
        console.log(chalk.dim(`  Package manager: ${pm}`))
        console.log()

        // ── Clone template ─────────────────────────────────────────────────
        const spinner = ora('Downloading framework template...').start()

        try {
            const emitter = degit('refkinscallv/node-framework', {
                cache: false,
                force: true,
                verbose: false,
            })

            await emitter.clone(targetDir)
            spinner.succeed(chalk.green('Template downloaded.'))
        } catch (error) {
            spinner.fail('Failed to download template.')
            console.error(chalk.red(`\n${error.message}`))
            console.error(chalk.dim('Check your internet connection or try again later.'))
            process.exit(1)
        }

        // ── Remove create-cli from scaffolded project ──────────────────────
        const createCliDir = path.join(targetDir, 'create-cli')
        if (fs.existsSync(createCliDir)) {
            fs.rmSync(createCliDir, { recursive: true, force: true })
        }

        // ── Install dependencies ───────────────────────────────────────────
        if (!options.skipInstall) {
            const installSpinner = ora(`Installing dependencies with ${pm}...`).start()
            try {
                const installCmd = pm === 'yarn' ? 'yarn' : pm === 'pnpm' ? 'pnpm install' : 'npm install'
                execSync(installCmd, { stdio: 'pipe', cwd: targetDir })
                installSpinner.succeed(chalk.green('Dependencies installed.'))
            } catch (err) {
                installSpinner.fail('Failed to install dependencies.')
                console.error(chalk.red(err.message))
                console.warn(chalk.yellow(`\nYou can install manually:\n  cd ${projectName} && ${pm} install`))
            }
        }

        // ── Run setup (copy .env + generate JWT secrets) ───────────────────
        if (!options.skipSetup && !options.skipInstall) {
            const setupSpinner = ora('Running setup (generating .env & JWT keys)...').start()
            try {
                const setupCmd = pm === 'yarn' ? 'yarn setup' : pm === 'pnpm' ? 'pnpm run setup' : 'npm run setup'
                // Only run the setup helper — not the install step inside it
                execSync('node core/helpers/setup.js', { stdio: 'pipe', cwd: targetDir })
                setupSpinner.succeed(chalk.green('Environment configured.'))
            } catch (err) {
                setupSpinner.warn(chalk.yellow('Setup skipped (run "npm run setup" manually).'))
            }
        }

        // ── Success message ────────────────────────────────────────────────
        console.log()
        console.log(chalk.bold.green(`  ✔ Project "${projectName}" created successfully!`))
        console.log()
        console.log('  Next steps:')
        console.log()
        console.log(chalk.cyan(`    cd ${projectName}`))

        if (options.skipInstall) {
            const installCmd = pm === 'yarn' ? 'yarn' : pm === 'pnpm' ? 'pnpm install' : 'npm install'
            console.log(chalk.cyan(`    ${installCmd}`))
            console.log(chalk.cyan('    npm run setup        # copy .env & generate JWT keys'))
        } else if (options.skipSetup) {
            console.log(chalk.cyan('    npm run setup        # copy .env & generate JWT keys'))
        }

        console.log(chalk.cyan('    # Edit .env with your database & app settings'))
        console.log(chalk.cyan(`    ${pm === 'yarn' ? 'yarn dev' : pm === 'pnpm' ? 'pnpm dev' : 'npm run dev'}`))
        console.log()
        console.log(chalk.dim('  Documentation: https://github.com/refkinscallv/node-framework#readme'))
        console.log()
    })

program.parse(process.argv)
