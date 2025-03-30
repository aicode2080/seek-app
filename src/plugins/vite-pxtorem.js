import postcss from 'postcss';
import pxToViewport from 'postcss-px-to-viewport';

/**
 * Vite 插件：将 px 转换为 rem
 * @param {Object} options 配置选项
 * @param {number} options.viewportWidth 视口宽度，默认 375
 * @param {number} options.viewportHeight 视口高度，默认 667
 * @param {number} options.unitPrecision 单位精度，默认 5
 * @param {string} options.viewportUnit 视口单位，默认 'vw'
 * @param {string[]} options.selectorBlackList 选择器黑名单，默认 []
 * @param {number} options.minPixelValue 小于或等于该值的像素值不转换，默认 1
 * @param {boolean} options.mediaQuery 是否包含媒体查询，默认 false
 * @returns {Object} Vite 插件对象
 */
export default function vitePxtorem(options = {}) {
  const defaultOptions = {
    viewportWidth: 375,
    viewportHeight: 667,
    unitPrecision: 5,
    viewportUnit: 'vw',
    selectorBlackList: [],
    minPixelValue: 1,
    mediaQuery: false
  };

  const finalOptions = { ...defaultOptions, ...options };

  return {
    name: 'vite-plugin-pxtorem',
    async transform(code, id) {
      // 检查是否是 CSS 文件
      if (!id.endsWith('.css')) {
        return null;
      }

      // 检查是否在排除列表中
      if (finalOptions.selectorBlackList.some(pattern => id.includes(pattern))) {
        return null;
      }

      try {
        const result = await postcss([
          pxToViewport(finalOptions)
        ]).process(code, {
          from: id
        });

        return {
          code: result.css,
          map: result.map
        };
      } catch (error) {
        console.error('转换 CSS 失败:', error);
        return null;
      }
    }
  };
} 