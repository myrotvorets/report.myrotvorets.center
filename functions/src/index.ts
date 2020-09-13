import './lib/init';
import * as functions from 'firebase-functions';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import Bugsnag from '@bugsnag/js';
import authMiddleware from './middleware/auth';
import { fetch } from './lib/fetch';
import { httpsAgent } from './lib/agents';
import { commonValidationHandler, reportAddValidator, reportUpdateValidator } from './middleware/validator';
import { fetchCriminal } from './middleware/fetchcriminal';
import { archiveFiles } from './middleware/uploadtostorage';
import { sendMailMiddleware } from './middleware/sendmail';

const app = express();
app.set('trust proxy', true);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
app.use(Bugsnag.getPlugin('express')!.requestHandler);
app.use(
    cors({
        origin: true,
        maxAge: 86400 * 7,
        methods: ['POST', 'OPTIONS'],
    }),
);

app.get(
    '/informant/v1/checkemail/:email',
    (req: Request, res: Response): Promise<void> => {
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
    },
);

app.post(
    '/informant/v1/report',
    authMiddleware(),
    reportAddValidator,
    commonValidationHandler,
    archiveFiles,
    sendMailMiddleware,
    (req: Request, res: Response) => res.json({ success: true }),
);

app.post(
    '/informant/v1/report/:id',
    authMiddleware(),
    reportUpdateValidator,
    commonValidationHandler,
    fetchCriminal,
    archiveFiles,
    sendMailMiddleware,
    (req: Request, res: Response) => res.json({ success: true }),
);

app.use((req: Request, res: Response, next: NextFunction): void => {
    next({
        success: false,
        status: 404,
        code: 'NOT_FOUND',
        message: 'Not found',
    });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        return next(err);
    }

    if (err && typeof err === 'object' && 'code' in err) {
        const status = err.status as number;
        res.status(status);
        if (status === 401) {
            res.header('WWW-Authenticate', 'Bearer');
        }

        res.json(err);
        return;
    }

    next(err);
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
app.use(Bugsnag.getPlugin('express')!.errorHandler);

export const api = functions.region('us-central1').https.onRequest(app);
