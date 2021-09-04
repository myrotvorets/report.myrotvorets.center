import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { HwpAttributesPlugin } from 'hwp-attributes-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { execSync } from 'child_process';
import { OptimizeOptions } from 'svgo';

export const BugsnagAPIKey = 'ef7411ba5af267034db13d800de8a235';
export let version: string;
try {
    version = execSync('git describe --always --long', { cwd: path.resolve(path.join(__dirname, '..')) })
        .toString()
        .trim();
} catch (e) {
    version = 'development';
}

const isProd = process.env.NODE_ENV === 'production';

const prodMinifyOptions: HtmlWebpackPlugin.MinifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    keepClosingSlash: true,
    html5: true,
};

const config: webpack.Configuration = {
    context: path.resolve(__dirname, '..'),
    node: false,
    entry: {
        bundle: path.resolve(__dirname, '../src/index.tsx'),
    },
    output: {
        globalObject: 'self',
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash:5].mjs',
        chunkFilename: '[name].[contenthash:5].mjs',
        assetModuleFilename: '[name].[contenthash:5][ext]',
        publicPath: '/',
        scriptType: 'module',
        crossOriginLoading: 'anonymous',
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-source-map',
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        compress: true,
        port: 8080,
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            react: 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
        },
    },
    module: {
        rules: [
            {
                test: /-worker\.ts$/u,
                use: [
                    {
                        loader: 'worker-loader',
                        options: { filename: 'worker-[contenthash:5].mjs' },
                    },
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/u,
                exclude: /node_modules/u,
                use: ['babel-loader'],
            },
            {
                test: /\.svg$/u,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 1024,
                    },
                },
                use: [
                    {
                        loader: 'svgo-loader',
                        options: {
                            multipass: true,
                            plugins: [
                                {
                                    name: 'preset-default',
                                    params: {
                                        overrides: {
                                            removeEmptyContainers: false,
                                        },
                                    },
                                },
                            ],
                        } as OptimizeOptions,
                    },
                ],
            },
            {
                test: /\.png$/u,
                issuer: /\.json$/u,
                type: 'javascript/auto',
                loader: 'file-loader',
                options: {
                    name: '[name].[contenthash:5].[ext]',
                    esModule: false,
                },
            },
            {
                test: /\.(png|jpe?g|webp)$/u,
                type: 'asset/resource',
            },
            {
                test: /\.json$/u,
                issuer: /\.ejs$/u,
                type: 'asset/resource',
                use: ['extract-loader', 'ref-loader'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.BUILD_SSR': JSON.stringify(false),
            'process.env.BUGSNAG_API_KEY': JSON.stringify(BugsnagAPIKey),
            'process.env.APP_VERSION': JSON.stringify(version),
        }),
        new webpack.ProvidePlugin({
            h: ['preact', 'h'],
            Fragment: ['preact', 'Fragment'],
        }),
        new HtmlWebpackPlugin({
            minify: process.env.NODE_ENV === 'production' ? prodMinifyOptions : false,
            template: '!!ejs-compiled-loader!./src/index.ejs',
            xhtml: true,
            templateParameters: {
                version,
            },
        }),
        new HwpAttributesPlugin({
            module: ['/**.mjs'],
        }),
        new CopyPlugin({
            patterns: [{ from: 'src/robots.txt', to: './robots.txt ' }],
        }),
    ],
};

export default config;
