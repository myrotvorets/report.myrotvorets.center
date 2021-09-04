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
import Bugsnag from '@bugsnag/js';
import firebaseConfig from './config/firebase';
import {
    W_AUTH_STATE_CHANGED,
    W_GETTOKEN,
    W_SENDLINK,
    W_SIGNIN,
    W_SIGNOUT,
    W_UPLOAD_FILE,
    W_UPLOAD_PROGRESS,
    WorkerRequest,
    WorkerResponse,
    WorkerResponseAuthStateChanged,
    WorkerResponseGetToken,
    WorkerResponseSendLink,
    WorkerResponseSignIn,
    WorkerResponseSignOut,
} from './utils/worker';

Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY || '',
    appVersion: process.env.APP_VERSION,
    appType: 'worker',
    releaseStage: process.env.NODE_ENV || 'development',
});

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
        'Внутрішня помилка (auth/missing-continue-uri). Будь ласка, повідомте про це support@myrotvorets.center',
    'auth/invalid-continue-uri':
        'Внутрішня помилка (auth/invalid-continue-uri). Будь ласка, повідомте про це support@myrotvorets.center',
    'auth/unauthorized-continue-uri':
        'Внутрішня помилка (auth/unauthorized-continue-uri). Будь ласка, повідомте про це support@myrotvorets.center',
};

initializeApp(firebaseConfig);
const auth = initializeAuth(getApp(), { persistence: indexedDBLocalPersistence });
auth.languageCode = 'uk';

/* const _unsub = */
onAuthStateChanged(auth, (user: User | null): void => {
    const payload = user === null ? null : user.toJSON();

    self.postMessage({ type: W_AUTH_STATE_CHANGED, payload } as WorkerResponseAuthStateChanged);
});

function getToken(): void {
    const { currentUser } = auth;
    if (currentUser) {
        currentUser
            .getIdToken()
            .then((token) =>
                self.postMessage({
                    type: W_GETTOKEN,
                    payload: { success: true, token, uid: currentUser.uid },
                } as WorkerResponseGetToken),
            )
            .catch((e: FirebaseError) => {
                self.postMessage({
                    type: W_GETTOKEN,
                    payload: {
                        success: false,
                        message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                        code: e.code,
                    },
                } as WorkerResponseGetToken);
            });
    } else {
        self.postMessage({
            type: W_GETTOKEN,
            payload: { success: false, message: 'Будь ласка, увійдіть ще раз.', code: 'NOT_AUTHORIZED' },
        } as WorkerResponseGetToken);
    }
}

function sendLink(email: string, url: string): void {
    sendSignInLinkToEmail(auth, email, { handleCodeInApp: true, url })
        .then(() =>
            self.postMessage({
                type: W_SENDLINK,
                payload: { success: true },
            } as WorkerResponseSendLink),
        )
        .catch((e: FirebaseError) => {
            self.postMessage({
                type: W_SENDLINK,
                payload: {
                    success: false,
                    message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                    code: e.code,
                },
            } as WorkerResponseSendLink);
        });
}

function signIn(email: string, link: string): void {
    signInWithEmailLink(auth, email, link)
        .then(() =>
            self.postMessage({
                type: W_SIGNIN,
                payload: { success: true },
            } as WorkerResponseSignIn),
        )
        .catch((e: FirebaseError) => {
            self.postMessage({
                type: W_SIGNIN,
                payload: {
                    success: false,
                    message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                    code: e.code,
                },
            } as WorkerResponseSignIn);
        });
}

function signOut(): void {
    fbSignOut(auth)
        .then(() =>
            self.postMessage({
                type: W_SIGNOUT,
                payload: {
                    success: true,
                },
            } as WorkerResponseSignOut),
        )
        .catch((e: FirebaseError) => {
            self.postMessage({
                type: W_SIGNOUT,
                payload: {
                    success: false,
                    message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                    code: e.code,
                },
            } as WorkerResponseSignOut);
        });
}

function uploadFile(uid: string, name: string, file: Blob): void {
    const task: UploadTask = uploadBytesResumable(ref(getStorage(), `incoming/${uid}/${name}`), file);
    task.on(
        'state_changed',
        (snapshot): void => {
            const progress = snapshot.totalBytes
                ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) / 10
                : -1;
            self.postMessage({
                type: W_UPLOAD_PROGRESS,
                payload: {
                    progress,
                },
            } as WorkerResponse);
        },
        (e: Error): void => {
            const err = e as Error & { code?: string };
            self.postMessage({
                type: W_UPLOAD_FILE,
                payload: {
                    success: false,
                    message: err.code && err.code in errorCodes ? errorCodes[err.code] : err.message,
                    code: err.code,
                },
            } as WorkerResponse);
        },
        (): void => {
            self.postMessage({
                type: W_UPLOAD_FILE,
                payload: {
                    success: true,
                },
            } as WorkerResponse);
        },
    );
}

self.addEventListener('message', ({ data }: MessageEvent): void => {
    if ('type' in data) {
        const d = data as WorkerRequest;
        switch (d.type) {
            case W_GETTOKEN:
                getToken();
                break;

            case W_SIGNIN:
                signIn(d.payload.email, d.payload.link);
                break;

            case W_SIGNOUT:
                signOut();
                break;

            case W_SENDLINK:
                sendLink(d.payload.email, d.payload.url);
                break;

            case W_UPLOAD_FILE:
                uploadFile(d.payload.uid, d.payload.name, d.payload.file);
                break;

            default:
                break;
        }
    }
});
