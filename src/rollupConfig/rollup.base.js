const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

// 配置构建选项
const buildConfig = {
  // 入口文件，默认为 src/index.js
  entry: 'src/index.js',
  
  // 输出目录
  output: {
    dir: 'dist',
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
const resolvePath = (...args) => path.resolve(process.cwd(), ...args);

// 检查文件类型
const isTypeScript = (file) => /\.(ts|tsx)$/.test(file);
const isJavaScript = (file) => /\.(js|jsx)$/.test(file);
const isCSS = (file) => /\.css$/.test(file);
const isLess = (file) => /\.less$/.test(file);
const isSass = (file) => /\.(sass|scss)$/.test(file);
const isJSON = (file) => /\.json$/.test(file);
const isImage = (file) => /\.(png|jpe?g|gif|svg|webp)$/.test(file);
const isFont = (file) => /\.(woff2?|eot|ttf|otf)$/.test(file);
const isMedia = (file) => /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(file);
const isHTML = (file) => /\.html$/.test(file);

// 获取文件扩展名
const getFileExt = (file) => {
  const match = file.match(/\.([^.]+)$/);
  return match ? match[1] : '';
};

// 基础 Rollup 配置
const baseConfig = {
  input: resolvePath(buildConfig.entry),
  output: {
    dir: resolvePath(buildConfig.output.dir),
    format: buildConfig.output.format,
    name: buildConfig.output.name,
    sourcemap: buildConfig.output.sourcemap,
  },
  plugins: [
    nodeResolve({
      extensions: buildConfig.extensions
    }),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { browsers: '> 1%, not dead' } }]
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    })
  ],
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

module.exports = {
  baseConfig,
  buildConfig,
  resolvePath,
  isTypeScript,
  isJavaScript,
  isCSS,
  isLess,
  isSass,
  isJSON,
  isImage,
  isFont,
  isMedia,
  isHTML,
  getFileExt
}; 