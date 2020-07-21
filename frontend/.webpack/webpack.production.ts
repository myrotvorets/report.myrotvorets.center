import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import PurgecssPlugin from 'purgecss-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import glob from 'glob';
import path from 'path';
import { InjectManifest } from 'workbox-webpack-plugin';
import InlineRuntimePlugin from 'html-webpack-inline-runtime-plugin';
import ServiceWorkerPlugin from './ServiceWorkerPlugin';

import commonConfig from './webpack.common';

export default function (): webpack.Configuration {
    return merge(commonConfig, {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    loaders: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: false,
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: false,
                                config: {
                                    path: path.resolve(path.join(__dirname, '..')),
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new InlineRuntimePlugin(),
            new InjectManifest({
                swSrc: './src/sw.ts',
                include: ['index.html', /\.mjs$/, /\.svg$/, /\.css$/, /\.png$/],
                excludeChunks: ['runtime'],
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                dontCacheBustURLsMatching: /\.[0-9a-f]{5}\./,
            }),
            new ServiceWorkerPlugin(),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:5].css',
                chunkFilename: '[name].[contenthash:5].css',
            }),
            new PurgecssPlugin({
                paths: glob.sync(`${path.join(__dirname, '../src')}/**/*`, {
                    nodir: true,
                }),
            }),
        ],
        optimization: {
            runtimeChunk: 'single',
            moduleIds: 'hashed',
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            comments: false,
                            ecma: 8,
                            safari10: true,
                        },
                        sourceMap: true,
                        mangle: true,
                        compress: {
                            ecma: 8,
                            module: true,
                            keep_fargs: false,
                            pure_getters: true,
                            hoist_funs: true,
                            pure_funcs: [
                                'classCallCheck',
                                '_classCallCheck',
                                '_possibleConstructorReturn',
                                'Object.freeze',
                                'invariant',
                                'warning',
                            ],
                        },
                    },
                    extractComments: false,
                }),
            ],
            minimize: true,
        },
    } as webpack.Configuration);
}
