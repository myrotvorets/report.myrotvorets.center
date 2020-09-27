import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { merge } from 'webpack-merge';

import commonConfig from './webpack.common';

export default function (): webpack.Configuration {
    return merge(commonConfig, {
        mode: 'development',
        performance: {
            maxEntrypointSize: 500 * 1024,
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/u,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                eslint: {
                    enabled: true,
                    files: ['src/**/*.{ts,tsx}'],
                },
            }),
        ],
    } as webpack.Configuration);
}
