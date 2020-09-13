import path from 'path';
import admin from 'firebase-admin';
import archiver from 'archiver';
import type { NextFunction, Request, Response } from 'express';
import type { AddUpdateRequestBody } from '../types';
import Bugsnag from '@bugsnag/js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));

const randomString = (): string => Math.random().toString(36).substring(2, 15);
const errorHandler = (e: Error) => {
    Bugsnag.notify(e);
    throw e;
};

const bucket = admin.storage().bucket();

export async function archiveFiles(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<Record<string, any>, unknown, AddUpdateRequestBody>,
    res: Response,
    next: NextFunction,
): Promise<void> {
    if (req.body.path) {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const fname = `${date}/${path.basename(req.body.path)}.zip`;

        try {
            const folder = await bucket.getFiles({
                directory: `incoming/${req.body.path}`,
            });

            if (folder[0] && folder[0].length) {
                const fileStream = bucket.file(fname).createWriteStream({
                    public: true,
                    resumable: false,
                });

                fileStream.once('error', errorHandler);

                req.archivePassword = randomString();
                const archive = archiver.create('zip-encryptable', {
                    zlib: { level: 4 },
                    password: req.archivePassword,
                });

                archive.once('error', errorHandler);
                archive.pipe(fileStream);

                folder[0].forEach((userFile) => {
                    const stream = userFile.createReadStream();
                    stream.once('error', errorHandler);
                    archive.append(stream, { name: path.basename(userFile.name) });
                });

                await archive.finalize();
                req.storageLink = `https://storage.googleapis.com/${bucket.name}/${fname}`;
            }
        } catch (e) {
            Bugsnag.notify(e);
        } finally {
            try {
                await bucket.deleteFiles({
                    directory: `incoming/${req.body.path}`,
                    force: true,
                });
            } catch (e) {
                Bugsnag.notify(e);
            }
        }
    }

    return next();
}
