import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import prettier from 'prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

async function initEslint(successCallback) {
  console.log(chalk.green('******配置 ESLint******'));
  try {
    // 获取当前工作目录
    const cwd = process.cwd();
    
    // 检查是否是有效的项目目录
    if (!fs.existsSync(path.join(cwd, 'package.json'))) {
      console.error(chalk.red('错误：当前目录不是有效的项目目录'));
      return;
    }

    // 读取 ESLint 配置文件内容
    const eslintConfigPath = path.join(__dirname, 'eslint.config.js');
    const eslintConfig = fs.readFileSync(eslintConfigPath, 'utf8');

    // 格式化配置内容
    const formattedConfig = prettier.format(eslintConfig, {
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

    // 写入 eslint.config.js 文件
    const targetConfigPath = path.join(cwd, 'eslint.config.js');
    if(!fs.existsSync(targetConfigPath)) {
      fs.writeFileSync(targetConfigPath, formattedConfig);
      console.log(chalk.green('✓ 创建eslint.config.js成功'));
    }

    const eslintJsonPath = path.join(__dirname, '.eslintrc.json');
    const eslintJson = fs.readFileSync(eslintJsonPath, 'utf8');

   
    // 写入 .eslintrc.json 文件
    const targetJsonPath = path.join(cwd, '.eslintrc.json');
    if(!fs.existsSync(targetJsonPath)) {
      fs.writeFileSync(targetJsonPath, eslintJson);
      console.log(chalk.green('✓ 创建.eslintrc.json成功'));
    }

    // 创建 .eslintignore 文件
    const ignoreContent = `node_modules
dist
build
coverage
.next
.eslintignore
eslint.config.js
.prettierrc.js
static
eslint.config.js`.trim();
    
           await fs.writeFile(path.join(cwd, '.eslintignore'), ignoreContent);

    // 安装必要的依赖
    const dependencies = [
      'eslint@^7.0.0',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-jsx-a11y',
      'eslint-config-react-app',
      '@typescript-eslint/parser@^4.0.0',
      '@typescript-eslint/eslint-plugin@^4.0.0',
      'eslint-plugin-prettier',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'prettier'
    ];

    console.log(chalk.blue('正在安装 ESLint 相关依赖...'));

    // 使用 npm 安装依赖
    const installProcess = spawn('npm', ['install', '--save-dev', ...dependencies, '--force'], {
      cwd,
      stdio: 'inherit'
    });

    installProcess.on('close', async (code) => {
      if (code === 0) {
        console.log(chalk.green('✓ ESLint 依赖安装成功'));

        // 添加 lint 脚本到 package.json
        const pkgPath = path.join(cwd, 'package.json');
        const pkg = require(pkgPath);

        if (!pkg.scripts) {
          pkg.scripts = {};
        }

        pkg.scripts.lint = 'eslint . --ext .js,.jsx,.ts,.tsx';
        pkg.scripts['lint:fix'] = 'eslint . --ext .js,.jsx,.ts,.tsx --fix';

        await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
        console.log(chalk.green('✓ 已添加 lint 脚本到 package.json'));

        
        console.log(chalk.green('✓ 已创建 .eslintignore 文件'));
        console.log(chalk.blue('\n现在你可以使用以下命令：'));
        console.log(chalk.yellow('npm run lint      - 检查代码'));
        console.log(chalk.yellow('npm run lint:fix  - 自动修复代码'));
        successCallback?.();
      } else {
        console.error(chalk.red('依赖安装失败'));
      }
    });
  } catch (error) {
    console.error(chalk.red(`配置 ESLint 失败：${error.message}`));
  }
}

export default initEslint;