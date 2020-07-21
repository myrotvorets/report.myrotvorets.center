import * as functions from 'firebase-functions';
import type { NextFunction, Request, Response } from 'express';
import { sendMail } from '../lib/sendmail';
import { buildMessage } from '../lib/message';

export function sendMailMiddleware(req: Request, res: Response, next: NextFunction): void {
    const subject = 'В Чистилище';
    const message = buildMessage(req);

    sendMail(functions.config().mail.from, req.user?.email || '', functions.config().mail.to, subject, message)
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
