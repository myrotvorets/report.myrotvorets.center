import * as functions from 'firebase-functions';
import mailjet from 'node-mailjet';
import type { RuntimeConfig } from '../types';

const config = functions.config() as RuntimeConfig;
const mj = mailjet.connect(config.mailjet.apikey.public, config.mailjet.apikey.private);

export function sendMail(
    from: string,
    replyTo: string,
    to: string,
    subject: string,
    body: string,
): Promise<mailjet.Email.PostResponse> {
    return mj.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: from,
                },
                ReplyTo: {
                    Email: replyTo,
                },
                To: [
                    {
                        Email: to,
                    },
                ],
                Subject: subject,
                TextPart: body,
            },
        ],
    });
}
