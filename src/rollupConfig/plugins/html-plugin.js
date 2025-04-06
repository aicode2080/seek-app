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
    filename = 'index.html',
    title = 'App',
    template = path.resolve(__dirname, '../template.html'),
    links = []
  } = options;

  return {
    name: 'html-plugin',

    // 使用 generateBundle 钩子在输出时处理
    generateBundle(outputOptions, bundle) {
      try {
        // 读取模板内容
        let templateContent = '';

        if (fs.existsSync(template)) {
          templateContent = fs.readFileSync(template, 'utf-8');
        } else {
          // 如果模板不存在，创建一个基础模板
          templateContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>{{title}}</title>
              {{#each cssFiles}}
              <link rel="stylesheet" href="{{this}}">
              {{/each}}
              {{#each links}}
              <link rel="{{this.rel}}" href="{{this.href}}">
              {{/each}}
            </head>
            <body>
              <div id="root"></div>
              
              <!-- 先加载第三方库和公共组件 -->
              {{#each chunks}}
              <script type="module" src="{{this}}"></script>
              {{/each}}
              
              <!-- 再加载入口文件 -->
              {{#each jsFiles}}
              <script type="module" src="{{this}}"></script>
              {{/each}}
            </body>
            </html>
          `;
        }
        // 获取生成的 JS 和 CSS 文件
        const jsFiles = Object.keys(bundle)
          .filter(key => key.endsWith('.js') && bundle[key].type === 'chunk' && bundle[key].isEntry)
          .map(key => bundle[key].fileName);

        const cssFiles = Object.keys(bundle)
          .filter(key => key.endsWith('.css'))
          .map(key => bundle[key].fileName);
        
        // 获取所有被依赖的chunk
        const chunks = Object.keys(bundle)
          .filter(key => key.endsWith('.js') && bundle[key].type === 'chunk' && !bundle[key].isEntry)
          .map(key => bundle[key].fileName);
        
        console.log('入口JS文件:', jsFiles);
        console.log('CSS文件:', cssFiles);
        console.log('依赖的chunk文件:', chunks);

        // 处理 links 中的通配符
        const processedLinks = links.map(link => {
          // 处理包含hash的href
          if (link.href.includes('[hash]')) {
            const pattern = link.href.replace(/\[hash\]/g, '.*');
            const regex = new RegExp(pattern.replace(/\./g, '\\.'));
            
            // 查找匹配的CSS文件
            const matchedCss = cssFiles.find(file => regex.test(file));
            if (matchedCss) {
              console.log(`将占位符 ${link.href} 替换为实际文件: ${matchedCss}`);
              return { ...link, href: matchedCss };
            }
          }
          return link;
        });

        // 使用 Handlebars 编译模板
        const templateFn = Handlebars.compile(templateContent);
        
        // 应用模板
        const html = templateFn({
          title,
          jsFiles,
          cssFiles,
          chunks,
          // links: processedLinks
        });

        // 将 HTML 添加到输出束中
        this.emitFile({
          type: 'asset',
          fileName: filename,
          source: html
        });

        console.log(`HTML 文件 ${filename} 已生成，包含 ${jsFiles.length} 个 JS 文件和 ${cssFiles.length} 个 CSS 文件`);
      } catch (error) {
        console.error('HTML 插件错误:', error);
      }
    }
  };
}