import { initializeApp } from 'firebase-admin/app';
import Bugsnag from '@bugsnag/js';
import bugsnagPluginExpress from '@bugsnag/plugin-express';

initializeApp();
Bugsnag.start({
    apiKey: process.env.BUGSNAG_APIKEY!,
    appType: 'backend',
    plugins: [bugsnagPluginExpress],
});
