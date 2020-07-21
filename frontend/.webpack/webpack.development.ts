import webpack from 'webpack';
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
                    test: /\.s?css$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
    } as webpack.Configuration);
}
