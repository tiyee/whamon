/** @format */

module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['prettier', 'plugin:prettier/recommended'],
    settings: {},
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: false,
        },
    },
    env: {
        browser: false,
        node: true,
    },
}
