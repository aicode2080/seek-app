#! /usr/bin/env node

const commander = require('commander');
const { exec } = require('child_process');

const inquirer = require('inquirer');
const chalk = require('chalk');

const path = require('path');
const fs = require('fs');

const cmdArr = [
  '一键提交',
  'init',
  'pull',
  'add',
  'commit',
  'push',
  'q',
  'amend',
];

console.log(chalk.green('=======欢迎使用 Git 自动化工具======='));

/**
 * 获取用户输入的命令。
 *
 * 该函数使用 inquirer 库提示用户选择要执行的命令，并返回所选命令。
 * 用户可以从预定义的命令数组中选择，默认选择为 'pull'。
 *
 * @async
 * @function getUserInput
 * @returns {Promise<string|undefined>} 返回用户选择的命令，如果发生错误则返回 undefined。
 * @throws {Error} 如果在提示过程中发生错误，将打印错误信息。
 */
async function getUserInput() {
  try {
    const { chooseIndex } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chooseIndex',
        message: '请选择要执行的命令',
        default: 'pull',
        choices: cmdArr.map((item, index) => ({
          name: item,
          value: index + 1,
        })),
      },
    ]);
    console.log(chooseIndex);

    return cmdArr[chooseIndex - 1];
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * 初始化函数，获取用户输入并执行相应操作。
 *
 * @async
 * @function init
 * @throws {Error} 如果获取用户输入失败，将打印错误信息。
 * @returns {void}
 */
async function init() {
  try {
    const selectCmd = await getUserInput();
    if (selectCmd === 'q') {
      console.log('退出 Git 自动化工具。');
      return;
    }
    console.log(`您输入了${selectCmd}正在为您执行操作...`);
    switch (selectCmd) {
      case 'init':
        gitInit();
        break;
      case 'pull':
        gitPull();
        break;
      case 'add':
        gitAdd();
        break;
      case 'log':
        gitLog();
        break;
      case 'status':
        gitStatus();
        break;
      case 'commit':
        gitCommit();
        break;
      case 'push':
        gitPush();
        break;
      case '一键提交':
        await gitAdd();
        await gitCommit();
        gitPush();
        break;
      case 'amend':
        await gitAdd();
        await gitAmend();
        gitPush();
        break;
      default:
        console.log('您输入了错误的命令');
        break;
    }
  } catch (error) {
    console.log(error.message);
  }
}
/**
 * 移除 Git 索引锁文件。
 *
 * 此函数检查项目目录下的 .git/index.lock 文件是否存在，
 * 如果存在，则删除该文件，并在控制台输出相应的提示信息。
 *
 * @function removeIndexLock
 * @returns {void}
 */
async function removeIndexLock() {
  const lockFilePath = path.join(__dirname, '..', '.git', 'index.lock');
  if(fs.existsSync(lockFilePath)) {
    await fs.unlinkSync(lockFilePath);
    await fs.accessSync(lockFilePath);
  }
  console.log('Removed existing index.lock file.');
}

function gitInit(params) {
  // 初始化仓库
  cmdExec('init');
}

function gitPull(params) {
  console.log('现在为您拉取最新代码...');
  // 初始化仓库
  cmdExec('pull');
}

function gitStatus(params) {
  // 初始化仓库
  cmdExec('status');
}
function gitLog(params) {
  // 初始化仓库
  cmdExec('log');
}

async function gitAmend(params) {
  // 初始化仓库
  await removeIndexLock();
  await cmdExec('commit --amend');
}

function cmdExec(cmdText) {
  return new Promise((resolve, reject) => {
    exec(`git ${cmdText}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令 "${cmdText}" 时出错: ${error.message}`);
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`stdout: ${stdout}`);
      resolve();
    });
  });
}

async function gitAdd(params) {
  removeIndexLock();
  // 添加文件到暂存区
  const inputText = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: '请输入要添加的文件名或路径',
    },
  ]);
  console.log('正在执行添加操作', inputText.text);
  try {
    const command = inputText.text ? `git add ${inputText.text}` : 'git add .';
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`添加文件时出错: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`已经添加到暂存区: ${stdout}`);
    });
  } catch (error) {
    console.log(error.message);
  }
}

async function gitCommit(params) {
  // 提交更改
  const inputText = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: '请输入提交信息',
      default: '修改',
    },
  ]);
  console.log('正在执行添加操作', inputText.text);
  exec(`git commit -m "${inputText.text}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`提交更改时出错: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

function gitPush(params) {
  // 推送到远程仓库
  cmdExec('push');
}

init();

// 解析命令行参数
commander.parse(process.argv);
