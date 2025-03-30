# vite-plugin-pxtorem

一个用于 Vite 的 px 转 rem 插件，基于 postcss-pxtorem。

## 安装

```bash
npm install vite-plugin-pxtorem -D
```

## 使用方法

在 `vite.config.js` 中配置：

```javascript
import vitePxtorem from 'vite-plugin-pxtorem';

export default {
  plugins: [
    vitePxtorem({
      rootValue: 37.5, // 根元素字体大小
      propList: ['*'], // 需要转换的属性
      exclude: [], // 排除的文件
      minPixelValue: 1 // 小于或等于该值的像素值不转换
    })
  ]
};
```

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| rootValue | number | 37.5 | 根元素字体大小 |
| propList | array | ['*'] | 需要转换的属性 |
| exclude | array | [] | 排除的文件 |
| minPixelValue | number | 1 | 小于或等于该值的像素值不转换 |

## 示例

```css
.example {
  width: 750px;  /* 将被转换为 20rem */
  height: 100px; /* 将被转换为 2.667rem */
  font-size: 28px; /* 将被转换为 0.747rem */
}
```

## 注意事项

1. 插件只会在构建时生效
2. 默认会排除 node_modules 目录
3. 支持 CSS、SCSS、Less、Stylus 等预处理器文件 