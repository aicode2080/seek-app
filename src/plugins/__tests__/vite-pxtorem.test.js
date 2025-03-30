import { describe, it, expect } from 'vitest';
import vitePxtorem from '../vite-pxtorem';
import postcss from 'postcss';

describe('vite-plugin-pxtorem', () => {
  const defaultOptions = {
    viewportWidth: 375,
    viewportHeight: 667,
    unitPrecision: 5,
    viewportUnit: 'vw',
    selectorBlackList: [],
    minPixelValue: 1,
    mediaQuery: false
  };

  it('应该正确转换 px 为 vw', async () => {
    const plugin = vitePxtorem(defaultOptions);
    const css = `
      .test {
        width: 750px;
        height: 100px;
        font-size: 28px;
        margin: 20px;
        padding: 10px;
      }
    `;

    const result = await plugin.transform(css, 'test.css');
    expect(result.code).toContain('200vw'); // 750/375*100
    expect(result.code).toContain('26.66667vw'); // 100/375*100
    expect(result.code).toContain('7.46667vw'); // 28/375*100
    expect(result.code).toContain('5.33333vw'); // 20/375*100
    expect(result.code).toContain('2.66667vw'); // 10/375*100
  });

  it('应该排除指定的文件', async () => {
    const plugin = vitePxtorem({
      ...defaultOptions,
      selectorBlackList: ['exclude.css']
    });

    const css = `
      .test {
        width: 750px;
      }
    `;

    const result = await plugin.transform(css, 'exclude.css');
    expect(result).toBeNull();
  });

  it('应该只转换指定的属性', async () => {
    const plugin = vitePxtorem({
      ...defaultOptions,
      propList: ['width', 'height']
    });

    const css = `
      .test {
        width: 750px;
        height: 100px;
        font-size: 28px;
        margin: 20px;
      }
    `;

    const result = await plugin.transform(css, 'test.css');
    expect(result.code).toContain('200vw'); // 750/375*100
    expect(result.code).toContain('26.66667vw'); // 100/375*100
    expect(result.code).toContain('28px');
    expect(result.code).toContain('20px');
  });

  it('应该忽略小于 minPixelValue 的值', async () => {
    const plugin = vitePxtorem({
      ...defaultOptions,
      minPixelValue: 2
    });

    const css = `
      .test {
        width: 750px;
        height: 1px;
        font-size: 1px;
      }
    `;

    const result = await plugin.transform(css, 'test.css');
    expect(result.code).toContain('200vw'); // 750/375*100
    expect(result.code).toContain('1px');
  });

  it('应该处理媒体查询', async () => {
    const plugin = vitePxtorem({
      ...defaultOptions,
      mediaQuery: true
    });
    
    const css = `
      @media screen and (min-width: 768px) {
        .test {
          width: 375px;
          font-size: 16px;
        }
      }
    `;

    const result = await plugin.transform(css, 'test.css');
    expect(result.code).toContain('100vw'); // 375/375*100
    expect(result.code).toContain('4.26667vw'); // 16/375*100
  });

  it('应该处理非 CSS 文件', async () => {
    const plugin = vitePxtorem(defaultOptions);
    const jsCode = `
      const style = {
        width: '750px',
        height: '100px'
      };
    `;

    const result = await plugin.transform(jsCode, 'test.js');
    expect(result).toBeNull();
  });

  it('应该保留无效的 CSS 值', async () => {
    const plugin = vitePxtorem(defaultOptions);
    const css = `
      .test {
        width: invalid;
        height: 100px;
      }
    `;

    const result = await plugin.transform(css, 'test.css');
    expect(result.code).toContain('width: invalid');
    expect(result.code).toContain('26.66667vw'); // 100/375*100
  });
}); 