import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default function htmlPlugin(options = {}) {
  const {
    template = path.resolve(__dirname, '../template.html'),
    filename = 'index.html',
    title = 'Seek App'
  } = options;

  return {
    name: 'html',
    generateBundle(outputOptions, bundle) {
      // 读取模板文件
      const templateContent = fs.readFileSync(template, 'utf-8');
      const templateFn = Handlebars.compile(templateContent);

      // 获取生成的 JS 和 CSS 文件
      const jsFile = Object.keys(bundle).find(key => key.endsWith('.js'));
      const cssFile = Object.keys(bundle).find(key => key.endsWith('.css'));

      // 准备模板数据
      const templateData = {
        title,
        js: jsFile ? `/${jsFile}` : '/bundle.js',
        css: cssFile ? `/${cssFile}` : ''
      };

      // 生成 HTML
      const html = templateFn(templateData);

      // 将 HTML 添加到 bundle
      this.emitFile({
        type: 'asset',
        fileName: filename,
        source: html
      });
    }
  };
} 