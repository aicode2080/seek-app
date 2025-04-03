"use strict";
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
// 添加 less 和 postcss 相关插件
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import htmlPlugin from './plugins/html-plugin';
import pxToViewport from 'postcss-px-to-viewport';
// export { devConfig } from './rollup.dev.js';
// export { prodConfig } from './rollup.build.js';
const DEVELOP_GLOBAL = (env_global) => `var process = {
  env: {
    NODE_ENV: 'development',
  }
};`

const PRODUCT_GLOBAL = (env_global) => `var process = {
  env: {
    NODE_ENV: 'production',
  }
};`
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
const prooutputDir = process.env.OUTPUT_DIR || 'build';

// 创建 CSS 处理插件配置
const cssPluginConfig = {
  plugins: [
    postcss({
      plugins: [autoprefixer()],
      extract: true, // 将 CSS 提取到单独的文件
      modules: true, // 启用 CSS 模块
      use: ['less'], // 使用 less 处理器
      sourceMap: true,
      minimize: process.env.NODE_ENV === 'production'
    })
  ]
};

// 开发环境配置
export const developmentConfig = {
  input: findEntryFile(),
  output: {
    dir: outputDir,
    format: 'es',
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    assetFileNames: '[name][extname]',
    sourcemap: true,
    inlineDynamicImports: true,
    banner: DEVELOP_GLOBAL('development')
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  },
  plugins: [
    htmlPlugin({
      filename: 'index.html',
      title: 'Seek App - Development',
      links: [
        { rel: 'stylesheet', href: 'styles.css' }
      ]
    }),
    // 添加 CSS 处理插件
    postcss({
      plugins: [
        autoprefixer(),
        pxToViewport({
          viewportWidth: 375,
          viewportHeight: 667,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false
        })
      ],
      extract: true,
      modules: true,
      use: ['less'],
      sourceMap: true,
      minimize: true,
      extract: 'styles.css', // 给 CSS 文件一个固定名称
    }),
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.css'],
      preferBuiltins: true
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
      // 这个选项很重要，它允许 commonjs 转换 node_modules 中的模块
      esmExternals: true
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
        ['@babel/preset-react', {
          runtime: 'automatic',
          development: true,
        }],
        '@babel/preset-typescript'
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    json(),
    image(),
    serve({
      contentBase: [outputDir],
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
export const productionConfig = {
  input: findEntryFile(),
  output: {
    dir: prooutputDir,
    format: 'es',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]',
    sourcemap: true,
    banner: PRODUCT_GLOBAL('production')
  },
  external: ['react', 'react-dom'],
  plugins: [
     // 添加 HTML 插件
     htmlPlugin({
      filename: 'index.html',
      title: 'Seek App - Production',
      // 添加生产环境特定配置
      links: [
        { rel: 'stylesheet', href: 'index.css' } // 确保引入 CSS
      ]
    }),
    postcss({
      plugins: [
        autoprefixer(),
        pxToViewport({
          viewportWidth: 375,
          viewportHeight: 667,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false
        })
      ],
      extract: true,
      modules: true,
      use: ['less'],
      sourceMap: true,
      minimize: true
    }),
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.css'],
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
// export default {
//   prodConfig,
//   devConfig
// }