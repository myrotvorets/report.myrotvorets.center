import admin from 'firebase-admin';
import type { NextFunction, Request, Response } from 'express';
import type { AddUpdateRequestBody } from '../types';
import Bugsnag from '@bugsnag/js';
import { ReportEntry } from '../types';

const db = admin.database();

export async function saveToDatabase(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<Record<string, any>, unknown, AddUpdateRequestBody>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const ips = req.ips;
        if (!ips.length) {
            ips.push(req.ip);
        }

        const clink = req.criminal?.link ?? '';
        const cname = req.criminal?.name ?? '';

        const entry: ReportEntry = {
            ...req.body,
            dob: req.body.dob ? req.body.dob.toISOString().split('T')[0] : '',
            clink,
            cname,
            ips: ips.join(', '),
            email: req.user?.email ?? '',
            ua: req.headers['user-agent'] || '',
            dt: Date.now(),
        };

        const ref = db.ref('/reports');
        await ref.push(entry);
    } catch (e) {
        Bugsnag.notify(e);
        return next({
            success: false,
            status: 500,
            code: 'INTERNAL_ERROR',
            message: 'Unable to save the record',
        });
    }

    next();
}
