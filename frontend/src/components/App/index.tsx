import { Component, ComponentChild, Fragment, h } from 'preact';
import { ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import { AppState } from '../../redux/store';
import { setUser, setWorker } from '../../redux/actions';
import { W_AUTH_STATE_CHANGED, WorkerResponseAuthStateChanged } from '../../utils/worker';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/default
import AuthWorker from '../../auth-worker';

import Header from '../Header';
import NavBar from '../NavBar';
import ErrorBoundary from '../ErrorBoundary';
import AppRouter from '../AppRouter';
import Footer from '../Footer';

import './app.scss';

type OwnProps = unknown;
type MappedProps = unknown;

interface ActionProps extends ActionMap<AppState> {
    setUser: typeof setUser;
    setWorker: typeof setWorker;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

interface State {
    error?: Error;
}

class App extends Component<Props, State> {
    private _worker: Worker | undefined;

    public constructor(props: Props) {
        super(props);

        if (window.Worker) {
            try {
                const worker: Worker = new AuthWorker();
                worker.addEventListener('message', this._onWorkerMessage);
                worker.addEventListener('error', this._onWorkerError);
                this.props.setWorker(worker);
                this._worker = worker;
            } catch (e) {
                // Do nothing, we will handle the error in componentDidMount()
            }
        }
    }

    public componentDidMount(): void {
        if (!window.Worker) {
            throw new Error('Unsupported browser');
        }

        if (!this._worker) {
            throw new Error('Worker load failed');
        }
    }

    public componentWillUnmount(): void {
        if (this._worker) {
            this._worker.removeEventListener('message', this._onWorkerMessage);
            this._worker.removeEventListener('error', this._onWorkerError);
        }
    }

    private _onWorkerMessage = ({ data }: MessageEvent): void => {
        if ('type' in data && data.type === W_AUTH_STATE_CHANGED) {
            const { payload } = data as WorkerResponseAuthStateChanged;
            this.props.setUser(payload);
        }
    };

    private _onWorkerError = (e: ErrorEvent): void => {
        if (e.currentTarget instanceof Worker) {
            this.setState({ error: new Error('Something wrong with the worker') });
        }
    };

    public render(): ComponentChild {
        return (
            <Fragment>
                <Header />
                <NavBar />
                <ErrorBoundary error={this.state.error}>{this._worker && <AppRouter />}</ErrorBoundary>
                <Footer />
            </Fragment>
        );
    }
}

export default connect<OwnProps, unknown, AppState, MappedProps, ActionProps>(() => ({}), { setUser, setWorker })(App);
