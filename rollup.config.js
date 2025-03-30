const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const json = require('@rollup/plugin-json');
const path = require('path');
const fs = require('fs-extra');
import copy from 'rollup-plugin-copy';


module.exports = {
  input: {
    'seek-app': 'src/seek-app.js',
    'git-auto': 'src/git-auto.js',
    'interface-auto': 'src/interface-auto.js',
    'search-code': 'src/search-code.js',
    'index': 'src/index.js',
    'create-redux': 'src/create-redux.js',
    // 'eslint': 'src/eslint.js',
    "code-review-command": 'src/code-review-command.js',
    "code-review": 'src/code-review.js',
    "createReactApp": 'src/createReactApp.js',
    "install-eslint": 'src/install-eslint.js',
    "eslint.config": 'src/eslint.config.js',
    'install-prettier': 'src/install-prettier.js',
    '.prettierrc': 'src/.prettierrc.js',
  },
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].js',
    sourcemap: true,
    exports: 'auto',
    banner: '#!/usr/bin/env node'
  },
  plugins: [
    copy({
      targets:[
        { src: 'src/eslint.js', dest: 'lib' },
        { src: 'src/.prettierignore', dest: 'lib' },
        { src: 'src/.eslintrc.json', dest: 'lib' },
      ]
    }),
    nodeResolve({
      preferBuiltins: true,
      modulesOnly: true,
      browser: false
    }),
    commonjs({
      include: 'node_modules/**',
      requireReturnsDefault: 'auto'
    }),
    json(),
    babel({
      babelHelpers: 'inline',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: '12'
          }
        }]
      ]
    }),
    terser({
      compress: true,
      mangle: true
    })
  ],
  external: [
    'chalk',
    'commander',
    'fs-extra',
    'inquirer',
    'path',
    'child_process',
    'cross-spawn',
    'process',
    'url'
  ]
}; 