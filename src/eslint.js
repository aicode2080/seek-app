const { ESLint } = require('eslint');

// 检查 Node.js 版本是否支持可选链操作符
function supportsOptionalChaining() {
  const version = process.version;
  const major = parseInt(version.split('.')[0].replace('v', ''));
  return major >= 14;
}

async function lintFiles(options = {}) {
  const {
    targetDir = process.cwd(),
    extensions = ['.js', '.jsx', '.ts', '.tsx'],
    fix = false,
    ignorePath = '.eslintignore'
  } = options;

  try {
    console.log(`执行目录：${targetDir}`);
    // 创建 ESLint 实例
    const eslint = new ESLint({
      cwd: targetDir,
      // extensions,
      fix,
      // ignorePath,
      // useEslintrc: true,
      // isPathIgnored: (filePath) => {
      //   const ignoreLib = `${targetDir}/${ignorePath}`;
      //   const ignore = require('ignore');
      //   const ig = ignore().add(fs.readFileSync(ignoreLib, 'utf8'));
      //   return ig.ignores(filePath);
      // },
      // overrideConfig: {
      //   parserOptions: {
      //     ecmaVersion: supportsOptionalChaining() ? 2020 : 2018,
      //     sourceType: 'module'
      //   }
      // }
    });

    // 获取要检查的文件
    const files = await eslint.lintFiles(['.']);

    // 获取检查结果
    const results = await eslint.lintFiles(files.map(file => file.filePath));

    // 输出结果
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);
    console.log(resultText);
    // 如果有错误，返回错误数量
    const errorCount = results.reduce((acc, result) => {
      if (supportsOptionalChaining()) {
        return acc + (result?.errorCount ?? 0);
      } else {
        return acc + (result && result.errorCount ? result.errorCount : 0);
      }
    }, 0);
    return errorCount;

  } catch (error) {
    console.error('ESLint 检查失败：', error.message);
    return 1;
  }
}

module.exports = lintFiles;
