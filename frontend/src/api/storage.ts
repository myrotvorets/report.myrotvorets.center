import { ResUploadPayload, W_UPLOAD_FILE, WorkerRequestUpload, sendAndWait } from '../utils/worker';

// eslint-disable-next-line sonarjs/pseudo-random
const randomString = (): string => Math.random().toString(36).substring(2, 15);

export async function uploadFiles(
    worker: Worker,
    userID: string,
    files: FileList,
    onProgress: (progress: number) => void,
    onFile: (fileNumber: number) => void,
): Promise<string> {
    const rnd = randomString();
    const uid = `${userID}/${rnd}`;

    const names = new Set<string>();

    for (let i = 0; i < files.length; ++i) {
        onFile(i + 1);

        const file = files[i];
        const name = file.name;

        let n = name.replace(/\.{2,}/gu, '.');
        while (names.has(n)) {
            n = `${randomString()}-${name}`;
        }

        names.add(n);
        const req: WorkerRequestUpload = {
            type: W_UPLOAD_FILE,
            payload: {
                name: n,
                uid,
                file,
            },
        };

        // eslint-disable-next-line no-await-in-loop
        const result = await sendAndWait<WorkerRequestUpload, ResUploadPayload>(worker, req, W_UPLOAD_FILE, {
            timeoutMs: 15 * 60 * 1000,
            onProgress,
        });
        if (!result.success) {
            throw new Error(result.message);
        }
    }

    return uid;
}
