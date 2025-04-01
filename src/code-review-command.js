import chalk from 'chalk';
import path from 'path';
import { spawn } from 'child_process';
import CodeReviewer from './code-review.js';

async function handleCodeReview(options = {}) {
  console.log(chalk.green('******开始多模型代码审核******'));

  try {
    // 检查可用的 API Keys
    const availableModels = [];
    if (process.env.HUGGING_FACE_API_KEY) {
      availableModels.push('Hugging Face (BLOOM)');
    }
    if (process.env.DASHSCOPE_API_KEY) {
      availableModels.push('通义千问');
    }
    if (process.env.OPENAI_API_KEY) {
      availableModels.push('OpenAI GPT');
    }

    if (availableModels.length === 0) {
      console.log(chalk.yellow('提示：未设置任何 API Key'));
      console.log(chalk.blue('\n请设置以下环境变量之一：'));
      console.log(chalk.blue('\n1. Hugging Face API Key:'));
      console.log(chalk.white('   # Linux/Mac:'));
      console.log(chalk.gray('   export HUGGING_FACE_API_KEY=你的API密钥'));
      console.log(chalk.white('   # Windows CMD:'));
      console.log(chalk.gray('   set HUGGING_FACE_API_KEY=你的API密钥'));
      console.log(chalk.white('   # Windows PowerShell:'));
      console.log(chalk.gray('   $env:HUGGING_FACE_API_KEY="你的API密钥"'));
      
      console.log(chalk.blue('\n2. 通义千问 API Key:'));
      console.log(chalk.white('   # Linux/Mac:'));
      console.log(chalk.gray('   export DASHSCOPE_API_KEY=你的API密钥'));
      console.log(chalk.white('   # Windows CMD:'));
      console.log(chalk.gray('   set DASHSCOPE_API_KEY=你的API密钥'));
      console.log(chalk.white('   # Windows PowerShell:'));
      console.log(chalk.gray('   $env:DASHSCOPE_API_KEY="你的API密钥"'));
      
      console.log(chalk.blue('\n3. OpenAI API Key:'));
      console.log(chalk.white('   # Linux/Mac:'));
      console.log(chalk.gray('   export OPENAI_API_KEY=你的API密钥'));
      console.log(chalk.white('   # Windows CMD:'));
      console.log(chalk.gray('   set OPENAI_API_KEY=你的API密钥'));
      console.log(chalk.white('   # Windows PowerShell:'));
      console.log(chalk.gray('   $env:OPENAI_API_KEY="你的API密钥"'));
      
      console.log(chalk.blue('\n获取方式：'));
      console.log(chalk.blue('- Hugging Face: https://huggingface.co/settings/tokens'));
      console.log(chalk.blue('- 通义千问: https://dashscope.aliyuncs.com/'));
      console.log(chalk.blue('- OpenAI: https://platform.openai.com/api-keys'));
      
      console.log(chalk.yellow('\n注意：设置环境变量后需要重新打开终端才能生效'));
      return;
    }

    console.log(chalk.green('可用的模型：'));
    availableModels.forEach(model => {
      console.log(chalk.blue(`- ${model}`));
    });

    // 创建代码审核器实例
    const reviewer = new CodeReviewer(options);

    // 获取要审核的目录
    const targetDir = options.targetDir || process.cwd();

    console.log(chalk.blue(`\n正在扫描目录：${targetDir}`));
    console.log(chalk.blue('将使用所有可用的模型进行代码审核...'));

    // 执行代码审核
    const results = await reviewer.reviewDirectory(targetDir);

    if (Object.values(results).every(arr => arr.length === 0)) {
      console.log(chalk.yellow('没有找到需要审核的代码文件'));
      return;
    }

    // 生成 HTML 报告
    const reportPath = reviewer.generateHtmlReport(results);
    console.log(chalk.green(`✓ 多模型代码审核对比报告已生成：${reportPath}`));

    // 自动打开报告
    if (process.platform === 'darwin') {
      spawn('open', [reportPath]);
    } else if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', reportPath]);
    } else {
      spawn('xdg-open', [reportPath]);
    }

  } catch (error) {
    console.error(chalk.red(`代码审核失败：${error.message}`));
  }
}

export default handleCodeReview; 