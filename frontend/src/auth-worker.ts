/// <reference lib="webworker" />

import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './config/firebase';
import {
    W_AUTH_STATE_CHANGED,
    W_GETTOKEN,
    W_SENDLINK,
    W_SIGNIN,
    W_SIGNOUT,
    WorkerRequest,
    WorkerResponseAuthStateChanged,
    WorkerResponseGetToken,
    WorkerResponseSendLink,
    WorkerResponseSignIn,
    WorkerResponseSignOut,
} from './utils/worker';

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

firebase.initializeApp(firebaseConfig);
firebase.auth().languageCode = 'uk';

/* const _unsub = */
firebase.auth().onAuthStateChanged((user: firebase.User | null): void => {
    const payload = user === null ? null : user.toJSON();

    self.postMessage({ type: W_AUTH_STATE_CHANGED, payload } as WorkerResponseAuthStateChanged);
});

function getToken(): void {
    const { currentUser } = firebase.auth();
    if (currentUser) {
        currentUser
            .getIdToken()
            .then((token): void => {
                self.postMessage({
                    type: W_GETTOKEN,
                    payload: { success: true, token },
                } as WorkerResponseGetToken);
            })
            .catch((e) => {
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
    firebase
        .auth()
        .sendSignInLinkToEmail(email, { handleCodeInApp: true, url })
        .then((): void => {
            self.postMessage({
                type: W_SENDLINK,
                payload: { success: true },
            } as WorkerResponseSendLink);
        })
        .catch((e) => {
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
    firebase
        .auth()
        .signInWithEmailLink(email, link)
        .then((): void => {
            self.postMessage({
                type: W_SIGNIN,
                payload: { success: true },
            } as WorkerResponseSignIn);
        })
        .catch((e) => {
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
    firebase
        .auth()
        .signOut()
        .then(() => {
            self.postMessage({
                type: W_SIGNOUT,
                payload: {
                    success: true,
                },
            } as WorkerResponseSignOut);
        })
        .catch((e) => {
            self.postMessage({
                type: 'signout',
                payload: {
                    success: false,
                    message: e.code in errorCodes ? errorCodes[e.code] : e.message,
                    code: e.code,
                },
            } as WorkerResponseSignOut);
        });
}

self.addEventListener('message', ({ data }: MessageEvent): void => {
    if ('type' in data) {
        const d = data as WorkerRequest;
        switch (d.type) {
            case W_GETTOKEN:
                return getToken();

            case W_SIGNIN:
                return signIn(d.payload.email, d.payload.link);

            case W_SIGNOUT:
                return signOut();

            case W_SENDLINK:
                return sendLink(d.payload.email, d.payload.url);
        }
    }
});
