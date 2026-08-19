import path from 'node:path';
import { finished } from 'node:stream/promises';
import { getStorage } from 'firebase-admin/storage';
import { create as createArchive } from 'archiver';
import Bugsnag from '@bugsnag/js';
import type { ReportEntry } from '../types';

const bucket = getStorage().bucket();

export async function archiveFilesAndUpload(entry: ReportEntry): Promise<string> {
    if (entry.path) {
        const date = new Date().toISOString().split('T')[0];
        const fname = `${date}/${path.basename(entry.path)}.zip`;

        try {
            const folder = await bucket.getFiles({
                prefix: `incoming/${entry.path}`,
            });

            if (folder[0].length) {
                const file = bucket.file(fname);
                const fileStream = file.createWriteStream({
                    resumable: false,
                });

                const archive = createArchive('zip', {
                    zlib: { level: 4 },
                });

                archive.pipe(fileStream);

                folder[0].forEach((userFile) => {
                    const stream = userFile.createReadStream();
                    archive.append(stream, { name: path.basename(userFile.name) });
                });

                await archive.finalize();
                await finished(fileStream);

                const expires = new Date();
                expires.setDate(expires.getDate() + 7);

                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires,
                    version: 'v4',
                });

                return url;
            }
        } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            Bugsnag.notify(err);
            return '';
        } finally {
            try {
                await bucket.deleteFiles({
                    prefix: `incoming/${entry.path}`,
                    force: true,
                });
            } catch (e) {
                const err = e instanceof Error ? e : new Error(String(e));
                Bugsnag.notify(err);
            }
        }
    }

    return '';
}
