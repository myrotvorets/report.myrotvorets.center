import './lib/init';
import { onRequest } from 'firebase-functions/v2/https';
import { onValueCreated } from 'firebase-functions/v2/database';
import express from 'express';
import cors from 'cors';
import Bugsnag from '@bugsnag/js';

import type { ReportEntry } from './types';

import { checkEmail } from './api/checkemail';
import { reportNewCriminal, reportUpdateCriminal } from './api/report';

import { archiveFilesAndUpload } from './lib/upload';
import { buildMessageFromReportEntry } from './lib/message';
import { sendMail } from './lib/sendmail';

import { notFoundHandler } from './middleware/notfound';
import { errorHandler } from './middleware/error';

const app = express();
const bsExpress = Bugsnag.getPlugin('express')!;
app.set('trust proxy', true);

app.use(bsExpress.requestHandler);
app.use(
    cors({
        origin: true,
        maxAge: 86400 * 7,
        methods: ['POST', 'OPTIONS'],
    }),
);

app.get('/informant/v1/checkemail/:email', checkEmail);
app.post('/informant/v1/report', ...reportNewCriminal);
app.post('/informant/v1/report/:id', ...reportUpdateCriminal);
app.use(notFoundHandler);
app.use(errorHandler);
app.use(bsExpress.errorHandler);

export const api = onRequest({ region: 'us-central1' }, app);

export const handleReport = onValueCreated('/reports/{child}', async (event): Promise<unknown> => {
    try {
        const entry = event.data.val() as ReportEntry;
        const url = await archiveFilesAndUpload(entry);
        const message = buildMessageFromReportEntry(entry, url);

        if (entry.note !== '[skip]') {
            return await sendMail(
                process.env.MAIL_FROM!,
                entry.email,
                process.env[entry.note === 'dev' ? 'MAIL_DEVTO' : 'MAIL_TO']!,
                'В Чистилище',
                message,
            );
        }
    } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        Bugsnag.notify(err);
    }

    return null;
});
