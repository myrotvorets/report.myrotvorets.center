import { fetch as origFetch } from 'fetch-h2';
import fetchBuilder from 'fetch-retry-ts';

export const fetch = fetchBuilder(origFetch, {
    retries: 3,
    retryDelay: 500,
    retryOn: [502, 503, 504],
});
