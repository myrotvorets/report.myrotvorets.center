/// <reference lib="webworker"/>

import { cacheNames, clientsClaim, skipWaiting } from 'workbox-core';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { getCacheKeyForURL, precacheAndRoute } from 'workbox-precaching';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

skipWaiting();
clientsClaim();

registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({
        cacheName: cacheNames.precache,
        networkTimeoutSeconds: 5,
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
);

registerRoute(
    /\.(png|jpe?g|webp)$/,
    new StaleWhileRevalidate({
        cacheName: 'image-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 3600,
            }),
        ],
    }),
);

declare let self: WorkerGlobalScope;
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest, {});

setCatchHandler(({ request }) => {
    if (typeof request !== 'string' && request.mode === 'navigate') {
        const key = getCacheKeyForURL('/index.html');
        if (key) {
            return caches.match(key) as Promise<Response>;
        }
    }

    return Promise.reject(Response.error());
});
