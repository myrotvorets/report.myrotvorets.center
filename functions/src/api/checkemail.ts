import Bugsnag from '@bugsnag/js';
import type { Request, Response } from 'express';
import { fetch } from '../lib/fetch';

interface DebounceResponse {
    disposable?: string;
}

export function checkEmail(req: Request, res: Response): void {
    const email = req.params.email;

    fetch(`https://disposable.debounce.io/?email=${encodeURIComponent(email)}`, {
        headers: {
            Accept: 'application/json',
        },
    })
        .then((r) => r.json() as Promise<DebounceResponse>)
        .then((json: DebounceResponse) =>
            res.json({
                success: true,
                status: 'disposable' in json ? (json.disposable === 'true' ? 'DEA' : 'OK') : 'DUNNO',
            }),
        )
        .catch((e: unknown) => {
            Bugsnag.notify(e as Error);
            res.json({
                success: true,
                status: 'DUNNO',
            });
        });
}
