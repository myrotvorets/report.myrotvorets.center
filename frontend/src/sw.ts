/// <reference lib="webworker"/>

import { NavigationRoute, registerRoute, setCatchHandler } from 'workbox-routing';
import { cleanupOutdatedCaches, createHandlerBoundToURL, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Let updates wait until existing tabs close, preserving their release and form state.
cleanupOutdatedCaches();

declare let self: ServiceWorkerGlobalScope;
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest, { ignoreURLParametersMatching: [/.*/u] });

registerRoute(
    new NavigationRoute(createHandlerBoundToURL('/index.html'), {
        denylist: [/^\/__\//u],
    }),
);

registerRoute(
    /\.(png|jpe?g|webp)$/u,
    new StaleWhileRevalidate({
        cacheName: 'image-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new ExpirationPlugin({
                maxAgeSeconds: 3600,
            }),
        ],
    }),
);

setCatchHandler(async (options) => {
    const { destination } = options.request;
    if (destination === 'document') {
        return (await matchPrecache('/index.html')) ?? Response.error();
    }

    return Response.error();
});
