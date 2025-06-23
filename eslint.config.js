module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint', 'prettier'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        // your rules here
      },
    },
  ],
};
