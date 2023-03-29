module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true
  },
  extends: ['standard'],
  overrides: [
    {
      files: ['spec/**'],
      plugins: ['jest'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest/style'
      ],
      globals: {
        client: 'writable',
        context: 'writable',
        load: 'writable',
        unload: 'writable',
        scene: 'writable'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'es6',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: [
    'script/**/*.js'
  ],
  globals: {
    g: 'readonly'
  },
  rules: {}
}
