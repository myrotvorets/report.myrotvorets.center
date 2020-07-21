import * as functions from 'firebase-functions';
import mailjet from 'node-mailjet';

const mj = mailjet.connect(functions.config().mailjet.apikey.public, functions.config().mailjet.apikey.private);

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
