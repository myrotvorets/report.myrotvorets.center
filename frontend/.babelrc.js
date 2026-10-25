module.exports = function (api) {
    api.cache(() => [process.env.NODE_ENV || 'development', process.env.BUILD_SSR || 'false'].join(':'));

    return {
        targets: { esmodules: true },
        // Preserve the previous preset-env loose compilation behavior.
        assumptions: {
            arrayLikeIsIterable: true,
            constantReexports: true,
            ignoreFunctionLength: true,
            ignoreToPrimitiveHint: true,
            mutableTemplateObject: true,
            noClassCalls: true,
            noDocumentAll: true,
            noNewArrows: true,
            objectRestNoSymbols: true,
            privateFieldsAsProperties: true,
            pureGetters: true,
            setClassMethods: true,
            setComputedProperties: true,
            setPublicClassFields: true,
            setSpreadProperties: true,
            skipForOfIteratorClosing: true,
            superIsCallableConstructor: true,
        },
        presets: [
            [
                '@babel/env',
                {
                    modules: 'auto',
                    exclude: ['transform-typeof-symbol'],
                },
            ],
            // Presets run in reverse order: strip TypeScript before transforming class fields.
            ['@babel/preset-typescript', { onlyRemoveTypeImports: false }],
        ],
        plugins: [
            [
                '@babel/plugin-transform-react-jsx',
                {
                    runtime: 'classic',
                    pragma: 'h',
                    pragmaFrag: 'Fragment',
                },
            ],
            process.env.BUILD_SSR ? ['babel-plugin-dynamic-import-node-sync'] : null,
            ['@babel/plugin-transform-optional-chaining'],
            ['@babel/plugin-transform-numeric-separator'],
        ].filter(Boolean),
    };
};
