import { Component, ComponentChild, h } from 'preact';
import { Link, route } from 'preact-router';
import { withVisitorCheck } from '../../hocs/withLoginCheck';
import { withWorker } from '../../hocs/withWorker';
import { ResSignInPayload, W_SIGNIN, WorkerRequestSignIn, sendAndWait } from '../../utils/worker';
import Alert from '../Alert';

interface OwnProps {
    link: string;
    email: string;
}

interface MappedProps {
    worker?: Worker;
}

type Props = OwnProps & MappedProps;

interface State {
    email: string;
    error: string;
    busy: boolean;
    emailValid: boolean;
}

class CodeVerifier extends Component<Props, State> {
    public state: Readonly<State> = {
        email: this.props.email,
        error: '',
        busy: this.props.email.length > 0,
        emailValid: this.props.email.length > 0,
    };

    componentDidMount(): void {
        if (this.state.email) {
            this._signIn();
        }
    }

    private _onEmailUpdate = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({
            email: value,
            emailValid: currentTarget.checkValidity(),
        });
    };

    private _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this._signIn();
    };

    private _signIn(): void {
        const { link, worker } = this.props;
        const { email } = this.state;

        this.setState({ busy: true });

        const request: WorkerRequestSignIn = {
            type: 'signin',
            payload: { email, link },
        };

        sendAndWait<WorkerRequestSignIn, ResSignInPayload>(worker, request, W_SIGNIN)
            .then((r) => {
                if (r.success) {
                    window.localStorage.removeItem('email');
                    route('/start');
                } else {
                    this.setState({
                        busy: false,
                        error: r.message || r.code,
                    });
                }
            })
            .catch((e: Error) => this.setState({ busy: false, error: e.message }));
    }

    public render(): ComponentChild {
        const { busy, email, emailValid, error } = this.state;

        if (error) {
            return (
                <Alert>
                    <p>{error}</p>
                    <p>
                        <Link href="/">Повернутись</Link>
                    </p>
                </Alert>
            );
        }

        return (
            <form className="block block--centered" onSubmit={this._onFormSubmit}>
                <header className="block__header">Перевірка електронної адреси</header>

                <label htmlFor="email" className="required">
                    Електронна адреса:
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onInput={this._onEmailUpdate}
                    disabled={this.props.email.length > 0}
                />

                <div className="button-container">
                    <button type="submit" disabled={busy || !emailValid}>
                        {busy ? 'Перевірка…' : 'Перевірити'}
                    </button>
                </div>
            </form>
        );
    }
}

export default withWorker(withVisitorCheck(CodeVerifier));
