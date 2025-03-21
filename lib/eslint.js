module.exports = {
  rules: {
    'no-console': 1, // 禁用console.log
    'no-debugger': 1, // 禁用debugger
    'no-unused-vars': 'off', // 禁止出现未使用过的变量
    'no-unneeded-ternary': 'off', // 禁止可以在有更简单的可替代的表达式时使用三元操作符
    'no-else-return': 'off', // 禁止 if 语句中 return 语句之后有 else 块
    'no-prototype-builtins': 'off', // 禁止直接调用 Object.prototypes 的内置属性
    'no-undef': 'off', // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    'no-undef-init': 'off', // 禁止将变量初始化为 undefined
    'no-underscore-dangle': 'off', // 禁止标识符中有悬空下划线
    'no-unused-expressions': 'off', // 禁止出现未使用过的表达式
    'no-useless-return': 'off', // 禁止多余的 return 语句
    'no-useless-escape': 'off', // 禁用不必要的转义字符
    'no-void': 'off', // 禁用 void 操作符
    'no-restricted-syntax': 'off', // 禁用特定的语法
    'no-param-reassign': 'off', // 禁止对 function 的参数进行重新赋值
    'no-plusplus': 'off', // 禁止
    'no-shadow': 1, // 禁止变量声明与外层作用域的变量同名
  },
};
