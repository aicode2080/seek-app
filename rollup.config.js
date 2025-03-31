const path = require('path');
const fs = require('fs');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const copy = require('rollup-plugin-copy');

// 获取 src 目录的绝对路径
const srcDir = path.resolve(__dirname, 'src');

// 删除 lib 目录
const libDir = path.resolve(__dirname, 'lib');
if (fs.existsSync(libDir)) {
  fs.rmSync(libDir, { recursive: true, force: true });
  console.log('已删除 lib 目录');
}

// 配置外部依赖（不打包进输出文件）
const external = [
  'fs',
  'path',
  'child_process',
  'os',
  'util',
  'events',
  'stream',
  'commander',
  'chalk',
  'fs-extra',
  'inquirer',
  'axios',
  'prettier',
  'rollup',
  'semver',
  'tmp',
  'tar-pack',
  'hyperquest',
  'cross-spawn',
  'prompts',
  'eslint',
  'json-schema-to-typescript',
  'process',
  'url',
  'rollup-plugin-serve',
  'rollup-plugin-livereload',
  'rollup-plugin-visualizer',
  'postcss-px-to-viewport',
  'picocolors',
  'source-map-js',
  'nanoid',
  /node_modules/,
];

// 是否是生产环境
const isProd = process.env.NODE_ENV === 'production';

// 递归查找所有 JS 文件并保持目录结构
function findJsFiles(dir, baseDir = srcDir, fileList = {}) {
  try {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        findJsFiles(filePath, baseDir, fileList);
      } else if (file.endsWith('.js') && !file.match(/\.test\.js$/)) {
        // 计算相对路径
        const relativePath = path.relative(baseDir, filePath);

        // 对于所有文件，移除 .js 扩展名
        const entryName = relativePath.replace(/\.js$/, '');
        fileList[entryName] = filePath;
      }
    });

    return fileList;
  } catch (error) {
    console.error(`Error finding JS files: ${error.message}`);
    return fileList;
  }
}

// 查找所有 JS 文件
const entries = findJsFiles(srcDir);
console.log(entries);

// 创建插件配置
const plugins = [
  {
    name: 'add-shebang',
    renderChunk(code, chunk) {
      if (chunk.fileName === 'seek-app.js') {
        return '#!/usr/bin/env node\n' + code;
      }
      return code;
    },
  },
  // {
  //   name: 'fix-directory-structure',
  //   generateBundle(options, bundle) {
  //     Object.keys(bundle).forEach((fileName) => {
  //       const chunk = bundle[fileName];
  //       const parts = fileName.split('/');

  //       // 如果是 rollupConfig 下的子目录
  //       if (parts[0] === 'rollupConfig') {
  //         if (parts.length > 2) {
  //           if (fileName === 'rollupConfig/rollupConfig/index.js') {
  //             // 将 rollupConfig/index.js 移动到根目录
  //             chunk.fileName = 'index.js';
  //             bundle['index.js'] = chunk;
  //             delete bundle[fileName];
  //           } else {
  //             // 只保留 rollupConfig 和子目录名
  //             const newFileName = `rollupConfig/${parts[1]}/index.js`;
  //             chunk.fileName = newFileName;
  //             bundle[newFileName] = chunk;
  //             delete bundle[fileName];
  //           }
  //         }
  //       }
  //     });
  //   },
  // },
  nodeResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    preferBuiltins: true,
  }),
  commonjs({
    include: /node_modules/,
    requireReturnsDefault: 'auto',
    transformMixedEsModules: true,
    ignoreDynamicRequires: true,
  }),
  json(),
  babel({
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', { targets: { node: '12' } }],
      '@babel/preset-typescript',
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    exclude: 'node_modules/**',
  }),
  copy({
    targets: [
      { src: 'src/eslint.js', dest: 'lib' },
      { src: 'src/.prettierignore', dest: 'lib' },
      { src: 'src/.eslintrc.json', dest: 'lib' },
    ],
  }),
  isProd &&
    terser({
      format: {
        comments: false,
      },
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    }),
].filter(Boolean);

// 创建输出配置
const outputConfig = {
  dir: 'lib',
  format: 'cjs',
  exports: 'auto',
  sourcemap: !isProd,
  // preserveModules: true, // 保持模块结构
  // preserveModulesRoot: 'src', // 从 src 目录开始保持结构
  entryFileNames: '[name].js',
};

// 导出配置
module.exports = {
  input: entries,
  output: outputConfig,
  external,
  plugins,
};
