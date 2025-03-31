const { Plugin } = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const babel = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const image = require('@rollup/plugin-image');
const svgr = require('@svgr/rollup');
const { isTypeScript, isJavaScript, isCSS, isImage, isJSON } = require('../rollup.base');

// TypeScript loader
const typescriptLoader = typescript({
  tsconfig: './tsconfig.json',
  sourceMap: true,
  declaration: true,
  declarationDir: './types',
  exclude: ['node_modules/**', 'dist/**', 'build/**']
});

// Babel loader
const babelLoader = babel({
  babelHelpers: 'bundled',
  exclude: 'node_modules/**',
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not dead']
      }
    }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ]
});

// CSS loader
const cssLoader = postcss({
  extract: true,
  modules: true,
  use: ['sass', 'less', 'stylus'],
  inject: false,
  minimize: true,
  sourceMap: true
});

// 图片 loader
const imageLoader = image({
  dom: true,
  include: /\.(png|jpg|jpeg|gif|webp)$/
});

// SVG loader
const svgLoader = svgr({
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false
          }
        }
      }
    ]
  }
});

// 获取所有 loader
const getLoaders = () => {
  const loaders = [
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: true
    }),
    commonjs(),
    json()
  ];

  // 根据文件类型添加对应的 loader
  if (isTypeScript('')) {
    loaders.push(typescriptLoader);
  }
  if (isJavaScript('')) {
    loaders.push(babelLoader);
  }
  if (isCSS('')) {
    loaders.push(cssLoader);
  }
  if (isImage('')) {
    loaders.push(imageLoader);
  }
  if (isJSON('')) {
    loaders.push(json());
  }

  return loaders;
};

module.exports = {
  typescriptLoader,
  babelLoader,
  cssLoader,
  imageLoader,
  svgLoader,
  getLoaders
}; 