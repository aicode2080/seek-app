import path from 'path';
import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';


// 获取 src 目录的绝对路径
const srcDir = path.resolve(__dirname, 'src');

// 删除 lib 目录
const libDir = path.resolve(__dirname, 'lib');
if (fs.existsSync(libDir)) {
  fs.rmSync(libDir, { recursive: true, force: true });
  console.log('已删除 lib 目录');
}

// 是否是生产环境
const isProd = process.env.NODE_ENV === 'production';

// 递归查找所有 JS 文件并保持目录结构
function findJsFiles(dir, baseDir = srcDir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        findJsFiles(filePath, baseDir, fileList);
      } else if (
        file.endsWith('.js') && 
        !file.match(/\.test\.js$/) && 
        !file.match(/\.config\.js$/)
      ) {
        // 计算相对路径
        const relativePath = path.relative(baseDir, filePath);
        fileList.push({
          input: filePath,
          output: path.join('lib', relativePath)
        });
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

// 如果没有找到任何文件，添加默认的 seek-app.js
if (entries.length === 0 && fs.existsSync(path.join(srcDir, 'seek-app.js'))) {
  entries.push({
    input: path.join(srcDir, 'seek-app.js'),
    output: path.join('lib', 'seek-app.js')
  });
}

// 确保至少有一个入口文件
if (entries.length === 0) {
  console.error('错误: 未找到任何入口文件');
  process.exit(1);
}

// 创建基础插件配置
function createPlugins(fileName) {
  const isRollupConfig = fileName.includes('rollupConfig');
  return [
    {
      name: 'add-shebang',
      renderChunk(code, chunk) {
        if (chunk.fileName === 'seek-app.js') {
          return '#!/usr/bin/env node\n' + code;
        }
        return code;
      },
    },
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      preferBuiltins: false,
      mainFields: ['module', 'main'],
      browser: false,
      resolveOnly: [
        /@rollup\/plugin-.*/,
        /rollup-plugin-.*/,
        /@babel\/.*/,
        /postcss.*/,
        /nanoid/,
        /picocolors/,
        /source-map-js/,
        /object-assign/
      ],
    }),
    commonjs({
      include: /node_modules/,
      requireReturnsDefault: 'auto',
      transformMixedEsModules: true,
      ignoreDynamicRequires: false,
      esmExternals: false,
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
    // 只对非 rollupConfig 文件使用 terser
    !isRollupConfig && isProd &&
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
}

// 配置外部依赖
const external = [
  'fs',
  'path',
  'child_process',
  'os',
  'util',
  'events',
  'stream',
  'process',
  'url',
  /postcss-px-to-viewport/,
  /postcss/,
  /source-map/,
  /nanoid/,
  /picocolors/,
  /object-assign/,
  /@babel\/.*/,
  /rollup-plugin-visualizer/
];

// 为每个入口文件创建配置
const configs = entries.map(({ input, output }) => {
  const isRollupConfig = input.includes('rollupConfig');
  return {
    input,
    output: {
      file: output,
      format: isRollupConfig ? 'cjs' : 'es',
      exports: 'auto',
      sourcemap: !isProd,
    },
    external: [
      ...external,
      // 为 rollupConfig 目录下的文件添加额外的外部依赖
      ...(isRollupConfig ? [
        'rollup',
        '@rollup/plugin-babel',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-json',
        '@rollup/plugin-node-resolve',
        'rollup-plugin-terser',
        'rollup-plugin-copy'
      ] : [])
    ],
    plugins: createPlugins(path.basename(output)),
  };
});

// 添加复制任务
const copyConfig = {
  input: 'src/empty.js',
  output: {
    file: 'lib/empty.js',
    format: 'es',
    exports: 'auto',
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/eslint.js', dest: 'lib' },
        { src: 'src/.prettierignore', dest: 'lib' },
        { src: 'src/.eslintrc.json', dest: 'lib' },
      ],
    }),
  ],
};

// 确保配置数组不为空
const finalConfig = [...configs];
if (fs.existsSync('src/empty.js')) {
  finalConfig.push(copyConfig);
}

// 导出配置
export default finalConfig;
