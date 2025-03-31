const path = require('path');
const fs = require('fs');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');

import copy from 'rollup-plugin-copy'; // 复制插件保留的

// 获取 src 目录的绝对路径
const srcDir = path.resolve(__dirname, 'src');

// 配置外部依赖（不打包进输出文件）
const external = [
  'fs', 'path', 'child_process', 'os', 'util', 'events', 'stream',
  'commander', 'chalk', 'fs-extra', 'inquirer', 'axios', 'prettier',
  'rollup', 'semver', 'tmp', 'tar-pack', 'hyperquest', 'cross-spawn',
  'prompts', 'eslint', 'json-schema-to-typescript', 'process', 'url',
  'rollup-plugin-serve', 'rollup-plugin-livereload', 'rollup-plugin-visualizer'
];

// 是否是生产环境
const isProd = process.env.NODE_ENV === 'production';

// 命令行工具入口文件
const cliEntries = {
  'seek-app': path.resolve(srcDir, 'seek-app.js'),
  'git-auto': path.resolve(srcDir, 'git-auto.js'),
  'interface-auto': path.resolve(srcDir, 'interface-auto.js'),
  'index': path.resolve(srcDir, 'index.js')
};

// 其他文件
const otherFiles = fs.readdirSync(srcDir)
  .filter(file => {
    // 过滤出 JS 文件，排除测试文件和已经在 cliEntries 中的文件
    return file.match(/\.js$/) && 
           !file.match(/\.test\.js$/) && 
           !Object.keys(cliEntries).includes(file.replace(/\.js$/, ''));
  })
  .reduce((acc, file) => {
    const name = file.replace(/\.js$/, '');
    acc[name] = path.resolve(srcDir, file);
    return acc;
  }, {});

// 递归查找子目录中的 JS 文件
function findJsFiles(dir, baseDir = srcDir, fileList = {}) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        findJsFiles(filePath, baseDir, fileList);
      } else if (file.match(/\.(js|jsx)$/) && !file.match(/\.test\.js$/)) {
        // 计算相对路径
        const relativePath = path.relative(baseDir, filePath);
        const entryName = relativePath.replace(/\.(js|jsx)$/, '');
        fileList[entryName] = filePath;
      }
    });
    
    return fileList;
  } catch (error) {
    console.error(`Error finding JS files: ${error.message}`);
    return fileList;
  }
}

// 查找子目录中的文件
const subdirFiles = {};
fs.readdirSync(srcDir).forEach(item => {
  const itemPath = path.join(srcDir, item);
  if (fs.statSync(itemPath).isDirectory()) {
    Object.assign(subdirFiles, findJsFiles(itemPath, srcDir));
  }
});

// 创建两个配置
// 1. CLI工具配置 - 带有shebang
const cliConfig = {
  input: './src/index.tsx',
  // input: cliEntries,
  output: {
    dir: 'lib',
    format: 'cjs',
    exports: 'auto',
    sourcemap: !isProd,
    banner: '#!/usr/bin/env node', // 为所有CLI工具添加shebang
  },
  external,
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx', '.json']
    }),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { node: '12' } }]
      ],
      extensions: ['.js', '.jsx','.tsx']
    }),
    isProd && terser({
      format: {
        comments: /^!/, // 保留以 ! 开头的注释（shebang）
        preamble: null   // 不添加额外的前缀
      },
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    })
  ].filter(Boolean)
};

// 2. 其他文件配置 - 不带shebang
const otherConfig = {
  input: { ...otherFiles, ...subdirFiles },
  output: {
    dir: 'lib',
    format: 'cjs',
    exports: 'auto',
    sourcemap: !isProd,
  },
  external,
  plugins: [
    copy({
      targets:[
        { src: 'src/eslint.js', dest: 'lib' },
        { src: 'src/.prettierignore', dest: 'lib' },
        { src: 'src/.eslintrc.json', dest: 'lib' },
      ]
    }),
    nodeResolve({
      extensions: ['.js', '.jsx', '.json']
    }),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { node: '12' } }]
      ],
      extensions: ['.js', '.jsx']
    }),
    isProd && terser({
      format: {
        comments: false
      },
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    })
  ].filter(Boolean)
};

// 导出配置数组
module.exports = [cliConfig, otherConfig]; 