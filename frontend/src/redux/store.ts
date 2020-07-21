import createStore from 'unistore';

export interface AppState {
    user: firebase.User | null | undefined;
    worker?: Worker;
}

const initialState: AppState = {
    user: undefined,
};

export default createStore(initialState);
