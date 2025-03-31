# Seek-App

现代化的前端应用开发工具

## 功能特点

- 基于 Rollup 的构建系统
- 开发环境支持热重载
- 生产环境代码优化和压缩
- 模块化的配置文件结构
- 简洁直观的API

## 安装

```bash
npm install seek-app --save-dev
```

或者

```bash
yarn add seek-app --dev
```

## 使用方法

### 开发环境

启动开发服务器：

```bash
npm run dev
```

这将启动一个开发服务器，支持热重载，并在浏览器中自动打开应用。

### 构建生产版本

构建优化后的生产版本：

```bash
npm run build
```

生成的文件将在 `dist` 目录中。

### 分析构建

分析构建包的大小：

```bash
npm run analyze
```

这将生成一个可视化报告，帮助你分析构建包的大小和依赖关系。

## 配置

### Rollup 配置

Rollup 配置文件位于 `src/rollupConfig` 目录下：

- `rollup.base.js` - 基础配置
- `rollup.dev.js` - 开发环境配置
- `rollup.build.js` - 生产环境配置

### 自定义配置

你可以通过修改 `src/rollupConfig/rollup.base.js` 中的 `buildConfig` 对象来自定义构建配置。

## 目录结构

```
seek-app/
├── dist/            # 构建输出目录
├── src/             # 源代码
│   ├── index.js     # 主入口文件
│   ├── rollupConfig/# Rollup 配置文件
│   └── styles/      # 样式文件
├── public/          # 静态文件
└── package.json     # 项目配置
```

## 浏览器兼容性

默认支持的浏览器在 `package.json` 的 `browserslist` 字段中定义：

```json
"browserslist": [
  "> 1%",
  "last 2 versions",
  "not dead"
]
```

## 贡献

欢迎贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解如何参与项目开发。

## 许可证

[MIT](LICENSE)