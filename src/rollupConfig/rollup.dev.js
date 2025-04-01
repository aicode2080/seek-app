import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import htmlPlugin from './plugins/html-plugin.js';
import { findEntryFile, basePlugins, baseOutput, outputDir } from './rollup.base.js';

// 开发环境配置
export const devConfig = {
  input: findEntryFile(),
  output: {
    ...baseOutput,
    inlineDynamicImports: true
  },
  external: ['react', 'react-dom'],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: false
  },
  plugins: [
    ...basePlugins,
    htmlPlugin({
      filename: 'index.html',
      title: 'Seek App - Development'
    }),
    serve({
      contentBase: [outputDir],
      host: 'localhost',
      port: 3000,
      open: true
    }),
    livereload({
      watch: outputDir
    })
  ]
}; 