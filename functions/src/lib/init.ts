import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Bugsnag from '@bugsnag/js';
import bugsnagPluginExpress from '@bugsnag/plugin-express';
import { httpsAgent } from './agents';

admin.initializeApp();
Bugsnag.start({
    apiKey: functions.config().bugsnag.apikey,
    appType: 'backend',
    agent: httpsAgent,
    plugins: [bugsnagPluginExpress],
});
