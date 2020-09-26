import createStore from 'unistore';
import type firebase from 'firebase';

export interface AppState {
    user: firebase.User | null | undefined;
    worker?: Worker;
}

const initialState: AppState = {
    user: undefined,
};

export default createStore(initialState);
