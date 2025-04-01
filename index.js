// 导出所有模块
import seekApp from './src/seek-app.js';
import codeReview from './src/code-review.js';
import codeReviewCommand from './src/code-review-command.js';
import createModule from './src/create-module.js';
import createRedux from './src/create-redux.js';
import createReactApp from './src/createReactApp.js';
import eslint from './src/eslint.js';
import eslintConfig from './src/eslint.config.js';
import installEslint from './src/install-eslint.js';
import installPrettier from './src/install-prettier.js';
import gitAuto from './src/git-auto.js';
import interfaceAuto from './src/interface-auto.js';
import searchCode from './src/search-code.js';
import vitePxtorem from './src/plugins/vite-pxtorem.js';
import rollupBase from './src/rollupConfig/rollup.base.js';
import rollupBuild from './src/rollupConfig/rollup.build.js';
import rollupDev from './src/rollupConfig/rollup.dev.js';
import rollupConfig from './src/rollupConfig/config/index.js';
import rollupExternals from './src/rollupConfig/externals/index.js';
import rollupLoaders from './src/rollupConfig/loaders/index.js';
import rollupPlugins from './src/rollupConfig/plugins/index.js';

export default {
  // 核心命令
  seekApp,
  
  // 代码审查相关
  codeReview,
  codeReviewCommand,
  
  // 项目创建相关
  createModule,
  createRedux,
  createReactApp,
  
  // 代码规范相关
  eslint,
  eslintConfig,
  installEslint,
  installPrettier,
  
  // Git 相关
  gitAuto,
  
  // 接口相关
  interfaceAuto,
  
  // 搜索相关
  searchCode,
  
  // 插件
  vitePxtorem,
  
  // Rollup 配置
  rollupConfig: {
    base: rollupBase,
    build: rollupBuild,
    dev: rollupDev,
    config: rollupConfig,
    externals: rollupExternals,
    loaders: rollupLoaders,
    plugins: rollupPlugins
  }
}; 