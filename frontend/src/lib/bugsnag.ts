/* istanbul ignore file */

import Bugsnag from '@bugsnag/js';

export function startBugsnag(): void {
    Bugsnag.start({
        apiKey: process.env.BUGSNAG_API_KEY || '',
        appVersion: process.env.APP_VERSION,
        appType: 'web',
        releaseStage: process.env.NODE_ENV || 'development',
    });
}
