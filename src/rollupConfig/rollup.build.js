"use strict";
// import babel from '@rollup/plugin-babel';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
// import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import fs from 'fs';
import { baseConfig, } from './rollup.base';
import htmlPlugin from './plugins/html-plugin'
import del from 'rollup-plugin-delete';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace'

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

// 生产环境配置
export const prodConfig = {
  input: findEntryFile(),
  output: {
    ...baseConfig.output,
    entryFileNames: 'bundle.[hash].js',
    chunkFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]'
  },
  external: ['react', 'react-dom'],
  plugins: [
    // 清理输出目录
    del({ targets: outputDir }),
    
    ...baseConfig.plugins,
    
    // 生成 HTML
    htmlPlugin({
      filename: 'index.html',
      title: 'Seek App'
    }),
    
    // 环境变量替换
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    
    // 代码压缩
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    }),
    
    // 生成分析报告（可选）
    process.env.ANALYZE && visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true
    })
  ].filter(Boolean)
};
