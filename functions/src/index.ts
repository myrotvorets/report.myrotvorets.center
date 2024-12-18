import './lib/init';
import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import Bugsnag from '@bugsnag/js';

import type { ReportEntry, RuntimeConfig } from './types';

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

export const api = functions.region('us-central1').https.onRequest(app);

export const handleReport = functions.database
    .ref('/reports/{child}')
    .onCreate(async (snapshot: functions.database.DataSnapshot): Promise<unknown> => {
        try {
            const entry = snapshot.val() as ReportEntry;
            const url = await archiveFilesAndUpload(entry);
            const message = buildMessageFromReportEntry(entry, url);

            if (entry.note !== '[skip]') {
                const config = functions.config() as RuntimeConfig;
                return await sendMail(
                    config.mail.from,
                    entry.email,
                    config.mail[entry.note === 'dev' ? 'devto' : 'to'],
                    'В Чистилище',
                    message,
                );
            }
        } catch (e) {
            Bugsnag.notify(e as Error);
        }

        return null;
    });
