import { Component, ComponentChild, h } from 'preact';
import Alert from '../Alert';
import { withVisitorCheck } from '../../hocs/withLoginCheck';
import { withWorker } from '../../hocs/withWorker';
import { ResSendLinkPayload, W_SENDLINK, WorkerRequestSendLink, sendAndWait } from '../../utils/worker';

interface State {
    email: string;
    error: string;
    state: 'initial' | 'sending' | 'link_sent' | 'troubles';
    emailValid: boolean;
}

interface MappedProps {
    worker?: Worker;
}

class LoginForm extends Component<MappedProps, State> {
    public state: Readonly<State> = {
        email: '',
        error: '',
        state: 'initial',
        emailValid: false,
    };

    private _emailUpdateHandler = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({
            email: value,
            emailValid: currentTarget.checkValidity(),
        });
    };

    private _backButtonClickHandler = (): void => {
        this.setState({ state: 'initial', email: '', emailValid: false });
    };

    private _issuesButtonClickHandler = (): void => {
        this.setState({ state: 'troubles' });
    };

    private _retryClickHandler = (): void => {
        const { email } = this.state;
        this._sendConfirmationLink(email);
    };

    private _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
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
                if (r.success) {
                    window.localStorage.setItem('email', email);
                    this.setState({ state: 'link_sent' });
                } else {
                    this.setState({ error: r.message || r.code, state: 'initial' });
                }
            })
            .catch((e: Error) => this.setState({ error: e.message, state: 'initial' }));
    }

    private _renderLoginForm(): ComponentChild {
        const { email, emailValid, error, state } = this.state;
        return (
            <form className="block" onSubmit={this._onFormSubmit}>
                <header className="block__header">Увійти</header>
                <Alert message={error} />

                <label htmlFor="email" className="required">
                    Електронна адреса:
                </label>
                <input type="email" id="email" required value={email} onChange={this._emailUpdateHandler} />

                <div className="button-container">
                    <button type="submit" disabled={state === 'sending' || !emailValid}>
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
                        Перевірте доступний обсяг пам’яті для папки "Вхідні" та інші можливі проблеми з налаштуваннями.
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
        }
    }
}

export default withWorker(withVisitorCheck(LoginForm));
