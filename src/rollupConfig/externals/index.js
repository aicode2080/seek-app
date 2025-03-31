// 外部依赖配置
export const externals = {
  // React 相关
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router': 'ReactRouter',
  'react-router-dom': 'ReactRouterDOM',
  'react-redux': 'ReactRedux',
  'redux': 'Redux',
  'redux-thunk': 'ReduxThunk',
  'redux-saga': 'ReduxSaga',

  // Vue 相关
  vue: 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',

  // Angular 相关
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/forms': 'ng.forms',
  '@angular/router': 'ng.router',
  '@angular/http': 'ng.http',

  // 工具库
  'lodash': '_',
  'moment': 'moment',
  'axios': 'axios',
  'jquery': 'jQuery',
  'underscore': '_',
  'backbone': 'Backbone',
  'socket.io-client': 'io',

  // UI 框架
  'antd': 'antd',
  'element-ui': 'ELEMENT',
  'bootstrap': 'bootstrap',
  'tailwindcss': 'tailwindcss',

  // 图表库
  'echarts': 'echarts',
  'd3': 'd3',
  'chart.js': 'Chart',

  // 地图
  'leaflet': 'L',
  'mapbox-gl': 'mapboxgl',

  // 编辑器
  'monaco-editor': 'monaco',
  'ace-builds': 'ace',

  // 其他常用库
  'marked': 'marked',
  'highlight.js': 'hljs',
  'prismjs': 'Prism',
  'moment-timezone': 'moment',
  'date-fns': 'dateFns',
  'lodash-es': '_',
  'rxjs': 'rxjs',
  'zone.js': 'zone'
};

// 获取外部依赖的 CDN 链接
export const getExternalCDN = (pkg) => {
  const cdnMap = {
    // React 相关
    'react': 'https://unpkg.com/react@17/umd/react.production.min.js',
    'react-dom': 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    'react-router': 'https://unpkg.com/react-router@5/umd/react-router.min.js',
    'react-router-dom': 'https://unpkg.com/react-router-dom@5/umd/react-router-dom.min.js',
    'react-redux': 'https://unpkg.com/react-redux@7/umd/react-redux.min.js',
    'redux': 'https://unpkg.com/redux@4/umd/redux.min.js',
    'redux-thunk': 'https://unpkg.com/redux-thunk@2.3/umd/redux-thunk.min.js',
    'redux-saga': 'https://unpkg.com/redux-saga@1.1.3/umd/redux-saga.min.js',

    // Vue 相关
    'vue': 'https://unpkg.com/vue@2.6.14/dist/vue.min.js',
    'vue-router': 'https://unpkg.com/vue-router@3.5.3/dist/vue-router.min.js',
    'vuex': 'https://unpkg.com/vuex@3.6.2/dist/vuex.min.js',

    // 工具库
    'lodash': 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    'moment': 'https://unpkg.com/moment@2.29.1/moment.min.js',
    'axios': 'https://unpkg.com/axios@0.21.1/dist/axios.min.js',
    'jquery': 'https://unpkg.com/jquery@3.6.0/dist/jquery.min.js',

    // UI 框架
    'antd': 'https://unpkg.com/antd@4.16.13/dist/antd.min.js',
    'element-ui': 'https://unpkg.com/element-ui@2.15.6/lib/index.js',

    // 图表库
    'echarts': 'https://unpkg.com/echarts@5.2.2/dist/echarts.min.js',
    'd3': 'https://unpkg.com/d3@6.7.0/dist/d3.min.js',
    'chart.js': 'https://unpkg.com/chart.js@3.5.1/dist/chart.min.js'
  };

  return cdnMap[pkg] || '';
};

// 检查是否是外部依赖
export const isExternal = (id) => {
  return Object.keys(externals).some(pkg => id.startsWith(pkg));
}; 