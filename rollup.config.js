import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import path from 'path';

export default {
  input: {
    'seek-app': 'src/seek-app.js',
    'git-auto': 'src/git-auto.js',
    'interface-auto': 'src/interface-auto.js',
    'search-code': 'src/search-code.js',
    'index': 'src/index.js',
    'create-redux': 'src/create-redux.js',
    'eslint': 'src/eslint.js'
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
    nodeResolve({
      preferBuiltins: true,
      modulesOnly: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    json(),
    babel({
      babelHelpers: 'inline',
      exclude: 'node_modules/**'
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
    'cross-spawn'
  ]
}; 