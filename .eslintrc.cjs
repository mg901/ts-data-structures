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
    'import/prefer-default-export': 0,
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/no-shadow': 0,
      },
    },
  ],
};
