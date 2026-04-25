#!/usr/bin/env node

const { program } = require('commander');
const degit = require('degit');
const chalk = require('chalk');
const ora = require('ora');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

program
  .version('1.0.0')
  .argument('<project-directory>', 'Project directory name')
  .action(async (projectName) => {
    const targetDir = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(targetDir)) {
      console.error(chalk.red(`\nError: Directory "${projectName}" already exists.`));
      process.exit(1);
    }

    console.log(chalk.cyan(`\nCreating a new Node.js Framework project in: ${targetDir}\n`));
    const spinner = ora('Downloading framework template...').start();

    try {
      // Degit format: username/repo
      const emitter = degit('refkinscallv/node-framework', {
        cache: false,
        force: true,
        verbose: false,
      });

      await emitter.clone(targetDir);
      spinner.succeed('Template downloaded successfully.');

      console.log(chalk.cyan('\nInstalling dependencies and setting up environment... (this may take a while)'));
      
      execSync('npm run setup', { 
        stdio: 'inherit',
        cwd: targetDir 
      });

      console.log(chalk.green(`\nSuccess! Project ${projectName} has been created.`));
      console.log(chalk.white(`\nNext steps:`));
      console.log(chalk.yellow(`  cd ${projectName}`));
      console.log(chalk.yellow(`  npm run dev\n`));

    } catch (error) {
      spinner.fail('Failed to download template.');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse(process.argv);
