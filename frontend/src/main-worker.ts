/// <reference lib="webworker" />

import { getApp, initializeApp } from '@firebase/app';
import {
    User,
    signOut as fbSignOut,
    indexedDBLocalPersistence,
    initializeAuth,
    onAuthStateChanged,
    sendSignInLinkToEmail,
    signInWithEmailLink,
} from '@firebase/auth';
import { UploadTask, getStorage, ref, uploadBytesResumable } from '@firebase/storage';
import firebaseConfig from './config/firebase';
import {
    W_AUTH_STATE_CHANGED,
    W_CANCEL_UPLOAD,
    W_GETTOKEN,
    W_SENDLINK,
    W_SIGNIN,
    W_SIGNOUT,
    W_UPLOAD_FILE,
    W_UPLOAD_PROGRESS,
    WorkerRequest,
    WorkerResponse,
    WorkerResponseGetToken,
    WorkerResponseSendLink,
    WorkerResponseSignIn,
    WorkerResponseSignOut,
} from './utils/worker';

interface FirebaseError extends Error {
    code: string;
}

const errorCodes: Record<string, string> = {
    'auth/expired-action-code': 'Термін дії коду підтвердження минув. Будь ласка, спробуйте ще раз.',
    'auth/invalid-action-code':
        'Код підтвердження недійсний. Це може статися, якщо код неправильно сформований, термін його дії закінчився, або він уже був використаний.',
    'auth/invalid-email': 'Неправильна електронна адреса.',
    'auth/user-disabled': 'Обліковий запис користувача вимкнено або заблоковано.',
    'auth/missing-continue-uri':
        // eslint-disable-next-line sonarjs/no-hardcoded-secrets
        'Внутрішня помилка (auth/missing-continue-uri). Будь ласка, повідомте про це support@myrotvorets.center',
    'auth/invalid-continue-uri':
        // eslint-disable-next-line sonarjs/no-hardcoded-secrets
        'Внутрішня помилка (auth/invalid-continue-uri). Будь ласка, повідомте про це support@myrotvorets.center',
    'auth/unauthorized-continue-uri':
        // eslint-disable-next-line sonarjs/no-hardcoded-secrets
        'Внутрішня помилка (auth/unauthorized-continue-uri). Будь ласка, повідомте про це support@myrotvorets.center',
};

initializeApp(firebaseConfig);
const auth = initializeAuth(getApp(), { persistence: indexedDBLocalPersistence });
auth.languageCode = 'uk';

/* const _unsub = */
onAuthStateChanged(auth, (user: User | null): void => {
    const payload = user === null ? null : user.toJSON();

    self.postMessage({ type: W_AUTH_STATE_CHANGED, payload });
});

function getToken(requestId: string): void {
    const { currentUser } = auth;
    if (currentUser) {
        currentUser
            .getIdToken()
            .then((token) =>
                self.postMessage({
                    type: W_GETTOKEN,
                    requestId,
                    payload: { success: true, token, uid: currentUser.uid },
                } satisfies WorkerResponseGetToken),
            )
            .catch((err: unknown) => {
                const e = err as FirebaseError;
                self.postMessage({
                    type: W_GETTOKEN,
                    requestId,
                    payload: {
                        success: false,
                        message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                        code: e.code,
                    },
                } satisfies WorkerResponseGetToken);
            });
    } else {
        self.postMessage({
            type: W_GETTOKEN,
            requestId,
            payload: { success: false, message: 'Будь ласка, увійдіть ще раз.', code: 'NOT_AUTHORIZED' },
        } satisfies WorkerResponseGetToken);
    }
}

function sendLink(email: string, url: string, requestId: string): void {
    sendSignInLinkToEmail(auth, email, { handleCodeInApp: true, url })
        .then(() =>
            self.postMessage({
                type: W_SENDLINK,
                requestId,
                payload: { success: true },
            } satisfies WorkerResponseSendLink),
        )
        .catch((err: unknown) => {
            const e = err as FirebaseError;
            self.postMessage({
                type: W_SENDLINK,
                requestId,
                payload: {
                    success: false,
                    message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                    code: e.code,
                },
            } satisfies WorkerResponseSendLink);
        });
}

function signIn(email: string, link: string, requestId: string): void {
    signInWithEmailLink(auth, email, link)
        .then(() =>
            self.postMessage({
                type: W_SIGNIN,
                requestId,
                payload: { success: true },
            } satisfies WorkerResponseSignIn),
        )
        .catch((err: unknown) => {
            const e = err as FirebaseError;
            self.postMessage({
                type: W_SIGNIN,
                requestId,
                payload: {
                    success: false,
                    message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                    code: e.code,
                },
            } satisfies WorkerResponseSignIn);
        });
}

function signOut(requestId: string): void {
    fbSignOut(auth)
        .then(() =>
            self.postMessage({
                type: W_SIGNOUT,
                requestId,
                payload: {
                    success: true,
                },
            } satisfies WorkerResponseSignOut),
        )
        .catch((err: unknown) => {
            const e = err as FirebaseError;
            self.postMessage({
                type: W_SIGNOUT,
                requestId,
                payload: {
                    success: false,
                    message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                    code: e.code,
                },
            } satisfies WorkerResponseSignOut);
        });
}

const uploads = new Map<string, UploadTask>();

function uploadFile(uid: string, name: string, file: Blob, requestId: string): void {
    const task: UploadTask = uploadBytesResumable(ref(getStorage(), `incoming/${uid}/${name}`), file);
    uploads.set(requestId, task);
    task.on(
        'state_changed',
        (snapshot): void => {
            const progress = snapshot.totalBytes
                ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 1000) / 10
                : -1;
            self.postMessage({
                type: W_UPLOAD_PROGRESS,
                requestId,
                payload: {
                    progress,
                },
            } satisfies WorkerResponse);
        },
        (e: Error): void => {
            uploads.delete(requestId);
            const err = e as Error & { code?: string };
            self.postMessage({
                type: W_UPLOAD_FILE,
                requestId,
                payload: {
                    success: false,
                    message: err.code && err.code in errorCodes ? errorCodes[err.code] : err.message,
                    code: err.code,
                },
            });
        },
        (): void => {
            uploads.delete(requestId);
            self.postMessage({
                type: W_UPLOAD_FILE,
                requestId,
                payload: {
                    success: true,
                },
            } satisfies WorkerResponse);
        },
    );
}

self.addEventListener('message', ({ data }: MessageEvent<unknown>): void => {
    if (
        data &&
        typeof data === 'object' &&
        'type' in data &&
        'requestId' in data &&
        typeof data.requestId === 'string'
    ) {
        const d = data as WorkerRequest;
        const requestId = data.requestId;
        switch (d.type) {
            case W_GETTOKEN:
                getToken(requestId);
                break;

            case W_SIGNIN:
                signIn(d.payload.email, d.payload.link, requestId);
                break;

            case W_SIGNOUT:
                signOut(requestId);
                break;

            case W_SENDLINK:
                sendLink(d.payload.email, d.payload.url, requestId);
                break;

            case W_UPLOAD_FILE:
                uploadFile(d.payload.uid, d.payload.name, d.payload.file, requestId);
                break;

            case W_CANCEL_UPLOAD:
                uploads.get(requestId)?.cancel();
                uploads.delete(requestId);
                break;

            default:
                break;
        }
    }
});
