export interface Attachment {
    aid: number;
    url: string;
    type: string;
}

export interface Criminal {
    id: number;
    link: string;
    name: string;
    nname: string;
    tname: string;
    dob: string;
    country: string;
    address: string;
    description: string;
    attachments?: Attachment[];
}

interface ErrorResponse {
    statusCode: number;
    error: string;
    message: string;
}

const map = new Map<number | string, Criminal>();

function apiCall(url: string): Promise<Criminal | Error> {
    return fetch(`${url}`)
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
        .catch((e: Error) => e);
}

export function findCriminalBySlug(slug: string): Promise<Criminal | Error> {
    return apiCall(`https://api.myrotvorets.center/simplesearch/v1/byslug/${encodeURIComponent(slug)}`);
}

export function findCriminalById(id: number | string): Promise<Criminal | Error> {
    return apiCall(`https://api.myrotvorets.center/simplesearch/v1/${id}`);
}

export function isKnownCriminal(id: number | string): Criminal | false {
    return map.get(id) || false;
}
