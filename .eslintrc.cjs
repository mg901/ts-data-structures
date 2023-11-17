module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'newline-before-return': 2,
    'prefer-const': 0,
    'import/prefer-default-export': 0,
  },
};
