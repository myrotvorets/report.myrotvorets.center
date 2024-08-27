/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Configuration } from 'webpack';

export default function (_env: Record<string, unknown>, args: Record<string, unknown>): Configuration {
    let config: Configuration;
    if (args.mode && args.mode === 'production') {
        process.env.NODE_ENV = 'production';
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        config = require(`./.webpack/webpack.production.ts`).default();
    } else {
        process.env.NODE_ENV = 'development';
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        config = require(`./.webpack/webpack.development.ts`).default();
    }

    return config;
}
