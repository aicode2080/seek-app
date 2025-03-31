const path = require('path');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { babel } = require('@rollup/plugin-babel');
const { baseConfig, buildConfig, resolvePath } = require('./rollup.base');
const replace = require('@rollup/plugin-replace');
const { visualizer } = require('rollup-plugin-visualizer');
const del = require('rollup-plugin-delete');

// 生产环境配置
const buildProdConfig = {
  ...baseConfig,
  plugins: [
    // 条件性地清理输出目录
    buildConfig.clean && del({ targets: resolvePath(buildConfig.output.dir) }),
    
    ...baseConfig.plugins,
    
    // 环境变量替换
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    
    // 代码压缩
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    }),
    
    // 生成分析报告（可选）
    process.env.ANALYZE && visualizer({
      filename: resolvePath('stats.html'),
      open: true,
      gzipSize: true
    })
  ].filter(Boolean)
};

module.exports = buildProdConfig; 