module.exports = function (api) {
    api.cache(() => [process.env.NODE_ENV || 'development', process.env.BUILD_SSR || 'false'].join(':'));

    return {
        presets: [
            '@babel/preset-typescript',
            [
                '@babel/env',
                {
                    modules: 'auto',
                    loose: true,
                    bugfixes: true,
                    targets: {
                        esmodules: true,
                    },
                },
            ],
        ],
        plugins: [
            [
                '@babel/plugin-transform-react-jsx',
                {
                    pragma: 'h',
                    pragmaFrag: 'Fragment',
                },
            ],
            process.env.BUILD_SSR ? ['babel-plugin-dynamic-import-node-sync'] : null,
            ['@babel/plugin-transform-class-properties', { loose: true }],
            ['@babel/plugin-transform-optional-chaining', { loose: true }],
            ['@babel/plugin-transform-numeric-separator'],
        ].filter(Boolean),
    };
};
