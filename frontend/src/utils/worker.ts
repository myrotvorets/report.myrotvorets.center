import type { User } from '@firebase/auth';

export const W_AUTH_STATE_CHANGED = 'auth_state_changed';
export const W_GETTOKEN = 'get_token';
export const W_SENDLINK = 'sendlink';
export const W_SIGNIN = 'signin';
export const W_SIGNOUT = 'signout';
export const W_UPLOAD_FILE = 'upload';
export const W_UPLOAD_PROGRESS = 'upload_progress';

export interface BaseWorkerRequest<Type, Payload> {
    type: Type;
    payload: Payload;
}

interface BaseWorkerResponse<Type, Payload> {
    type: Type;
    payload: Payload;
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

export type WorkerRequest =
    | WorkerRequestGetToken
    | WorkerRequestSignIn
    | WorkerRequestSignOut
    | WorkerRequestSendLink
    | WorkerRequestUpload;

export type WorkerResponseAuthStateChanged = BaseWorkerResponse<typeof W_AUTH_STATE_CHANGED, User | null>;
export type WorkerResponseGetToken = BaseWorkerResponse<typeof W_GETTOKEN, ResGetTokenPayload>;
export type WorkerResponseSignIn = BaseWorkerResponse<typeof W_SIGNIN, ResSignInPayload>;
export type WorkerResponseSignOut = BaseWorkerResponse<typeof W_SIGNOUT, ResSignOutPayload>;
export type WorkerResponseSendLink = BaseWorkerResponse<typeof W_SENDLINK, ResSendLinkPayload>;
export type WorkerResponseUpload = BaseWorkerResponse<typeof W_UPLOAD_FILE, ResUploadPayload>;
export type WorkerResponseUploadProgress = BaseWorkerResponse<typeof W_UPLOAD_PROGRESS, ResUploadProgressPayload>;

export type WorkerResponse =
    | WorkerResponseAuthStateChanged
    | WorkerResponseSignIn
    | WorkerResponseSignOut
    | WorkerResponseSendLink
    | WorkerResponseUpload
    | WorkerResponseUploadProgress;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function sendAndWait<Request = unknown, Payload = unknown>(
    worker: Worker | undefined,
    req: Request,
    what: string,
): Promise<Payload> {
    if (!worker) {
        return Promise.reject(new Error('Внутрішня помилка: робітник загинув смертю хоробрих.'));
    }

    return new Promise<Payload>((resolve) => {
        const listener = ({ data }: MessageEvent): void => {
            if ('type' in data && (data as BaseWorkerRequest<string, unknown>).type === what) {
                worker.removeEventListener('message', listener);
                const { payload } = data as BaseWorkerResponse<unknown, Payload>;
                resolve(payload);
            }
        };

        worker.addEventListener('message', listener);
        worker.postMessage(req);
    });
}
