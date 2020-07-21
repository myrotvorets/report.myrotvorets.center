import { AppState } from '../store';

export function setWorker(state: AppState, worker: Worker): Partial<AppState> {
    return {
        worker,
    };
}
