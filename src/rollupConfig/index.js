// 导入开发环境和生产环境配置
const devConfig = require('./rollup.dev.js');
const buildConfig = require('./rollup.build.js');

// 确保环境变量已设置
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// 根据环境选择配置
const config = process.env.NODE_ENV === 'development' ? devConfig : buildConfig;

// 导出配置
module.exports = {
  rollupConfig: config
}; 