import MyrotvoretsEsLintConfig from '@myrotvorets/eslint-config-myrotvorets-ts';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: ['lib/**', '**/*.js'],
    },
    ...MyrotvoretsEsLintConfig,
    {
        ignores: ['lib/**', '**/*.js'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2019,
            },
            globals: {
                ...globals.node,
                ...globals.nodeBuiltin,
                ...globals.jest,
            },
        },
    },
];
