/* eslint-disable promise/no-nesting */
import { h, render } from 'preact';
import { Provider } from 'unistore/preact';
import store from './redux/store';
import App from './components/App';
import ErrorBoundary from './components/ErrorBoundary';
import { startBugsnag } from './lib/bugsnag';

import './polyfills/form-reportvalidity';

export default function Application(): h.JSX.Element {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <App />
            </Provider>
        </ErrorBoundary>
    );
}

if (!process.env.BUILD_SSR) {
    startBugsnag();
    const body = document.body;
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    render(<Application />, body);

    if (
        'serviceWorker' in navigator &&
        process.env.NODE_ENV === 'production' &&
        !/^((127|192\.168|10)\.|localhost)/u.test(window.location.hostname)
    ) {
        navigator.serviceWorker
            .register('/sw.js')
            .then((reg) =>
                reg.addEventListener('updatefound', () => {
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.addEventListener('statechange', () => {
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // eslint-disable-next-line promise/no-nesting
                                reg.update().catch((e: unknown) => console.error(e));
                            }
                        });
                    }
                }),
            )
            .catch((e: unknown) => {
                console.error(e);
            });
    }

    document.getElementById('version')!.addEventListener('click', () => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (self.caches) {
            self.caches
                .keys()
                .then((keyList) => Promise.all(keyList.map((key) => self.caches.delete(key))))
                .then(() => ('serviceWorker' in navigator ? navigator.serviceWorker.getRegistration() : null))
                .then((reg) => reg?.unregister())
                .then(() => self.location.reload())
                .catch((e: unknown) => {
                    console.error(e);
                    self.location.reload();
                });
        } else {
            self.location.reload();
        }
    });
}
