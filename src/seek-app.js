import program from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { exec, spawn } from 'child_process';
import prettier from 'prettier';
import handleCodeReview from './code-review-command.js';
import lintFiles from './eslint.js';
import installEslint from './install-eslint.js';
import installPrettier from './install-prettier.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import { developmentConfig } from './rollupConfig/index.js';
// import { productionConfig } from './rollupConfig/index.js';
// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json 中的版本号
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

program
  .version(version, '-v, --version', '显示版本号')
  .command('v')
  .description('显示版本信息')
  .action(() => {
    console.log(chalk.blue('版本信息：'));
    console.log(chalk.green(`seek-app: ${version}`));
    console.log(chalk.green(`Node.js: ${process.version}`));
    process.exit(0);
  });

program
  .command('path')
  .alias('pt')
  .description('显示路径信息')
  .action(() => {
    console.log(chalk.blue(`安装路径：${__dirname}`));
    process.exit(0);
  });

// 添加更新选项
program
  .command('update')
  .alias('u')
  .description('更新到最新版本')
  .action(async () => {
    console.log(chalk.yellow(`当前版本：${version}`));
    console.log(chalk.blue('正在更新 seek-app 到最新版本...'));

    // 先获取最新版本号
    exec('npm view seek-app version', (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`获取最新版本号失败：${error.message}`));
        process.exit(1);
      }

      const latestVersion = stdout.trim();

      // 如果最新版本与当前版本相同，提示已是最新
      if (latestVersion === version) {
        console.log(chalk.yellow('当前已是最新版本！'));
        process.exit(0);
      }

      // 安装最新版本
      exec('npm i seek-app@latest -g', async (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`更新失败：${error.message}`));
          return;
        }

        console.log(chalk.green(`更新成功！新版本号：${latestVersion}`));
        process.exit(0);
      });
    });
  });

// 添加调试选项
program
  .command('debug')
  .alias('d')
  .description('调试模式')
  .action(async (name) => {
    console.log(chalk.blue('===== 调试信息 ====='));

    // 显示当前版本信息
    console.log(chalk.yellow('版本信息：'));
    console.log(`当前版本：${version}`);

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
    process.exit(0);
  });

// 添加关闭调试模式选项
program
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
    process.exit(0);
  });

// 执行git自动化命令
program
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

// 执行自动创建组件模块
program
  .command('cmodule')
  .alias('cm')
  .description('创建组件模块')
  .action(async (name) => {
    console.log(chalk.green(`******执行创建模块自动化命令******`));
    const reactAutoPath = path.join(__dirname, 'create-module.js');
    const reactProcess = spawn('node', [reactAutoPath], {
      stdio: 'inherit',
      shell: true
    });

    reactProcess.on('error', (error) => {
      console.error(chalk.red(`执行失败：${error.message}`));
    });

    reactProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(chalk.red(`命令执行失败，退出码：${code}`));
      }
      console.log(chalk.yellow('\n执行结束'));
    });
  });

// 执行schema 转换成interface typescript 
program
  .command('typescript')
  .alias('ts')
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
      process.exit(1);
    });
  });
// 执行eslint配置命令
program
  .command('lint')
  .alias('l')
  .description('代码检查')
  .option('-d, --dir <dir>', '指定要检查的目录', process.cwd())
  .option('-f, --fix', '自动修复问题')
  .option('-e, --ext <extensions>', '指定要检查的文件扩展名，用逗号分隔', '.js,.jsx,.ts,.tsx')
  .action(async (options) => {
    await installEslint(async () => {
      try {
        console.log(chalk.blue('开始代码检查...'));
        const extensions = options.ext.split(',').map(ext => ext.trim());
        const errorCount = await lintFiles({
          targetDir: options.dir,
          extensions,
          fix: options.fix
        });

        if (errorCount > 0) {
          console.log(chalk.red(`检查完成，发现 ${errorCount} 个错误`));
          process.exit(1);
        } else {
          console.log(chalk.green('检查完成，未发现错误'));
        }
      } catch (error) {
        console.error(chalk.red(`代码检查失败：${error.message}`));
        process.exit(1);
      }
    })
  });

// 执行prettier命令
program
  .command('prettier')
  .alias('p')
  .description('格式化代码')
  .option('-d, --dir <dir>', '指定要美化的目录', process.cwd())
  .option('-e, --ext <extensions>', '指定要美化的文件扩展名，用逗号分隔', '.js,.jsx,.ts,.tsx')
  .action(async (options) => {
    try {
      const dependencies = ["prettier@^2.0.0"];
      const cwd = process.cwd();
      // 使用 npm 安装依赖
      const installProcess = spawn('npm', ['install', '--save-dev', ...dependencies, '--force'], {
        cwd,
        stdio: 'inherit'
      });
      installProcess.on('close', async (code) => {
        if (code === 0) {
          installPrettier(() => {
            console.log(chalk.green('✓ 安装prettier 依赖成功'));
            console.log(chalk.blue('\n现在你可以使用以下命令：'));
            console.log(chalk.yellow('执行 npm run prettier - 格式化代码'));
            process.exit(1);
          });
        } else {
          console.error(chalk.red('依赖安装失败'));
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

// 添加代码审核命令
program
  .command('rule')
  .alias('r')
  .description('代码审核')
  .option('-d, --dir <directory>', '指定要审核的目录', process.cwd())
  .option('-m, --model <model>', '指定 AI 模型', 'gpt-4')
  .option('-t, --temperature <number>', '设置温度参数', '0.7')
  .option('-k, --max-tokens <number>', '设置最大 token 数', '2000')
  .action(async (options) => {
    await handleCodeReview({
      targetDir: options.dir,
      model: options.model,
      temperature: parseFloat(options.temperature),
      maxTokens: parseInt(options.maxTokens)
    });
  });


program
  .command('create <project-name>')
  .alias('ct')
  .description('创建一个新的 Seek App 项目')
  .action(async (projectName) => {
    try {
      console.log(chalk.blue('正在创建项目...'));

      // 获取模板目录的绝对路径
      const templateDir = path.resolve(__dirname, '../template');

      // 确保目标目录不存在
      const targetDir = path.resolve(process.cwd(), projectName);
      if (fs.existsSync(targetDir)) {
        console.error(chalk.red(`错误: 目录 ${projectName} 已存在`));
        process.exit(1);
      }

      // 复制模板文件
      fs.copySync(templateDir, targetDir);

      // 进入项目目录
      process.chdir(targetDir);

      // 安装依赖
      console.log(chalk.blue('正在安装依赖...'));
      exec('npm install', { stdio: 'inherit' });

      console.log(chalk.green('\n项目创建成功！'));
      console.log(chalk.blue('\n开始使用:'));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white('  npm start'));
    } catch (error) {
      console.error(chalk.red('创建项目失败:'), error);
      process.exit(1);
    }
  });

// 添加启动开发服务器命令
program
  .command('s')
  .description('启动开发服务器')
  .option('-p, --port <port>', '指定端口号', '3000')
  .option('-h, --host <host>', '指定主机名', 'localhost')
  .option('-o, --open', '自动打开浏览器')
  .option('-d, --dir <dir>', '指定输出目录', 'dist')
  .action(async (options) => {
    try {
       // 动态导入开发配置
       const { developmentConfig } = await import('./rollupConfig/index.js');
      // 设置环境变量
      process.env.NODE_ENV = 'development';
      process.env.OUTPUT_DIR = options.dir;

      const outputDir = path.resolve(process.cwd(), options.dir);

      if(fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, {
          recursive: true,
          force: true,
        });
      } else {
        fs.mkdirSync(outputDir, {
          recursive: true,
        });
      }
      // 使用 seek-app 自己的 rollup 配置

      const rollup = await import('rollup');

      // 启动开发服务器
      const watcher = await rollup.watch(developmentConfig);

      console.log(chalk.green('开发服务器已启动'));
      console.log(chalk.blue(`访问地址: http://${options.host}:${options.port}`));
      if (options.open) {
        const open = await import('open');
        await open.default(`http://${options.host}:${options.port}`);
      }

      // 监听文件变化
      watcher.on('event', event => {
        if (event.code === 'ERROR') {
          console.error(chalk.red('构建错误:'), event.error);
        } else if (event.code === 'BUNDLE_END') {
          console.log(chalk.green('构建完成'));
        }
      });

      // 优雅退出
      process.on('SIGINT', async () => {
        await watcher.close();
        process.exit(0);
      });
    } catch (error) {
      console.error(chalk.red('启动开发服务器失败:'), error);
      process.exit(1);
    }
  });

// // 添加构建命令
program
  .command('build')
  .alias('b')
  .description('构建生产环境代码')
  .option('-o, --output <dir>', '指定输出目录', 'build')
  .option('-c, --config <path>', '自定义配置文件路径')
  .action(async (options) => {
    console.log(chalk.green('******欢迎使用seek-app脚手架******'));
    try {
      // 动态导入生产配置
      const { productionConfig } = await import('./rollupConfig/index.js');
      // 设置环境变量
      process.env.NODE_ENV = 'production';
      process.env.OUTPUT_DIR = options.output;
      console.log('production', '======rollupConfig');
      // 清空输出目录
      const outputDir = path.resolve(process.cwd(), options.output);
      console.log(`正在清空目录：${outputDir}`);
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, {
          recursive: true,
          force: true,
        });
      } else {
        fs.mkdirSync(outputDir, {
          recursive: true,
        });
      }
      // 使用 seek-app 自己的 rollup 配置
      const startTime = Date.now();

      const rollup = await import('rollup');

      // 创建 bundle
      const bundle = await rollup.rollup(productionConfig);
      const { output } = await bundle.write(productionConfig.output);

      let totalSize = 0;
      output.forEach((chunk) => {
        const filePath = path.join(options.output, chunk.fileName);
        const state = fs.statSync(filePath);
        const size = (state.size / 1024).toFixed(2);
        totalSize += parseFloat(size);
        console.log(chalk.green(`文件：${chunk.fileName}，大小：${size} KB`))
      })
      // 写入文件
      // await bundle.write(productionConfig.output);
      const buildTime = (Date.now() - startTime) / 1000;

      console.log(chalk.green(`构建完成，输出目录：${options.output}`));
      console.log(chalk.blue(`构建耗时：${buildTime} 秒`));
      console.log(chalk.blue(`总大小：${totalSize} KB`));
      process.exit(1);
    } catch (error) {
      console.error(chalk.red(`构建失败：${error.message}`));
      process.exit(1);
    }
  });


// 解析命令行参数
program.parse(process.argv);
