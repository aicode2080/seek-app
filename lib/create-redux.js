#! /usr/bin/env node
const commander = require('commander');

const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const inquirer = require('inquirer');

// 定义模板文件路径
const templatePath = path.join(__dirname, '../template/redux-module/slice.ts');
const templateCssPath = path.join(__dirname, '../template/redux-module/store.ts');

commander
  .name('redux-module')
  .version(packageJson.version)
  .description('自动化创建一个redux模块')
  .option('-n, --name <name>', 'Project name')
  .option('-p, --path <path>', 'Path to create the project')
  .action(async () => {
    // 使用 commander 获取的选项作为默认值（如果提供了的话）
    const defaultName = commander.opts().name;
    const defaultPath = commander.opts().path || process.cwd(); // 如果没有指定路径，则使用当前工作目录

    // 使用 inquirer 获取用户输入
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter project name:(默认是"Redux Module")',
        default: defaultName, // 提供 commander 提供的默认值作为 inquirer 的默认值
      },
      {
        type: 'input',
        name: 'path',
        message: 'Enter the path to create the project:（默认是"./"）',
        default: defaultPath, // 提供 commander 提供的默认值作为 inquirer 的默认值
      },
    ]);

    const projectName = answers.name;
    const projectPath = path.resolve(answers.path); // 解析路径为绝对路径，确保路径正确性
    const projectDir = path.join(projectPath, projectName); // 组合路径和项目名以形成完整项目路径
    createReactModule(projectName, projectDir);
  });

// 异步函数来创建文件
async function createReactModule(proName, dir) {
  try {
    const targetFileName = 'slice.tsx'; // 可以根据需要修改文件名
    const targetCssFileName = 'store.tsx'; // 可以根据需要修改文件名
    const targetPath = path.join(dir, targetFileName);
    const targetCssPath = path.join(dir, targetCssFileName);
    // 创建项目目录结构（示例）
    fs.mkdirSync(dir, { recursive: true }); // 创建目录，包括父目录（如果需要的话）
    // 读取模板文件内容
    const templateContent = await fs.readFileSync(templatePath, 'utf8');
    const templateCssContent = await fs.readFileSync(templateCssPath, 'utf8');

    // 根据需要修改模板内容
    // 例如，替换默认的模块名称或其他占位符
    const modifiedContent = templateContent.replace(
      'Redux Module',
      '我是自动化创建文件'
    );
    await fs.writeFileSync(targetCssPath, templateCssContent, 'utf8');
    // 写入新文件
    await fs.writeFileSync(targetPath, modifiedContent, 'utf8');
    console.log(`Created ${proName} in ${dir}`);
  } catch (error) {
    console.error('Error creating React module:', error);
  }
}
commander.parse(process.argv); // 解析命令行参数，触发 action 函数执行逻辑。
