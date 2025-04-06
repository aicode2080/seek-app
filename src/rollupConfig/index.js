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
import tailwindcss from '@tailwindcss/postcss';
import postcssImport from 'postcss-import';
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
      console.log(`入口文件${entry}`);
      return entry;
    }
  }
  
  
  throw new Error('未找到入口文件，请确保项目中存在以下文件之一：src/index.tsx, src/index.ts, src/index.jsx, src/index.js');
}

// 获取输出目录
const outputDir = process.env.OUTPUT_DIR || 'dist';
const prooutputDir = process.env.OUTPUT_DIR || 'build';

// 开发环境配置
export const developmentConfig = {
  input: findEntryFile(),
  output: {
    dir: outputDir,
    format: 'es',
    entryFileNames: 'js/[name].[hash].js',  // 入口文件放在js目录下
    chunkFileNames: 'js/[name].[hash].js',  // chunk放在chunks子目录下
    assetFileNames: 'assets/[name].[hash][extname]', // 其他资源放在assets目录下
    sourcemap: true,
    inlineDynamicImports: false, // 关闭内联导入，允许代码拆分
    manualChunks: (id) => {
      // node_modules中的依赖单独打包
      if (id.includes('node_modules')) {
        // React相关库打包到一起
        if (id.includes('react') || id.includes('react-dom')) {
          return 'vendor-react';
        }
        // 其他第三方库
        return 'vendor';
      }
      // 公共组件库可以单独打包
      if (id.includes('/components/')) {
        return 'components';
      }
      // 默认不指定，将自动处理
    },
    banner: DEVELOP_GLOBAL('development')
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  },
  plugins: [
    // 添加 CSS 处理插件
    postcss({
      plugins: [
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
        pxToViewport({
          viewportWidth: 375,
          viewportHeight: 667,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false
        }),
        // import('@tailwindcss/postcss')
      ],
      extract: (id) => {
        const hash = Date.now().toString(16).slice(0, 8);
        return `css/index.${hash}.css`; // CSS文件放在css目录下
      },
      modules: {
        generateScopedName: '[name]_[local]_[hash:base64:5]'
      },
      use: ['less'],
      sourceMap: true,
      minimize: true,
    }),
    // 这里要放到后面。不然css还没处理完。获取不到css
    htmlPlugin({
      filename: 'index.html',
      title: 'Seek App - Development',
      links: [
        { rel: 'stylesheet', href: 'css/index.[hash].css' } // 更新CSS路径
      ]
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
      inlineSources: true,
      noEmitOnError: true, // 添加此选项
      incremental: false,   // 禁用增量编译
      compilerOptions: {
        types: ["node"]  // Explicitly include node types
      }
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
    entryFileNames: 'js/[name].[hash].js',  // 入口文件放在js目录下
    chunkFileNames: 'js/[name].[hash].js',  // chunk放在chunks子目录下
    assetFileNames: 'assets/[name].[hash][extname]', // 其他资源放在assets目录下
    sourcemap: false,
    inlineDynamicImports: false, // 关闭内联导入，允许代码拆分
    manualChunks: (id) => {
      // node_modules中的依赖单独打包
      if (id.includes('node_modules')) {
        // React相关库打包到一起
        if (id.includes('react') || id.includes('react-dom')) {
          return 'vendor-react';
        }
        // 其他第三方库
        return 'vendor';
      }
      // 公共组件库可以单独打包
      if (id.includes('/components/')) {
        return 'components';
      }
      // 默认不指定，将自动处理
    },
    banner: PRODUCT_GLOBAL('production')
  },
  external: [], // 移除external配置，否则会阻止代码拆分
  plugins: [
    postcss({
      plugins: [
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
        pxToViewport({
          viewportWidth: 375,
          viewportHeight: 667,
          unitPrecision: 5,
          viewportUnit: 'vw',
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false
        }),
        // import('@tailwindcss/postcss')
      ],
      extract: (id) => {
        const hash = Date.now().toString(16).slice(0, 8);
        return `css/index.${hash}.css`; // CSS文件放在css目录下
      },
      modules: {
        generateScopedName: '[name]_[local]_[hash:base64:5]'
      },
      use: ['less'],
      sourceMap: true,
      minimize: true
    }),
     // 添加 HTML 插件
     htmlPlugin({
      filename: 'index.html',
      title: 'Seek App - Production',
      // 添加生产环境特定配置
      links: [
        { rel: 'stylesheet', href: 'css/index.[hash].css' } // 更新CSS路径
      ]
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
      inlineSources: true,
      noEmitOnError: true, // 添加此选项
      incremental: false,   // 禁用增量编译
      compilerOptions: {
        types: ["node"]  // Explicitly include node types
      }
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