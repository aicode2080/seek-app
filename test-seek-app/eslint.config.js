#!/usr/bin/env node
'use strict';
module.exports = {
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 1,
    'no-unneeded-ternary': 'off',
    'no-else-return': 'off',
    'no-prototype-builtins': 'off',
    'no-undef': 'off',
    'no-undef-init': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-useless-return': 'off',
    'no-useless-escape': 'off',
    'no-void': 'off',
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-shadow': 1,
    'no-unneeded-ternary': 1,
    'max-lines': 'off',
    'guard-for-in': 'off',
    'comma-dangle': ['error', 'only-multiline'],
  },
  settings: { react: { version: 'detect' } },
};
//# sourceMappingURL=eslint.config.js.map
