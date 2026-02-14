export interface Attachment {
    aid: number;
    url: string;
    type: string;
}

export interface Criminal {
    id: string;
    link: string;
    name: string;
    dob: string;
    country: string;
    address: string;
    attachments?: Attachment[];
}

interface ErrorResponse {
    statusCode: number;
    error: string;
    message: string;
}

const map = new Map<string, Criminal>();

function apiCall(url: string): Promise<Criminal | Error> {
    return fetch(url)
        .then((r: Response): Promise<Criminal | ErrorResponse> => r.json())
        .then((r: Criminal | ErrorResponse): Criminal | Error => {
            if ('id' in r) {
                map.set(r.id, r);
                return r;
            }

            if (r.statusCode === 404) {
                return new Error('NOT_FOUND');
            }

            if ('message' in r) {
                const e = new Error('API_ERROR');
                e.message = r.message;
                return e;
            }

            return new Error('UNKNOWN_ERROR');
        })
        .catch((e: unknown) => (e instanceof Error ? e : new Error('UNKNOWN_ERROR')));
}

export function findCriminalBySlug(slug: string): Promise<Criminal | Error> {
    return apiCall(`https://api.myrotvorets.app/myrotvorets/v1/byslug/${encodeURIComponent(slug)}`);
}

export function findCriminalById(id: string): Promise<Criminal | Error> {
    return apiCall(`https://api.myrotvorets.app/myrotvorets/v1/byid/${id}`);
}

export function isKnownCriminal(id: string): Criminal | false {
    return map.get(id) ?? false;
}
