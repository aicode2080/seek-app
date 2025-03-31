const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { exec, spawn } = require('child_process');
const prettier = require('prettier');
const handleCodeReview = require('./code-review-command');
const lintFiles = require('./eslint');
const installEslint = require('./install-eslint');
const installPrettier = require('./install-prettier');
// import version from '../package.json'; // 获取 package.json 中的版本号 高版本nodejs 导入方式

// 获取当前文件的目录路径
const __dirname = path.dirname(require.main.filename);

// 获取 package.json 中的版本号
const version = require('../package.json').version;

program
  .version(version, '-v, --version', '显示版本号')
  .command('v')
  .description('显示版本信息')
  .action(() => {
    console.log(chalk.blue('版本信息：'));
    console.log(chalk.green(`seek-app: ${version}`));
    console.log(chalk.green(`Node.js: ${process.version}`));
    console.log(chalk.green(`npm: ${process.env.npm_version || '未知'}`));
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
        return;
      }

      const latestVersion = stdout.trim();

      // 如果最新版本与当前版本相同，提示已是最新
      if (latestVersion === version) {
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
    Object.entries(require('../package.json').dependencies).forEach(([dep, version]) => {
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
    });
  });

program
  .command('create')
  .alias('n')
  .description('创建项目模版')
  .action(async (name) => {
    console.log(chalk.green(`******创建react公司项目模版开发中******`));
    // const schemaAutoPath = path.join(__dirname, 'interface-auto.js');
    // const schemaProcess = spawn('node', [schemaAutoPath], {
    //   stdio: 'inherit',
    //   shell: true
    // });
    // schemaProcess.on('error', (error) => {
    //   console.error(chalk.red(`执行失败：${error.message}`));
    // });

    // schemaProcess.on('close', (code) => {
    //   if (code !== 0) {
    //     console.error(chalk.red(`命令执行失败，退出码：${code}`));
    //   }
    //   console.log(chalk.yellow('\n执行结束'));
    // });
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

// 添加启动开发服务器命令
program
  .command('start')
  .alias('s')
  .description('启动开发服务器')
  .option('-p, --port <number>', '指定端口号', '3000')
  .option('-h, --host <string>', '指定主机名', 'localhost')
  .option('-c, --config <path>', '自定义配置文件路径')
  .action(async (options) => {
    console.log(chalk.green('******欢迎使用seek-app脚手架******'));
    try {
      // 设置环境变量
      process.env.NODE_ENV = 'development';
      process.env.PORT = options.port;
      process.env.HOST = options.host;

      // 检查用户项目是否安装了必要的依赖
      const userPackageJson = path.resolve(process.cwd(), 'package.json');
      if (!fs.existsSync(userPackageJson)) {
        throw new Error('未找到 package.json 文件，请确保在项目根目录下运行此命令');
      }

      const userDeps = require(userPackageJson).dependencies || {};
      const requiredDeps = [
        'rollup',
        '@rollup/plugin-babel',
        '@rollup/plugin-node-resolve',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-json',
        'rollup-plugin-terser',
        'rollup-plugin-serve',
        'rollup-plugin-livereload'
      ];

      const missingDeps = requiredDeps.filter(dep => !userDeps[dep]);
      if (missingDeps.length > 0) {
        console.log(chalk.yellow('正在安装必要的依赖...'));
        const npmProcess = spawn('npm', ['install', '--save-dev', ...missingDeps], {
          stdio: 'inherit',
          shell: true,
          cwd: process.cwd()
        });

        await new Promise((resolve) => {
          npmProcess.on('close', (code) => {
            if (code !== 0) {
              console.error(chalk.red(`依赖安装失败，退出码：${code}`));
            } else {
              console.log(chalk.green('✓ 依赖安装成功'));
            }
            resolve();
          });
        });
      }

      // 检查用户项目是否有 rollup.config.js
      const userRollupConfig = path.resolve(process.cwd(), 'rollup.config.js');
      if (!fs.existsSync(userRollupConfig)) {
        console.log(chalk.blue('正在创建 rollup.config.js...'));
        
        // 复制默认配置文件
        const defaultConfig = `
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'app',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { browsers: '> 1%, not dead' } }]
      ]
    }),
    serve({
      contentBase: ['dist', 'public'],
      host: '${options.host}',
      port: ${options.port},
      open: true
    }),
    livereload('dist')
  ]
};
        `.trim();

        fs.writeFileSync(userRollupConfig, defaultConfig);
        console.log(chalk.green('✓ 已创建 rollup.config.js'));
      }

      // 运行 rollup 命令
      const rollupBin = path.resolve(process.cwd(), 'node_modules/.bin/rollup');
      const rollupArgs = ['-c', userRollupConfig, '-w'];
      
      console.log(chalk.blue(`执行命令: ${rollupBin} ${rollupArgs.join(' ')}`));
      
      const rollupProcess = spawn(rollupBin, rollupArgs, {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          NODE_ENV: 'development',
          PORT: options.port,
          HOST: options.host
        }
      });

      rollupProcess.on('error', (error) => {
        console.error(chalk.red(`执行失败：${error.message}`));
      });

      rollupProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(chalk.red(`命令执行失败，退出码：${code}`));
        }
      });
      
      console.log(chalk.green(`开发服务器已启动：http://${options.host}:${options.port}`));
      
    } catch (error) {
      console.error(chalk.red(`启动开发服务器失败：${error.message}`));
      process.exit(1);
    }
  });

// 添加构建命令
program
  .command('build')
  .alias('b')
  .description('构建生产环境代码')
  .option('-o, --output <dir>', '指定输出目录', 'dist')
  .option('-c, --config <path>', '自定义配置文件路径')
  .action(async (options) => {
    console.log(chalk.green('******欢迎使用seek-app脚手架******'));
    try {
      // 设置环境变量
      process.env.NODE_ENV = 'production';
      process.env.OUTPUT_DIR = options.output;

      // 确定配置文件路径
      let configPath;
      
      if (options.config) {
        // 用户指定了配置文件
        configPath = path.resolve(process.cwd(), options.config);
      } else {
        // 查找用户项目中是否存在 rollup.config.js
        const userConfigPath = path.resolve(process.cwd(), 'rollup.config.js');
        if (fs.existsSync(userConfigPath)) {
          configPath = userConfigPath;
        } else {
          // 使用 seek-app 内置的配置
          configPath = path.resolve(__dirname, '../rollupConfig/index.js');
          
          // 复制配置文件到用户项目中
          const seekAppRollupConfigDir = path.resolve(__dirname, 'rollupConfig');
          const userRollupConfigDir = path.resolve(process.cwd(), 'rollupConfig');
          
          if (fs.existsSync(seekAppRollupConfigDir)) {
            console.log(chalk.blue('正在复制配置文件到您的项目...'));
            
            // 如果用户项目中不存在 rollupConfig 目录，则创建
            if (!fs.existsSync(userRollupConfigDir)) {
              fs.mkdirpSync(userRollupConfigDir);
            }
            
            // 复制配置文件
            fs.copySync(seekAppRollupConfigDir, userRollupConfigDir, {
              overwrite: false, // 不覆盖用户已有的文件
            });
            
            console.log(chalk.green('✓ 配置文件已复制到您的项目中'));
            
            // 创建主配置文件
            const rollupConfigContent = `
const { rollupConfig } = require('./rollupConfig');
module.exports = rollupConfig;
            `.trim();
            
            fs.writeFileSync(
              path.resolve(process.cwd(), 'rollup.config.js'), 
              rollupConfigContent
            );
            
            console.log(chalk.green('✓ 已创建 rollup.config.js'));
            configPath = path.resolve(process.cwd(), 'rollup.config.js');
          }
        }
      }
      
      // 确保配置文件存在
      if (!fs.existsSync(configPath)) {
        throw new Error(`找不到配置文件: ${configPath}`);
      }
      
      console.log(chalk.blue(`使用配置文件: ${configPath}`));
      
      // 获取 rollup 命令路径
      const rollupBin = path.resolve(process.cwd(), 'node_modules/.bin/rollup');
      
      // 检查用户项目是否安装了 rollup
      if (!fs.existsSync(rollupBin)) {
        console.log(chalk.yellow('正在安装 rollup 和相关依赖...'));
        
        // 安装必要的依赖
        const dependencies = [
          'rollup',
          '@rollup/plugin-babel',
          '@rollup/plugin-node-resolve',
          '@rollup/plugin-commonjs',
          '@rollup/plugin-json',
          'rollup-plugin-terser'
        ];
        
        const npmProcess = spawn('npm', ['install', '--save-dev', ...dependencies], {
          stdio: 'inherit',
          shell: true,
          cwd: process.cwd()
        });
        
        await new Promise((resolve) => {
          npmProcess.on('close', (code) => {
            if (code !== 0) {
              console.error(chalk.red(`依赖安装失败，退出码：${code}`));
            } else {
              console.log(chalk.green('✓ 依赖安装成功'));
            }
            resolve();
          });
        });
      }
      
      // 运行 rollup 命令
      const rollupArgs = ['-c', configPath];
      console.log(chalk.blue(`执行命令: ${rollupBin} ${rollupArgs.join(' ')}`));
      
      const rollupProcess = spawn(rollupBin, rollupArgs, {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          NODE_ENV: 'production',
          OUTPUT_DIR: options.output
        }
      });

      rollupProcess.on('error', (error) => {
        console.error(chalk.red(`执行失败：${error.message}`));
      });

      rollupProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(chalk.red(`命令执行失败，退出码：${code}`));
        } else {
          console.log(chalk.green(`构建完成，输出目录：${options.output}`));
        }
      });
      
    } catch (error) {
      console.error(chalk.red(`构建失败：${error.message}`));
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse(process.argv);
