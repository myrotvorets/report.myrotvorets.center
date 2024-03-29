import { Configuration as WebpackConfiguration } from 'webpack';
import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { sync as globSync } from 'glob';
import path from 'path';
import { InjectManifest } from 'workbox-webpack-plugin';
import { HwpInlineRuntimeChunkPlugin } from 'hwp-inline-runtime-chunk-plugin';
import { SubresourceIntegrityPlugin } from 'webpack-subresource-integrity';
import { BugsnagBuildReporterPlugin, BugsnagSourceMapUploaderPlugin } from 'webpack-bugsnag-plugins';

import commonConfig, { BugsnagAPIKey, version } from './webpack.common';

export default function (): WebpackConfiguration {
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
            new HwpInlineRuntimeChunkPlugin({ removeSourceMap: false }),
            new SubresourceIntegrityPlugin({
                hashFuncNames: ['sha384'],
            }),
            new InjectManifest({
                swSrc: './src/sw.ts',
                compileSrc: true,
                include: ['index.html', /\.m?js$/u, /\.svg$/u, /\.css$/u, /\.png$/u],
                excludeChunks: ['runtime'],
                dontCacheBustURLsMatching: /\.[0-9a-f]{5}\./u,
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:5].css',
                chunkFilename: '[name].[contenthash:5].css',
            }),
            new PurgeCSSPlugin({
                paths: globSync(`${path.join(__dirname, '../src')}/**/*`, {
                    nodir: true,
                }),
                blocklist: [],
                safelist: [],
            }),
            process.env.CI
                ? new BugsnagSourceMapUploaderPlugin({
                      apiKey: BugsnagAPIKey,
                      appVersion: version,
                      overwrite: true,
                  })
                : null,
            process.env.CI && process.env.GITHUB_SHA
                ? new BugsnagBuildReporterPlugin({
                      apiKey: BugsnagAPIKey,
                      appVersion: version,
                      releaseStage: 'production',
                      sourceControl: {
                          provider: 'github',
                          repository: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`,
                          revision: process.env.GITHUB_SHA,
                      },
                  })
                : null,
        ].filter(Boolean),
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
    } as WebpackConfiguration);
}
