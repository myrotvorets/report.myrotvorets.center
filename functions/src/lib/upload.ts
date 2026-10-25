import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { getStorage } from 'firebase-admin/storage';
import { ZipArchive } from 'archiver';
import Bugsnag from '@bugsnag/js';
import type { ReportEntry } from '../types';
import { getSubmissionId } from './upload-path';

const bucket = getStorage().bucket();

export async function archiveFilesAndUpload(entry: ReportEntry): Promise<string> {
    if (!entry.path) {
        return '';
    }

    try {
        if (getSubmissionId(entry.path, entry.uploaderUid) === null) {
            throw new Error('Invalid upload ownership or submission path');
        }

        const date = new Date().toISOString().split('T')[0];
        const fname = `${date}/${randomUUID()}.zip`;
        const prefix = `incoming/${entry.path}/`;
        const [listedFiles] = await bucket.getFiles({ prefix });
        const files = listedFiles
            .filter((file) => {
                const name = file.name.slice(prefix.length);
                return file.name.startsWith(prefix) && name !== '' && !name.includes('/');
            })
            .map((file) => {
                if (!file.metadata.generation) {
                    throw new Error('Missing upload generation');
                }

                return bucket.file(file.name, { generation: file.metadata.generation });
            });

        if (!files.length) {
            return '';
        }

        const fileStream = bucket.file(fname).createWriteStream({
            public: true,
            resumable: false,
            preconditionOpts: { ifGenerationMatch: 0 },
        });
        const archive = new ZipArchive({ zlib: { level: 4 } });
        const sources: Readable[] = [];
        const uploaded = pipeline(archive, fileStream);

        try {
            files.forEach((file) => {
                const source = file.createReadStream();
                sources.push(source);
                source.once('error', (err: Error) => archive.destroy(err));
                archive.append(source, { name: path.basename(file.name) });
            });

            await Promise.all([archive.finalize(), uploaded]);
        } catch (e) {
            archive.abort();
            archive.destroy();
            fileStream.destroy();
            sources.forEach((source) => source.destroy());
            await uploaded.catch(() => undefined);
            throw e;
        }

        try {
            await Promise.all(files.map((file) => file.delete()));
        } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            Bugsnag.notify(err);
        }

        return `https://storage.googleapis.com/${bucket.name}/${fname}`;
    } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        Bugsnag.notify(err);
        return '';
    }
}
