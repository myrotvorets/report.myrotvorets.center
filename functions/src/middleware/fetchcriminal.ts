import Bugsnag from '@bugsnag/js';
import type { NextFunction, Request, Response } from 'express';
import { fetch } from '../lib/fetch';
import { httpsAgent } from '../lib/agents';

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

function createHeaders(req: Request): Record<string, string> {
    const headers = { ...req.headers };
    const ips = [...req.ips];
    if (!ips.length) {
        ips.push(req.ip);
    }

    for (const h in headers) {
        if (/^(access-control|content-|x-|authorization|cookie|proxy-|sec-|transfer-|www-)/gu.test(h)) {
            delete headers[h];
        }

        if (typeof headers[h] !== 'string') {
            delete headers[h];
        }
    }

    headers['x-forwarded-for'] = ips.join(', ');
    return headers as Record<string, string>;
}

export function fetchCriminal(req: Request, res: Response, next: NextFunction): void {
    if (req.params.id) {
        const id = req.params.id;
        fetch(`https://api.myrotvorets.center/simplesearch/v1/${id}`, {
            agent: httpsAgent,
            headers: createHeaders(req),
        })
            .then((r) => r.json())
            .then((r: Criminal | ErrorResponse) => {
                if ('id' in r) {
                    req.criminal = r;
                    return setImmediate(next);
                }

                if (r.statusCode === 404) {
                    return setImmediate<Record<string, unknown>[]>(next, {
                        success: false,
                        status: 400,
                        code: 'RECORD_NOT_FOUND',
                        message: 'Unable to find the criminal record',
                    });
                }

                Bugsnag.notify(new Error(`${r.error} ${r.message} ${r.statusCode}`));

                return setImmediate<Record<string, unknown>[]>(next, {
                    success: false,
                    status: 400,
                    code: 'COMM_ERROR',
                    message: 'Error communicating with the upstream server',
                });
            })
            .catch((e) => {
                Bugsnag.notify(e);
                return setImmediate<Record<string, unknown>[]>(next, {
                    success: false,
                    status: 400,
                    code: 'COMM_ERROR',
                    message: 'Error communicating with the upstream server',
                });
            });
    } else {
        next();
    }
}
