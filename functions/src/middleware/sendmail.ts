import * as functions from 'firebase-functions';
import type { NextFunction, Request, Response } from 'express';
import { sendMail } from '../lib/sendmail';
import { buildMessage } from '../lib/message';
import { AddUpdateRequestBody } from '../types';

export function sendMailMiddleware(
    req: Request<Record<string, string>, unknown, AddUpdateRequestBody>,
    res: Response,
    next: NextFunction,
): void {
    const subject = 'В Чистилище';
    const message = buildMessage(req);

    if (req.body.note === '[skip]') {
        return next();
    }

    sendMail(
        functions.config().mail.from,
        req.user?.email || '',
        req.body.note === 'dev' ? functions.config().mail.devto : functions.config().mail.to,
        subject,
        message,
    )
        .then(() => next())
        .catch(() => {
            next({
                success: false,
                status: 500,
                code: 'SEND_FAILED',
                message: 'Failed to send the email',
            });
        });
}
