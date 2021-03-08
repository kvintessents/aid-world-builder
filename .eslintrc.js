module.exports = {
    extends: [
        '@nuxtjs/eslint-config-typescript',
    ],
    rules: {
        indent: ['error', 4],
        'comma-dangle': ['error', 'always-multiline'],
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', {
            anonymous: 'never',
            named: 'never',
            asyncArrow: 'always',
        }],
        'no-unused-vars': ['error', { args: 'after-used' }],
        '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used' }],
        'arrow-parens': ['error', 'as-needed'],
        'object-shorthand': 'off',
        curly: ['error', 'multi-line'],
        'vue/html-indent': [
            'error', 4,
        ],
        'vue/script-indent': ['error', 4, {
            baseIndent: 1,
            switchCase: 0,
            ignores: [],
        }],
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
            },
        },
    ],
};
