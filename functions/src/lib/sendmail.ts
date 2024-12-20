import { fetch } from '@adobe/fetch';

interface To {
    readonly Email: string;
    readonly MessageUUID: string;
    readonly MessageID: number;
    readonly MessageHref: string;
}

interface Message {
    readonly Status: string;
    readonly CustomID: string;
    readonly To: readonly To[];
    readonly Cc: readonly To[];
    readonly Bcc: readonly To[];
}

interface MailjetResponseData {
    readonly Messages: readonly Message[];
}

export function sendMail(
    from: string,
    replyTo: string,
    to: string,
    subject: string,
    body: string,
): Promise<MailjetResponseData> {
    const postBody = {
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
    };

    const auth = Buffer.from(`${process.env.MAILJET_APIKEY_PUBLIC}:${process.env.MAILJET_APIKEY_PRIVATE}`).toString(
        'base64',
    );

    return fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        body: JSON.stringify(postBody),
        headers: {
            'Content-Type': 'application/json; charset=utf=8',
            Authorization: `Basic ${auth}`,
        },
    }).then((r) => {
        if (!r.ok) {
            throw new Error(`HTTP Error ${r.status}`);
        }

        return r.json() as Promise<MailjetResponseData>;
    });
}
