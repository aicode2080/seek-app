const chalk = require('chalk');
const fs = require('fs');
const generate = require('json-schema-to-typescript');
// const schema1 = require('../schema.json'); // 引入你的 schema 文件

const path = require('path');
async function generateTypes() {
  try {
  const currentDir = process.cwd();
  let schema = path.join(currentDir, 'schema.json'); // 引入你的 schema 文件
  if(!fs.existsSync(schema)) {
    // 如果不存在，则创建
     schema = path.join(__dirname,'../', 'template' ,'schema.json');
    const readSchema = fs.readFileSync(schema, 'utf-8');
    const targetPath = path.join(currentDir, 'schema.json');
    await fs.writeFileSync(targetPath, readSchema);
  } 
   // const schemaContent = fs.readFile(schema, 'utf-8'); // 读取 schema 文件内容
   const schemaContent = require(schema); // 读取 schema 文件内容
   const typeName = 'PageProps'; // 你想要生成的 TypeScript 接口名称
   const tsType = await generate.compile(schemaContent, typeName); // 生成 TypeScript 类型定义
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
