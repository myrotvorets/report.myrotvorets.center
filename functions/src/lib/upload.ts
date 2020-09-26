import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';
import admin from 'firebase-admin';
import archiver from 'archiver';
import Bugsnag from '@bugsnag/js';
import type { ReportEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));

const randomBytes = promisify(crypto.randomBytes);

const randomString = (length = 15): Promise<string> =>
    randomBytes(2 * length).then((buf) =>
        buf
            .toString('base64')
            .replace(/\+|\/|=/gu, '')
            .slice(0, length),
    );

const errorHandler = (e: Error): never => {
    Bugsnag.notify(e);
    throw e;
};

const bucket = admin.storage().bucket();

export async function archiveFilesAndUpload(entry: ReportEntry): Promise<[string, string]> {
    const result: [string, string] = ['', ''];
    if (entry.path) {
        const date = new Date().toISOString().split('T')[0];
        const fname = `${date}/${path.basename(entry.path)}.zip`;

        try {
            const folder = await bucket.getFiles({
                directory: `incoming/${entry.path}`,
            });

            if (folder[0] && folder[0].length) {
                const fileStream = bucket.file(fname).createWriteStream({
                    public: true,
                    resumable: false,
                });

                fileStream.once('error', errorHandler);

                result[1] = await randomString();
                const archive = archiver.create('zip-encryptable', {
                    zlib: { level: 4 },
                    password: result[1],
                });

                archive.once('error', errorHandler);
                archive.pipe(fileStream);

                folder[0].forEach((userFile) => {
                    const stream = userFile.createReadStream();
                    stream.once('error', errorHandler);
                    archive.append(stream, { name: path.basename(userFile.name) });
                });

                await archive.finalize();
                result[0] = `https://storage.googleapis.com/${bucket.name}/${fname}`;
            }
        } catch (e) {
            Bugsnag.notify(e);
            return ['', ''];
        } finally {
            try {
                await bucket.deleteFiles({
                    directory: `incoming/${entry.path}`,
                    force: true,
                });
            } catch (e) {
                Bugsnag.notify(e);
            }
        }
    }

    return result;
}
