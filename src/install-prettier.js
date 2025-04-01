import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import prettier from 'prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

async function installPrettier(successCallback) {
    try {
        const cwd = process.cwd();
        if(!fs.existsSync(path.join(cwd, 'package.json'))) {
            console.error(chalk.red('当前目录下不存在 package.json 文件'));
            return;
        }

        // 生成 .prettierrc 文件
        const prettierPath = path.join(cwd, '.prettierrc.js');
        // const prettierc = fs.readFileSync(prettierPath,'utf-8')
        
        if(!fs.existsSync(prettierPath)) {
            const cprettier = path.join(__dirname, '.prettierrc.js');
            const prettierContent = fs.readFileSync(cprettier,'utf-8');
             // 格式化配置内容
             const formattedConfig = prettier.format(prettierContent, {
                parser: 'babel',
                semi: true,
                singleQuote: true,
                trailingComma: 'es5',
                printWidth: 100,
                tabWidth: 2,
                useTabs: false,
                bracketSpacing: true,
                arrowParens: 'avoid'
              });
           await fs.writeFile(prettierPath, formattedConfig);
           console.log(chalk.green('生成 .prettierrc 文件成功'));
           
        }
        // 生成 .prettierignore 文件
        const ignorePath = path.join(cwd, '.prettierignore');
        
        if(!fs.existsSync(ignorePath)) {
            const cprettierIgnore = path.join(__dirname, '.prettierignore');
            const prettierIgnContent = fs.readFileSync(cprettierIgnore,'utf-8')
           await fs.writeFile(ignorePath, prettierIgnContent);
           console.log(chalk.green('生成 .prettierignore 文件成功'));
        }

        // 添加脚本
         const pkgPath = path.join(cwd, 'package.json');
                const pkg = require(pkgPath);
                if (!pkg.scripts) {
                  pkg.scripts = {};
                }
        // "prettier": "prettier --write --ignore-unknown .",
        if(!pkg.scripts.prettier) {
            pkg.scripts.prettier = 'prettier --write --ignore-unknown .';
            await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
            console.log(chalk.green('添加 prettier 脚本成功'));
        }

        successCallback?.();

    } catch (error) {
        console.error(chalk.red(`配置 prettier 失败：${error.message}`));
    }


}

export default installPrettier;