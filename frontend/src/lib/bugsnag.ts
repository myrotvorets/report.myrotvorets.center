/* istanbul ignore file */

import Bugsnag from '@bugsnag/js';

export function startBugsnag(): void {
    Bugsnag.start({
        apiKey: process.env.BUGSNAG_API_KEY || '',
        appVersion: process.env.APP_VERSION,
        appType: 'web',
        releaseStage: process.env.NODE_ENV || 'development',
        onError: (e) => {
            e.addMetadata('webdriver', {
                webdriver: navigator.webdriver,
            });

            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                e.addMetadata('connection', {
                    type: connection.type || '',
                    effectiveType: connection.effectiveType || '',
                    downlink: connection.downlink ?? -1,
                    downlinkMax: connection.downlinkMax ?? -1,
                    rtt: connection.rtt ?? -1,
                    saveData: connection.saveData ?? false,
                });
            }

            if (e.unhandled) {
                for (const error of e.errors) {
                    if (error instanceof TypeError && error.message.indexOf('_avast_submit') !== -1) {
                        alert(
                            'It looks like you are using the Avast! browser extension. It is known to break the form submission. Please disable it, reload the page and then try again',
                        );
                        return false;
                    }
                }
            }

            return true;
        },
    });
}
