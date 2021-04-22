import firebase from 'firebase/app';
import Bugsnag from '@bugsnag/js';
import store, { AppState } from '../store';
import { ResSignOutPayload, W_SIGNOUT, WorkerRequestSignOut, sendAndWait } from '../../utils/worker';

export function setUser(state: AppState, user: firebase.User | null): Partial<AppState> {
    if (user) {
        Bugsnag.setUser(user.uid, user.email ?? undefined);
    } else {
        Bugsnag.setUser();
    }

    return {
        user,
    };
}

export function logOutUser(state: AppState): Promise<Partial<AppState>> {
    const { worker } = state;
    if (!worker) {
        throw new Error('Unknown error');
    }

    const request: WorkerRequestSignOut = {
        type: 'signout',
        payload: undefined,
    };

    return new Promise<Partial<AppState>>((resolve, reject) => {
        sendAndWait<WorkerRequestSignOut, ResSignOutPayload>(worker, request, W_SIGNOUT)
            .then((r) => {
                if (r.success) {
                    store.setState({ user: null });
                    return resolve({ user: null });
                }

                return reject(new Error(r.message || r.code));
            })
            .catch(reject);
    });
}
