"use strict";
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import fs from 'fs';
// import { devConfig } from './rollup.dev.js';
// import { prodConfig } from './rollup.build.js';

// CLI 工具构建配置
export const cliConfig = {
  input: 'src/seek-app.js',
  output: {
    dir: 'lib',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'named',
    sourcemap: true
  },
  external: [
    'commander',
    'chalk',
    'path',
    'fs-extra',
    'child_process',
    'prettier',
    'url',
    'rollup',
    'open'
  ],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: true
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true
    }),
    json(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env']
    })
  ]
};

// 查找入口文件
function findEntryFile() {
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
const outputDir = process.env.OUTPUT_DIR || 'dist';

// 开发环境配置
export const devConfig = {
  input: findEntryFile(),
  output: {
    dir: outputDir,
    format: 'es',
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    assetFileNames: '[name][extname]',
    sourcemap: true,
    inlineDynamicImports: true
  },
  external: ['react', 'react-dom'],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: true
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    json(),
    image(),
    serve({
      contentBase: [outputDir, 'public'],
      host: 'localhost',
      port: 3000,
      open: true
    }),
    livereload({
      watch: outputDir
    })
  ]
};

// 生产环境配置
export const prodConfig = {
  input: findEntryFile(),
  output: {
    dir: outputDir,
    format: 'es',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]',
    sourcemap: true
  },
  external: ['react', 'react-dom'],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: true
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true
    }),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript'
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    json(),
    image()
  ]
};

// 默认导出
export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig;