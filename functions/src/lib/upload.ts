import path from 'path';
import admin from 'firebase-admin';
import { create as createArchive } from 'archiver';
import Bugsnag from '@bugsnag/js';
import type { ReportEntry } from '../types';

const errorHandler = (e: Error): never => {
    Bugsnag.notify(e);
    throw e;
};

const bucket = admin.storage().bucket();

export async function archiveFilesAndUpload(entry: ReportEntry): Promise<string> {
    if (entry.path) {
        const date = new Date().toISOString().split('T')[0];
        const fname = `${date}/${path.basename(entry.path)}.zip`;

        try {
            const folder = await bucket.getFiles({
                prefix: `incoming/${entry.path}`,
            });

            if (folder[0].length) {
                const fileStream = bucket.file(fname).createWriteStream({
                    public: true,
                    resumable: false,
                });

                fileStream.once('error', errorHandler);

                const archive = createArchive('zip', {
                    zlib: { level: 4 },
                });

                archive.once('error', errorHandler);
                archive.pipe(fileStream);

                folder[0].forEach((userFile) => {
                    const stream = userFile.createReadStream();
                    stream.once('error', errorHandler);
                    archive.append(stream, { name: path.basename(userFile.name) });
                });

                await archive.finalize();
                return `https://storage.googleapis.com/${bucket.name}/${fname}`;
            }
        } catch (e) {
            Bugsnag.notify(e as Error);
            return '';
        } finally {
            try {
                await bucket.deleteFiles({
                    prefix: `incoming/${entry.path}`,
                    force: true,
                });
            } catch (e) {
                Bugsnag.notify(e as Error);
            }
        }
    }

    return '';
}
