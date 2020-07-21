import admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';
import type { NextFunction, Request, Response } from 'express';
import { fetch } from '../lib/fetch';
import { httpsAgent } from '../lib/agents';
import { AddUpdateRequestBody } from '../types';

async function getUpload(serverID: string, accessCode: string): Promise<boolean> {
    try {
        const response = await fetch(`https://${serverID}.gofile.io/getUpload?c=${accessCode}`, {
            agent: httpsAgent,
        });

        const json = await response.json();
        return json.status === 'ok';
    } catch (e) {
        return false;
    }
}

async function downloadZip(serverID: string, accessCode: string): Promise<NodeJS.ReadableStream> {
    const response = await fetch(`https://${serverID}.gofile.io/download/${accessCode}/files-${accessCode}.zip`, {
        agent: httpsAgent,
    });

    return response.body;
}

async function uploadToBucket(bucket: Bucket, name: string, stream: NodeJS.ReadableStream): Promise<string> {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const fname = `${date}/${name}`;
    const file = bucket.file(fname);
    return new Promise<string>((resolve, reject) => {
        stream
            .pipe(
                file.createWriteStream({
                    public: true,
                    resumable: false,
                }),
            )
            .on('error', reject)
            .on('finish', () => resolve(fname));
    });
}

export async function copyFromGoFileToGoogleStorage(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<Record<string, any>, unknown, AddUpdateRequestBody>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        if (req.body.gfsrv && req.body.gfac) {
            if (await getUpload(req.body.gfsrv, req.body.gfac)) {
                const bucket = admin.storage().bucket();
                const stream = await downloadZip(req.body.gfsrv, req.body.gfac);
                const fname = await uploadToBucket(bucket, `${req.body.gfac}.zip`, stream);
                const bucketName = bucket.name;
                req.storageLink = `https://storage.googleapis.com/${bucketName}/${fname}`;
            }
        }
    } catch (e) {
        console.error(e);
    }

    return next();
}
