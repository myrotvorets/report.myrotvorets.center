import { h, render } from 'preact';
import { Provider } from 'unistore/preact';
import Bugsnag from '@bugsnag/js';
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
        !/^(127|192\.168|10)\./.test(window.location.hostname)
    ) {
        navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
                reg.addEventListener('updatefound', () => {
                    const installingWorker = reg.installing;
                    if (installingWorker) {
                        installingWorker.addEventListener('statechange', () => {
                            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                reg.update();
                            }
                        });
                    }
                });
            })
            .catch((e) => {
                console.error(e);
                Bugsnag.notify(e);
            });
    }
}
