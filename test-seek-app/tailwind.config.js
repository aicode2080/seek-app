/** @type {import('tailwindcss').Config} */
module.exports = {
  // 使用 jit 模式可以提高性能
  mode: 'jit',
  // 确保扫描所有有可能包含 Tailwind 类的文件
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // 可以在这里添加自定义颜色、间距等
      colors: {
        'primary': '#3490dc',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      },
    },
  },
  plugins: [],
  // 关闭默认的样式重置，避免与现有样式冲突
  corePlugins: {
    preflight: false,
  },
}