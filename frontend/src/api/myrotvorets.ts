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

const map = new Map<number, Criminal>();

export function findCriminalBySlug(slug: string): Promise<Criminal | Error> {
    return new Promise((resolve: (r: Criminal | Error) => void) => {
        fetch(`https://api.myrotvorets.center/simplesearch/v1/byslug/${encodeURIComponent(slug)}`)
            .then((r: Response): Promise<Criminal | ErrorResponse> => r.json())
            .then((r: Criminal | ErrorResponse): void => {
                if ('id' in r) {
                    map.set(r.id, r);
                    resolve(r);
                } else if (r.statusCode === 404) {
                    resolve(new Error('NOT_FOUND'));
                } else if ('message' in r) {
                    const e = new Error('API_ERROR');
                    e.message = r.message;
                    resolve(e);
                } else {
                    resolve(new Error('UNKNOWN_ERROR'));
                }
            })
            .catch(resolve);
    });
}

export function findCriminalById(id: number): Promise<Criminal | Error> {
    return new Promise((resolve: (r: Criminal | Error) => void) => {
        fetch(`https://api.myrotvorets.center/simplesearch/v1/${id}`)
            .then((r: Response): Promise<Criminal | ErrorResponse> => r.json())
            .then((r: Criminal | ErrorResponse): void => {
                if ('id' in r) {
                    map.set(r.id, r);
                    resolve(r);
                } else if (r.statusCode === 404) {
                    resolve(new Error('NOT_FOUND'));
                } else if ('message' in r) {
                    const e = new Error('API_ERROR');
                    e.message = r.message;
                    resolve(e);
                } else {
                    resolve(new Error('UNKNOWN_ERROR'));
                }
            })
            .catch(resolve);
    });
}

export function isKnownCriminal(id: number): Criminal | false {
    return map.get(id) ?? false;
}
