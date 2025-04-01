import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import axios from 'axios';

class CodeReviewer {
  constructor(options = {}) {
    this.options = {
      models: [
        {
          name: 'bigscience/bloom-560m',
          apiKey: process.env.HUGGING_FACE_API_KEY,
          endpoint: 'https://api-inference.huggingface.co/models',
          type: 'huggingface'
        },
        {
          name: 'qwen-7b-chat',
          apiKey: process.env.DASHSCOPE_API_KEY,
          endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
          type: 'dashscope'
        },
        {
          name: 'gpt-3.5-turbo',
          apiKey: process.env.OPENAI_API_KEY,
          endpoint: 'https://api.openai.com/v1/chat/completions',
          type: 'openai'
        }
      ].filter(model => model.apiKey), // 只保留有 API Key 的模型
      temperature: 0.7,
      maxTokens: 2000,
      ...options
    };
  }

  async reviewFile(filePath, model) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      const prompt = `请对以下代码进行审核，重点关注：
1. 代码质量和可读性
2. 潜在的性能问题
3. 安全隐患
4. 最佳实践
5. 可能的改进建议

文件路径：${relativePath}
代码内容：
\`\`\`
${content}
\`\`\`

请用中文回复，并按照以下格式输出：
# 代码审核报告

## 文件信息
- 文件路径：${relativePath}
- 审核时间：${new Date().toLocaleString()}
- 使用模型：${model.name}

## 审核结果
[在这里详细说明审核结果]

## 改进建议
[在这里列出具体的改进建议]

## 总结
[在这里总结主要发现和建议]`;

      let response;
      switch (model.type) {
        case 'huggingface':
          response = await axios.post(
            `${model.endpoint}/${model.name}`,
            {
              inputs: prompt,
              parameters: {
                max_length: this.options.maxTokens,
                temperature: this.options.temperature,
                return_full_text: false
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${model.apiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          return response.data[0].generated_text;
        
        case 'dashscope':
          response = await axios.post(
            model.endpoint,
            {
              model: model.name,
              input: {
                messages: [{ role: 'user', content: prompt }]
              },
              parameters: {
                temperature: this.options.temperature,
                max_tokens: this.options.maxTokens
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${model.apiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          return response.data.output.text;
        
        case 'openai':
          response = await axios.post(
            model.endpoint,
            {
              model: model.name,
              messages: [{ role: 'user', content: prompt }],
              temperature: this.options.temperature,
              max_tokens: this.options.maxTokens
            },
            {
              headers: {
                'Authorization': `Bearer ${model.apiKey}`,
                'Content-Type': 'application/json'
              }
            }
          );
          return response.data.choices[0].message.content;
        
        default:
          throw new Error(`不支持的模型类型：${model.type}`);
      }
    } catch (error) {
      console.error(chalk.red(`使用模型 ${model.name} 审核文件 ${filePath} 时出错：${error.message}`));
      return null;
    }
  }

  async reviewDirectory(dirPath) {
    const files = [];
    const results = {};

    // 获取所有需要审核的文件
    const getAllFiles = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          getAllFiles(fullPath);
        } else if (this.shouldReviewFile(item)) {
          files.push(fullPath);
        }
      });
    };

    getAllFiles(dirPath);

    // 为每个模型创建结果数组
    this.options.models.forEach(model => {
      results[model.name] = [];
    });

    // 审核每个文件
    for (const file of files) {
      console.log(chalk.blue(`正在审核文件：${file}`));
      
      // 使用所有可用模型审核文件
      for (const model of this.options.models) {
        console.log(chalk.blue(`使用模型 ${model.name} 进行审核...`));
        const result = await this.reviewFile(file, model);
        if (result) {
          results[model.name].push(result);
        }
      }
    }

    return results;
  }

  shouldReviewFile(filename) {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.py', '.java', '.cpp', '.c', '.cs'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  generateHtmlReport(results) {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>多模型代码审核对比报告</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        .model-section {
            margin-bottom: 40px;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 8px;
        }
        .model-header {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', Courier, monospace;
            background-color: #f8f9fa;
            padding: 2px 5px;
            border-radius: 3px;
        }
        .file-info {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
        }
        .model-comparison {
            margin-top: 40px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .model-comparison h2 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .comparison-table th,
        .comparison-table td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .comparison-table th {
            background-color: #f1f1f1;
        }
    </style>
</head>
<body>
    <h1>多模型代码审核对比报告</h1>
    <div class="timestamp">生成时间：${new Date().toLocaleString()}</div>
    
    ${Object.entries(results).map(([modelName, modelResults]) => `
        <div class="model-section">
            <div class="model-header">
                <h2>模型：${modelName}</h2>
            </div>
            ${modelResults.map(result => `
                <div class="review-result">
                    ${result}
                </div>
            `).join('<hr>')}
        </div>
    `).join('')}

    <div class="model-comparison">
        <h2>模型对比分析</h2>
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>模型名称</th>
                    <th>审核文件数</th>
                    <th>平均响应时间</th>
                    <th>特点分析</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(results).map(([modelName, modelResults]) => `
                    <tr>
                        <td>${modelName}</td>
                        <td>${modelResults.length}</td>
                        <td>${(modelResults.reduce((acc, curr) => acc + curr.responseTime, 0) / modelResults.length).toFixed(2)}ms</td>
                        <td>${this.getModelAnalysis(modelName, modelResults)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

    const reportPath = path.join(process.cwd(), 'code-review-comparison.html');
    fs.writeFileSync(reportPath, html);
    return reportPath;
  }

  getModelAnalysis(modelName, results) {
    // 这里可以根据实际结果分析每个模型的特点
    const analysis = {
      'bigscience/bloom-560m': '开源模型，响应较快，适合基础代码审查',
      'qwen-7b-chat': '中文理解能力强，适合中文项目代码审查',
      'gpt-3.5-turbo': '通用性强，代码审查质量较高'
    };
    return analysis[modelName] || '暂无分析';
  }
}

export default CodeReviewer; 