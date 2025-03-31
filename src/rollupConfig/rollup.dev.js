const { baseConfig, buildConfig, resolvePath } = require('./rollup.base');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const replace = require('@rollup/plugin-replace');

// 开发环境配置
const devConfig = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    
    // 环境变量替换
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    
    // 开发服务器
    serve({
      contentBase: ['dist', 'public'],
      port: buildConfig.server.port,
      host: buildConfig.server.host,
      open: buildConfig.server.open
    }),
    
    // 热更新
    livereload({
      watch: 'dist',
      verbose: false
    })
  ]
};

module.exports = devConfig; 