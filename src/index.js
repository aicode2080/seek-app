// 导出所有模块
module.exports = {
  // 核心命令
  seekApp: require('./seek-app'),
  
  // 代码审查相关
  codeReview: require('./code-review'),
  codeReviewCommand: require('./code-review-command'),
  
  // 项目创建相关
  createModule: require('./create-module'),
  createRedux: require('./create-redux'),
  createReactApp: require('./createReactApp'),
  
  // 代码规范相关
  eslint: require('./eslint'),
  eslintConfig: require('./eslint.config'),
  installEslint: require('./install-eslint'),
  installPrettier: require('./install-prettier'),
  
  // Git 相关
  gitAuto: require('./git-auto'),
  
  // 接口相关
  interfaceAuto: require('./interface-auto'),
  
  // 搜索相关
  searchCode: require('./search-code'),
  
  // 插件
  vitePxtorem: require('./plugins/vite-pxtorem'),
  
  // Rollup 配置
  rollupConfig: {
    base: require('./rollupConfig/rollup.base'),
    build: require('./rollupConfig/rollup.build'),
    dev: require('./rollupConfig/rollup.dev'),
    config: require('./rollupConfig/config'),
    externals: require('./rollupConfig/externals'),
    loaders: require('./rollupConfig/loaders'),
    plugins: require('./rollupConfig/plugins')
  }
}; 