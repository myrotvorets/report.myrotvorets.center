import type { Request, Response } from 'express';
import Bugsnag from '@bugsnag/js';
import { fetch } from '../lib/fetch';
import { httpsAgent } from '../lib/agents';

export function checkEmail(req: Request, res: Response): Promise<void> {
    const email = req.params.email;

    return fetch(`https://disposable.debounce.io/?email=${encodeURIComponent(email)}`, {
        agent: httpsAgent,
        headers: {
            Accept: 'application/json',
        },
    })
        .then((r) => r.json())
        .then((json) => {
            res.json({
                success: true,
                status: 'disposable' in json ? (json.disposable === 'true' ? 'DEA' : 'OK') : 'DUNNO',
            });
        })
        .catch((e) => {
            Bugsnag.notify(e);
            res.json({
                success: true,
                status: 'DUNNO',
            });
        });
}
