const chalk = require('chalk');
const fs = require('fs');
const generate = require('json-schema-to-typescript');
// const schema1 = require('../schema.json'); // 引入你的 schema 文件

const path = require('path');
// console.log(schema1);

const currentDir = process.cwd();
const schema = require(path.join(currentDir, 'schema.json')); // 引入你的 schema 文件
console.log(generate);
async function generateTypes() {
  try {
    const typeName = 'PageProps'; // 你想要生成的 TypeScript 接口名称
    const tsType = await generate.compile(schema, typeName); // 生成 TypeScript 类型定义
    fs.writeFileSync('interface.ts', tsType); // 将类型定义写入文件
    console.log(
      chalk.green(
        '=========Typescript interface generated successfully========='
      )
    );
  } catch (error) {
    console.error(
      chalk.yellow('请检查项目根目录是否有schma.json文件或文件格式是否正确'),
      error
    );
  }
}

generateTypes(); // 调用函数生成类型定义
