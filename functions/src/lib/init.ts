import { initializeApp } from 'firebase-admin/app';
import Bugsnag from '@bugsnag/js';
import bugsnagPluginExpress from '@bugsnag/plugin-express';
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'] });

initializeApp();

Bugsnag.start({
    apiKey: process.env.BUGSNAG_APIKEY!,
    appType: 'backend',
    releaseStage: process.env.FUNCTIONS_EMULATOR !== 'true' ? 'production' : 'development',
    enabledReleaseStages: ['production'],
    plugins: [bugsnagPluginExpress],
});
