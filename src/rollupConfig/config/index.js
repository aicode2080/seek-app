import path from 'path';

// 环境变量
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

// 路径配置
export const rootPath = process.cwd();
export const srcPath = path.resolve(rootPath, 'src');
export const distPath = path.resolve(rootPath, 'dist');
export const buildPath = path.resolve(rootPath, 'build');

// 文件类型配置
export const fileTypes = {
  ts: ['.ts', '.tsx'],
  js: ['.js', '.jsx'],
  css: ['.css', '.scss', '.less', '.styl'],
  images: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  fonts: ['.woff', '.woff2', '.ttf', '.eot', '.otf'],
  media: ['.mp4', '.webm', '.ogg', '.mp3', '.wav'],
  json: ['.json'],
  html: ['.html']
};

// 构建配置
export const buildConfig = {
  // 入口文件
  entry: path.resolve(srcPath, 'index.ts'),
  
  // 输出配置
  output: {
    dir: isDev ? distPath : buildPath,
    format: 'es',
    sourcemap: true,
    entryFileNames: 'js/[name].[hash].js',
    chunkFileNames: 'js/[name].[hash].js',
    assetFileNames: (assetInfo) => {
      const info = assetInfo.name.split('.');
      const ext = info[info.length - 1];
      if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
        return `images/[name].[hash].[ext]`;
      }
      if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
        return `fonts/[name].[hash].[ext]`;
      }
      if (/\.(mp4|webm|ogg|mp3|wav)$/.test(assetInfo.name)) {
        return `media/[name].[hash].[ext]`;
      }
      return `assets/[name].[hash].[ext]`;
    }
  },

  // 开发服务器配置
  devServer: {
    port: 3000,
    host: 'localhost',
    open: true,
    cors: true
  },

  // 构建优化配置
  optimization: {
    minify: isProd,
    splitChunks: isProd,
    treeShaking: true
  },

  // 别名配置
  alias: {
    '@': srcPath,
    '@components': path.resolve(srcPath, 'components'),
    '@assets': path.resolve(srcPath, 'assets'),
    '@utils': path.resolve(srcPath, 'utils')
  }
}; 