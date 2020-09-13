import type { NextFunction, Request, Response } from 'express';
import Bugsnag from '@bugsnag/js';
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

export function fetchCriminal(req: Request, res: Response, next: NextFunction): void {
    if (req.params.id) {
        const id = req.params.id;
        fetch(`https://api.myrotvorets.center/simplesearch/v1/${id}`, {
            agent: httpsAgent,
        })
            .then((r) => r.json())
            .then((r: Criminal | ErrorResponse) => {
                if ('id' in r) {
                    req.criminal = r;
                    return next();
                }

                if (r.statusCode === 404) {
                    return next({
                        success: false,
                        status: 400,
                        code: 'RECORD_NOT_FOUND',
                        message: 'Unable to find the criminal record',
                    });
                }

                return next({
                    success: false,
                    status: 400,
                    code: 'COMM_ERROR',
                    message: 'Error communicating with the upstream server',
                });
            })
            .catch((e) => {
                Bugsnag.notify(e);
                return next({
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
