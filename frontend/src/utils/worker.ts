import type { User } from '@firebase/auth';

export const W_AUTH_STATE_CHANGED = 'auth_state_changed';
export const W_GETTOKEN = 'get_token';
export const W_SENDLINK = 'sendlink';
export const W_SIGNIN = 'signin';
export const W_SIGNOUT = 'signout';
export const W_UPLOAD_FILE = 'upload';
export const W_UPLOAD_PROGRESS = 'upload_progress';
export const W_CANCEL_UPLOAD = 'cancel_upload';

export interface BaseWorkerRequest<Type, Payload> {
    type: Type;
    payload: Payload;
    requestId?: string;
}

interface BaseWorkerResponse<Type, Payload> {
    type: Type;
    payload: Payload;
    requestId?: string;
}

interface ReqSignInPayload {
    email: string;
    link: string;
}

interface ReqSendLinkPayload {
    email: string;
    url: string;
}

export type ResSignInPayload =
    | {
          success: true;
      }
    | {
          success: false;
          message: string;
          code: string;
      };

export type ResGetTokenPayload =
    | {
          success: true;
          token: string;
          uid: string;
      }
    | {
          success: false;
          message: string;
          code: string;
      };

export interface ReqUploadPayload {
    uid: string;
    name: string;
    file: Blob;
}

export type ResUploadPayload =
    | {
          success: true;
      }
    | {
          success: false;
          message: string;
          code: string;
      };

export interface ResUploadProgressPayload {
    progress: number;
}

export type ResSendLinkPayload = ResSignInPayload;
export type ResSignOutPayload = ResSignInPayload;

export type WorkerRequestGetToken = BaseWorkerRequest<typeof W_GETTOKEN, undefined>;
export type WorkerRequestSignIn = BaseWorkerRequest<typeof W_SIGNIN, ReqSignInPayload>;
export type WorkerRequestSignOut = BaseWorkerRequest<typeof W_SIGNOUT, undefined>;
export type WorkerRequestSendLink = BaseWorkerRequest<typeof W_SENDLINK, ReqSendLinkPayload>;
export type WorkerRequestUpload = BaseWorkerRequest<typeof W_UPLOAD_FILE, ReqUploadPayload>;

export type WorkerRequestCancelUpload = BaseWorkerRequest<typeof W_CANCEL_UPLOAD, undefined>;

export type WorkerRequest =
    | WorkerRequestGetToken
    | WorkerRequestSignIn
    | WorkerRequestSignOut
    | WorkerRequestSendLink
    | WorkerRequestUpload
    | WorkerRequestCancelUpload;

export type WorkerResponseAuthStateChanged = BaseWorkerResponse<typeof W_AUTH_STATE_CHANGED, User | null>;
export type WorkerResponseGetToken = BaseWorkerResponse<typeof W_GETTOKEN, ResGetTokenPayload>;
export type WorkerResponseSignIn = BaseWorkerResponse<typeof W_SIGNIN, ResSignInPayload>;
export type WorkerResponseSignOut = BaseWorkerResponse<typeof W_SIGNOUT, ResSignOutPayload>;
export type WorkerResponseSendLink = BaseWorkerResponse<typeof W_SENDLINK, ResSendLinkPayload>;
export type WorkerResponseUpload = BaseWorkerResponse<typeof W_UPLOAD_FILE, ResUploadPayload>;
export type WorkerResponseUploadProgress = BaseWorkerResponse<typeof W_UPLOAD_PROGRESS, ResUploadProgressPayload>;

export type WorkerResponse =
    | WorkerResponseAuthStateChanged
    | WorkerResponseGetToken
    | WorkerResponseSignIn
    | WorkerResponseSignOut
    | WorkerResponseSendLink
    | WorkerResponseUpload
    | WorkerResponseUploadProgress;

interface RequestOptions {
    timeoutMs?: number;
    onProgress?: (progress: number) => void;
}

let nextRequestId = 0;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function sendAndWait<Request extends BaseWorkerRequest<string, unknown>, Payload = unknown>(
    worker: Worker | undefined,
    req: Request,
    what: string,
    { timeoutMs = 60000, onProgress }: RequestOptions = {},
): Promise<Payload> {
    if (!worker) {
        return Promise.reject(new Error('Внутрішня помилка: робітник загинув смертю хоробрих.'));
    }

    const requestId = String(++nextRequestId);
    return new Promise<Payload>((resolve, reject) => {
        const controller = new AbortController();
        const cleanup = (): void => {
            // Callbacks run after the timer has been initialized.
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            clearTimeout(timer);
            controller.abort();
        };
        const onError = (): void => {
            cleanup();
            reject(new Error('Помилка зв’язку з робітником. Будь ласка, оновіть сторінку.'));
        };
        const listener = ({ data }: MessageEvent<unknown>): void => {
            if (!data || typeof data !== 'object' || !('requestId' in data) || data.requestId !== requestId) {
                return;
            }

            const response = data as BaseWorkerResponse<string, Payload>;
            if (response.type === what) {
                cleanup();
                resolve(response.payload);
            } else if (response.type === W_UPLOAD_PROGRESS && onProgress) {
                onProgress((data as WorkerResponseUploadProgress).payload.progress);
            }
        };
        const timer = setTimeout(() => {
            cleanup();
            reject(new Error('Час очікування відповіді минув. Будь ласка, повторіть спробу.'));
            if (req.type === W_UPLOAD_FILE) {
                try {
                    worker.postMessage({
                        type: W_CANCEL_UPLOAD,
                        requestId,
                        payload: undefined,
                    } satisfies WorkerRequestCancelUpload);
                } catch {
                    // The worker may already be unavailable; the request is rejected above.
                }
            }
        }, timeoutMs);

        worker.addEventListener('message', listener, { signal: controller.signal });
        worker.addEventListener('error', onError, { signal: controller.signal });
        worker.addEventListener('messageerror', onError, { signal: controller.signal });
        try {
            worker.postMessage({ ...req, requestId });
        } catch (error) {
            cleanup();
            reject(error instanceof Error ? error : new Error(String(error)));
        }
    });
}
