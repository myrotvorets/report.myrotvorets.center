import Bugsnag from '@bugsnag/js';
import type { NextFunction, Request, Response } from 'express';
import { fetch } from '../lib/fetch';

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

export function fetchCriminal(req: Request, res: Response, next: NextFunction): void {
    if (req.params.id) {
        const ips = [...req.ips];
        if (!ips.length) {
            ips.push(req.ip);
        }

        const id = req.params.id;
        fetch(`https://api.myrotvorets.center/simplesearch/v1/${id}`, {
            headers: {
                'User-Agent': 'Report.Myrtovorets.Center Verification Bot',
                Accept: 'application/json',
                'X-Forwarded-For': ips.join(', '),
                'X-Forwarded-User-Agent': req.headers['user-agent'] || '',
            },
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
            .catch((e: Error) => {
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
