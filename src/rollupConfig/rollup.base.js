"use strict";
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import fs from 'fs';

// 查找入口文件
export function findEntryFile() {
  const possibleEntries = [
    'src/index.tsx',
    'src/index.ts',
    'src/index.jsx',
    'src/index.js'
  ];

  for (const entry of possibleEntries) {
    if (fs.existsSync(path.resolve(process.cwd(), entry))) {
      return entry;
    }
  }

  throw new Error('未找到入口文件，请确保项目中存在以下文件之一：src/index.tsx, src/index.ts, src/index.jsx, src/index.js');
}

// 获取输出目录
export const outputDir = process.env.OUTPUT_DIR || 'dist';

// 基础插件配置
export const basePlugins = [
  nodeResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    preferBuiltins: true,
    mainFields: ['module', 'main']
  }),
  commonjs({
    include: /node_modules/,
    transformMixedEsModules: true,
    requireReturnsDefault: 'auto'
  }),
  typescript({
    tsconfig: './tsconfig.json',
    sourceMap: true,
    inlineSources: true
  }),
  babel({
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', { 
        targets: { node: 'current' },
        modules: 'auto'
      }],
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    exclude: 'node_modules/**',
    skipPreflightCheck: true
  }),
  json(),
  image()
];

// 基础输出配置
export const baseOutput = {
  dir: outputDir,
  format: 'es',
  sourcemap: true,
  entryFileNames: 'bundle.js',
  chunkFileNames: '[name].js',
  assetFileNames: '[name][extname]'
};

// 配置构建选项
export const buildConfig = {
  // 入口文件，默认为 src/index.js
  entry: findEntryFile(),
  
  // 输出目录
  output: {
    dir: outputDir,
    format: 'umd',
    name: 'app',
    sourcemap: true
  },
  
  // 文件扩展名
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  
  // 是否清理输出目录
  clean: true,
  
  // 开发服务器配置
  server: {
    port: 3000,
    host: 'localhost',
    open: true
  }
};

// 解析路径
export const resolvePath = (...args) => path.resolve(process.cwd(), ...args);

// 检查文件类型
export const isTypeScript = (file) => /\.(ts|tsx)$/.test(file);
export const isJavaScript = (file) => /\.(js|jsx)$/.test(file);
export const isCSS = (file) => /\.css$/.test(file);
export const isLess = (file) => /\.less$/.test(file);
export const isSass = (file) => /\.(sass|scss)$/.test(file);
export const isJSON = (file) => /\.json$/.test(file);
export const isImage = (file) => /\.(png|jpe?g|gif|svg|webp)$/.test(file);
export const isFont = (file) => /\.(woff2?|eot|ttf|otf)$/.test(file);
export const isMedia = (file) => /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(file);
export const isHTML = (file) => /\.html$/.test(file);

// 获取文件扩展名
export const getFileExt = (file) => {
  const match = file.match(/\.([^.]+)$/);
  return match ? match[1] : '';
};

// 基础 Rollup 配置
export const baseConfig = {
  input: resolvePath(buildConfig.entry),
  output: {
    dir: resolvePath(buildConfig.output.dir),
    format: buildConfig.output.format,
    name: buildConfig.output.name,
    sourcemap: buildConfig.output.sourcemap,
  },
  plugins: basePlugins,
  // 外部依赖
  external: [],
  // 监听选项
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  // 启用 tree-shaking
  treeshake: true
};

// module.exports = {
//   baseConfig,
//   buildConfig,
//   resolvePath,
//   isTypeScript,
//   isJavaScript,
//   isCSS,
//   isLess,
//   isSass,
//   isJSON,
//   isImage,
//   isFont,
//   isMedia,
//   isHTML,
//   getFileExt
// }; 