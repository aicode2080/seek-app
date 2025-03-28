#!/usr/bin/env node

const commander = require('commander');
const packageJson = require('../package.json');
const chalk = require('chalk');
const { exec, spawn } = require('child_process');
const path = require('path');

console.log(chalk.green('******欢迎使用seek-app脚手架******'));

// 设置版本号
commander.version(
  `seek-app当前版本号：${chalk.green(packageJson.version)}`,
  '-v, --version',
  '显示当前版本号'
);

// 添加更新选项
commander
  .command('update')
  .alias('u')
  .description('更新到最新版本')
  .action(async () => {
    console.log(chalk.yellow(`当前版本：${packageJson.version}`));
    console.log(chalk.blue('正在更新 seek-app 到最新版本...'));

    // 先获取最新版本号
    exec('npm view seek-app version', (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`获取最新版本号失败：${error.message}`));
        return;
      }

      const latestVersion = stdout.trim();

      // 如果最新版本与当前版本相同，提示已是最新
      if (latestVersion === packageJson.version) {
        console.log(chalk.yellow('当前已是最新版本！'));
        return;
      }

      // 安装最新版本
      exec('npm i seek-app@latest -g', async (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`更新失败：${error.message}`));
          return;
        }

        console.log(chalk.green(`更新成功！新版本号：${latestVersion}`));
      });
    });
  });

// 添加调试选项
commander
  .command('debug')
  .alias('d')
  .description('调试模式')
  .action(async (name) => {
    console.log(chalk.blue('===== 调试信息 ====='));

    // 显示当前版本信息
    console.log(chalk.yellow('版本信息：'));
    console.log(`当前版本：${packageJson.version}`);

    // 显示 Node.js 环境信息
    console.log(chalk.yellow('\n环境信息：'));
    console.log(`Node.js 版本：${process.version}`);
    console.log(`操作系统：${process.platform}`);
    console.log(`系统架构：${process.arch}`);

    // 显示依赖信息
    console.log(chalk.yellow('\n依赖信息：'));
    Object.entries(packageJson.dependencies).forEach(([dep, version]) => {
      console.log(`${dep}: ${version}`);
    });

    // 显示全局安装路径
    exec('npm root -g', (error, stdout, stderr) => {
      if (!error) {
        console.log(chalk.yellow('\n全局安装路径：'));
        console.log(stdout.trim());
      }
    });

    console.log(chalk.blue('\n===== 调试信息结束 ====='));
  });

// 添加关闭调试模式选项
commander
  .command('close-debug')
  .alias('c')
  .description('关闭调试模式')
  .action(async () => {
    console.log(chalk.blue('===== 关闭调试模式 ====='));
    
    // 设置环境变量来关闭调试
    process.env.NODE_ENV = 'production';
    
    // 关闭调试相关的日志输出
    console.log(chalk.yellow('已关闭调试模式'));
    console.log(chalk.yellow('当前环境：') + chalk.green(process.env.NODE_ENV));
    
    // 显示当前状态
    console.log(chalk.yellow('\n调试状态：') + chalk.red('已关闭'));
    console.log(chalk.blue('\n===== 调试模式已关闭 ====='));
  });

// 执行git自动化命令
commander
  .command('git')
  .alias('g')
  .description('git操作')
  .action(async (name) => {
    console.log(chalk.green(`******执行git自动化命令******`));
    const gitAutoPath = path.join(__dirname, 'git-auto.js');
    
    const gitProcess = spawn('node', [gitAutoPath], {
      stdio: 'inherit',
      shell: true
    });

    gitProcess.on('error', (error) => {
      console.error(chalk.red(`执行失败：${error.message}`));
    });

    gitProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`命令执行失败，退出码：${code}`));
      }
      console.log(chalk.yellow('\n执行结束'));
    });
  });

// 执行schema 转换成interface typescript 
commander
  .command('async')
  .alias('s')
  .description('自动化生成ts命令')
  .action(async (name) => {
    console.log(chalk.green(`******执行typscript自动化命令******`));
    const schemaAutoPath = path.join(__dirname, 'interface-auto.js');
    const schemaProcess = spawn('node', [schemaAutoPath], {
      stdio: 'inherit',
      shell: true
    });
    schemaProcess.on('error', (error) => {
      console.error(chalk.red(`执行失败：${error.message}`));
    });

    schemaProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`命令执行失败，退出码：${code}`));
      }
      console.log(chalk.yellow('\n执行结束'));
    });
  });


// 解析命令行参数
commander.parse(process.argv);
