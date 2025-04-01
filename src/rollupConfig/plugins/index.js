import { resolvePath } from '../rollup.base';
import { isDev } from '../config';

// 开发环境插件
const devPlugins = [
  // 开发服务器
  require('rollup-plugin-serve')({
    open: true,
    contentBase: [resolvePath('dist')],
    host: 'localhost',
    port: 3000
  }),
  // 热重载
  require('rollup-plugin-livereload')({
    watch: resolvePath('dist')
  })
];

// 生产环境插件
const prodPlugins = [
  // 压缩代码
  require('rollup-plugin-terser')({
    compress: {
      drop_console: true,
      drop_debugger: true
    },
    mangle: {
      toplevel: true
    },
    output: {
      comments: false
    }
  }),
  // 分析打包结果
  require('rollup-plugin-visualizer')({
    filename: resolvePath('build/stats.html'),
    open: true
  })
];

// 通用插件
const commonPlugins = [
  // 替换环境变量
  require('@rollup/plugin-replace')({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  // 别名
  require('@rollup/plugin-alias')({
    entries: [
      { find: '@', replacement: resolvePath('src') },
      { find: '@components', replacement: resolvePath('src/components') },
      { find: '@assets', replacement: resolvePath('src/assets') },
      { find: '@utils', replacement: resolvePath('src/utils') }
    ]
  }),
  // 复制静态资源
  require('rollup-plugin-copy')({
    targets: [
      { src: 'public/*', dest: 'dist' },
      { src: 'src/assets/*', dest: 'dist/assets' }
    ]
  })
];

// 获取所有插件
const getPlugins = () => {
  const plugins = [...commonPlugins];

  if (isDev) {
    plugins.push(...devPlugins);
  } else {
    plugins.push(...prodPlugins);
  }

  return plugins;
};

module.exports = {
  getPlugins
}; 