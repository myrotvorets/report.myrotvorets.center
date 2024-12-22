import { Component, ComponentChild, RefObject, createRef, h } from 'preact';
import Alert from '../Alert';
import { withVisitorCheck } from '../../hocs/withLoginCheck';
import { withWorker } from '../../hocs/withWorker';
import { ResSendLinkPayload, W_SENDLINK, WorkerRequestSendLink, sendAndWait } from '../../utils/worker';

interface State {
    email: string;
    error: string;
    state: 'initial' | 'sending' | 'link_sent' | 'troubles';
    emailValid: boolean | undefined;
}

interface MappedProps {
    worker?: Worker;
}

class LoginForm extends Component<MappedProps, State> {
    public state: Readonly<State> = {
        email: '',
        error: '',
        state: 'initial',
        emailValid: undefined,
    };

    private readonly _ref: RefObject<HTMLInputElement> = createRef();

    public componentDidMount(): void {
        this._ref.current?.focus();
    }

    private readonly _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const { state, email, emailValid } = this.state;

        if (state !== 'sending' && emailValid) {
            this._sendConfirmationLink(email);
        }
    };

    private readonly _emailUpdateHandler = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({
            email: value,
            emailValid: currentTarget.checkValidity(),
        });
    };

    private readonly _backButtonClickHandler = (): void => {
        this.setState({ state: 'initial', email: '', emailValid: false });
    };

    private readonly _issuesButtonClickHandler = (): void => {
        this.setState({ state: 'troubles' });
    };

    private readonly _retryClickHandler = (): void => {
        const { email } = this.state;
        this._sendConfirmationLink(email);
    };

    private _sendConfirmationLink(email: string): void {
        const { worker } = this.props;
        this.setState({ state: 'sending' });

        const request: WorkerRequestSendLink = {
            type: W_SENDLINK,
            payload: { email, url: `${window.location.origin}/` },
        };

        sendAndWait<WorkerRequestSendLink, ResSendLinkPayload>(worker, request, W_SENDLINK)
            .then((r) => {
                let state: Partial<State>;
                if (r.success) {
                    window.localStorage.setItem('email', email);
                    state = { state: 'link_sent' };
                } else {
                    state = { error: r.message || r.code, state: 'initial' };
                }

                this.setState(state);
            })
            .catch((e: unknown) => this.setState({ error: (e as Error).message, state: 'initial' }));
    }

    private _renderLoginForm(): ComponentChild {
        const { email, emailValid, error, state } = this.state;
        return (
            <form className="block" onSubmit={this._onFormSubmit}>
                <header className="block__header">Увійти</header>
                <Alert message={error} />

                <label htmlFor="email" className="required">
                    Електронна адреса<span className="sr-only"> (обовʼязкове поле)</span>:
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChangeCapture={this._emailUpdateHandler}
                    aria-invalid={emailValid !== undefined ? `${!emailValid}` : undefined}
                    aria-describedby={emailValid !== false ? undefined : 'email-error'}
                    ref={this._ref}
                />
                {emailValid === false && <div id="email-error">Невірна адреса електронної пошти.</div>}

                <div className="button-container">
                    <button type="submit" aria-disabled={state === 'sending' || !emailValid ? 'true' : 'false'}>
                        {state !== 'sending' ? 'Далі…' : 'Відправлення посилання…'}
                    </button>
                </div>
            </form>
        );
    }

    private _renderReceivingIssues(): ComponentChild {
        return (
            <div className="block block--centered">
                <header className="block__header">Проблеми з отриманням електронних листів?</header>
                <p>Будь ласка, скористайтеся порадами нижче, щоб вирішити проблему:</p>
                <ul>
                    <li>Перевірте, можливо, електронний лист позначено як спам або відфільтровано.</li>
                    <li>Перевірте інтернет-з’єднання.</li>
                    <li>Переконайтеся, що ви правильно вказали електронну адресу.</li>
                    <li>
                        Перевірте доступний обсяг пам’яті для папки «Вхідні» та інші можливі проблеми з налаштуваннями.
                    </li>
                </ul>
                <p>
                    Якщо наведені вище поради не допомагають, спробуйте знову надіслати електронний лист{' '}
                    <strong>
                        (у такому разі посилання в попередньому листі стане <em>неактивним</em>)
                    </strong>
                    .
                </p>
                <div className="button-container">
                    <button type="button" onClick={this._backButtonClickHandler}>
                        Повернутись назад
                    </button>
                    <button type="button" onClick={this._retryClickHandler}>
                        Надіслати ще раз
                    </button>
                </div>
            </div>
        );
    }

    private _renderLinkSentDialog(): ComponentChild {
        const { email } = this.state;
        return (
            <div className="block block--centered">
                <header className="block__header">Лист надіслано</header>
                <p>
                    Лист із посиланням та додаткові вказівки надіслано на адресу <strong>{email}</strong>.
                </p>
                <p>Будь ласка, дотримуйтеся цих вказівок, щоб увійти в обліковий запис.</p>

                <button type="button" onClick={this._issuesButtonClickHandler} className="link">
                    Проблеми з отриманням електронних листів?
                </button>

                <div className="button-container">
                    <button type="button" onClick={this._backButtonClickHandler}>
                        Повернутись назад
                    </button>
                </div>
            </div>
        );
    }

    public render(): ComponentChild {
        const { state } = this.state;

        switch (state) {
            case 'initial':
            case 'sending':
                return this._renderLoginForm();

            case 'troubles':
                return this._renderReceivingIssues();

            case 'link_sent':
                return this._renderLinkSentDialog();

            default:
                return null;
        }
    }
}

export default withWorker(withVisitorCheck(LoginForm));
