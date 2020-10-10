import {
    BaseWorkerRequest,
    ResUploadPayload,
    W_UPLOAD_FILE,
    W_UPLOAD_PROGRESS,
    WorkerRequestUpload,
    WorkerResponseUploadProgress,
    sendAndWait,
} from '../utils/worker';

const randomString = (): string => Math.random().toString(36).substring(2, 15);

function listener({ data }: MessageEvent): void {
    if ('type' in data && (data as BaseWorkerRequest<string, unknown>).type === W_UPLOAD_PROGRESS) {
        const { payload } = data as WorkerResponseUploadProgress;
        document.dispatchEvent(new CustomEvent('fileuploadprogress', { detail: payload.progress }));
    }
}

export async function uploadFiles(worker: Worker, userID: string, files: FileList): Promise<string> {
    const rnd = randomString();
    const uid = `${userID}/${rnd}`;

    try {
        worker.addEventListener('message', listener);

        const names: Record<string, boolean> = {};

        for (let i = 0; i < files.length; ++i) {
            document.dispatchEvent(new CustomEvent('overalluploadprogress', { detail: i + 1 }));

            const file = files[i];
            const name = file.name;
            let n = name;
            while (n in names) {
                n = `${randomString()}-${name}`;
            }

            names[n] = true;
            const req: WorkerRequestUpload = {
                type: W_UPLOAD_FILE,
                payload: {
                    name: n,
                    uid,
                    file,
                },
            };

            // eslint-disable-next-line no-await-in-loop
            const result = await sendAndWait<WorkerRequestUpload, ResUploadPayload>(worker, req, W_UPLOAD_FILE);
            if (!result.success) {
                throw new Error(result.message);
            }
        }
    } finally {
        worker.removeEventListener('message', listener);
    }

    return uid;
}
