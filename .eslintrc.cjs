module.exports = {
  env: {
    es2023: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'newline-before-return': 2,
    'prefer-const': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    '@typescript-eslint/no-use-before-define': 0,
  },
};
