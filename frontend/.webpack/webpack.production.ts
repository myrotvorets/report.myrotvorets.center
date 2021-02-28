import webpack from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import PurgecssPlugin from 'purgecss-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import glob from 'glob';
import path from 'path';
import { InjectManifest } from 'workbox-webpack-plugin';
import { HwpInlineRuntimeChunkPlugin } from 'hwp-inline-runtime-chunk-plugin';
import { BugsnagSourceMapUploaderPlugin } from 'webpack-bugsnag-plugins';

import commonConfig, { BugsnagAPIKey, version } from './webpack.common';

export default function (): webpack.Configuration {
    return merge(commonConfig, {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.s?css$/u,
                    use: [
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
                                postcssOptions: {
                                    config: path.resolve(path.join(__dirname, '..')),
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
            new HwpInlineRuntimeChunkPlugin({ removeSourceMap: true }),
            new InjectManifest({
                swSrc: './src/sw.ts',
                compileSrc: true,
                include: ['index.html', /\.m?js$/u, /\.svg$/u, /\.css$/u, /\.png$/u],
                excludeChunks: ['runtime'],
                dontCacheBustURLsMatching: /\.[0-9a-f]{5}\./u,
            }),
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
            new BugsnagSourceMapUploaderPlugin({
                apiKey: BugsnagAPIKey,
                appVersion: version,
            }),
        ],
        optimization: {
            runtimeChunk: 'single',
            moduleIds: 'deterministic',
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        output: {
                            comments: false,
                            ecma: 2017,
                            safari10: true,
                        },
                        sourceMap: true,
                        mangle: true,
                        compress: {
                            ecma: 2017,
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
