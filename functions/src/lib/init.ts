import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Bugsnag from '@bugsnag/js';
import bugsnagPluginExpress from '@bugsnag/plugin-express';
import type { RuntimeConfig } from '../types';

admin.initializeApp();
Bugsnag.start({
    apiKey: (functions.config() as RuntimeConfig).bugsnag.apikey,
    appType: 'backend',
    plugins: [bugsnagPluginExpress],
});
