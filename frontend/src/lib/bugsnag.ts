/* istanbul ignore file */

import Bugsnag from '@bugsnag/js';

export function startBugsnag(): void {
    Bugsnag.start({
        apiKey: process.env.BUGSNAG_API_KEY || '',
        appVersion: process.env.APP_VERSION,
        appType: 'web',
        releaseStage: process.env.NODE_ENV || 'development',
        onError: (e) => {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            e.addMetadata('webdriver', {
                webdriver: navigator.webdriver,
            });

            e.addMetadata('connection', {
                type: connection?.type || '',
                effectiveType: connection?.effectiveType || '',
                downlink: connection?.downlink ?? -1,
                downlinkMax: connection?.downlinkMax ?? -1,
                rtt: connection?.rtt ?? -1,
                saveData: connection?.saveData ?? false,
            });
        },
    });
}
