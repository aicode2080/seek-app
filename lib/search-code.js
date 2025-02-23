// 根据搜索词 复制对应 code-template 文件夹下面的代码

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const chalk = require('chalk'); // 用于在控制台输出彩色文本

const commander = require('commander');

const packageJson = require('../package.json');

const templatePath = path.join(__dirname, '../code-template'); // 模板文件路径

async function createMainFun(params) {
  commander.version(packageJson.version).action(async () => {
    await inputFun();
  });
}

/**
 * 异步函数，用于提示用户输入搜索词。
 * @param {Object} params - 输入参数（当前未使用）。
 * @returns {Promise<void>} - 无返回值的 Promise。
 */
async function inputFun(params) {
  const inputText = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: '请输入搜索词：',
      default: '美化滚动条',
    },
  ]);
  const searchText = inputText.text;
  console.log(`您输入了${searchText}, 正在搜索中...`);
  readFileContent(searchText);
}

/**
 * 根据指定的文件类型列出目录中的所有文件。
 *
 * @async
 * @function listFilesByType
 * @param {string} dirPath - 需要读取的目录路径。
 * @param {string} fileType - 要过滤的文件类型（不带点）。
 * @throws {Error} 读取目录时发生的错误。
 * @returns {Promise<void>} 无返回值。
 */
async function listFilesByType(dirPath, fileType, text) {
  try {
    let result = [];
    const files = await fs.readdirSync(dirPath);
    let filteredFiles;
    if (fileType === '*') {
      filteredFiles = files;
    } else {
      filteredFiles = files.filter(
        (file) => path.extname(file) === `.${fileType}`
      );
    }

    console.log(`Files of type .${fileType} in ${dirPath}:`);
    if (filteredFiles?.length > 0) {
      result = await filteredFiles.filter((file) => file.indexOf(text) > -1);
    } else {
      reject(new Error(`没有找到匹配的代码片段`));
      console.log('没有找到匹配的代码片段');
    }
    console.log(result);
    return result;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
}
/**
 * 异步读取指定文件内容并输出到控制台。
 * 
 * @param {string} text - 用于搜索文件的文本。
 * @returns {Promise<void>} - 无返回值的 Promise。
 * 
 * @throws {Error} - 如果读取文件或其他操作失败，将抛出错误。
 * 
 * 该函数首先列出指定路径下的文件，然后提示用户选择要复制的文件，最后读取并输出所选文件的内容。
 */
async function readFileContent(text) {
  try {
    console.log(templatePath);
    const res = await listFilesByType(templatePath, '*', text);
    // console.log(chalk.yellow('搜索结果：'), res);
    const choices = res.map((item, index) => ({
      name: item,
      value: index + 1,
    }));
    // 让用户选择文件
    const { selectedFileIndex } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedFileIndex',
        message: '请选择代码片段文件:',
        choices: choices,
      },
    ]);
    const selectedFile = res[selectedFileIndex - 1];
    const filePath = path.join(templatePath, selectedFile);

    // 读取文件内容
    const content = await fs.readFileSync(filePath, 'utf8');
    console.log(content);
  } catch (error) {
    console.error(error.message);
  }
}
// 主函数
createMainFun();

commander.parse(process.argv);
