import { Component, ComponentChild, Fragment, h } from 'preact';
import { route } from 'preact-router';
import { withLoginCheck } from '../../hocs/withLoginCheck';
import { Criminal, findCriminalBySlug } from '../../api/myrotvorets';
import Alert from '../Alert';
import CriminalRecord from '../CriminalRecord';

interface State {
    busy: boolean;
    url: string;
    urlValid: boolean;
    error: string;
    stage: number;
    criminal: Criminal | null;
}

class CheckCriminalForm extends Component<unknown, State> {
    public state: Readonly<State> = {
        busy: false,
        url: '',
        urlValid: false,
        error: '',
        stage: 0,
        criminal: null,
    };

    private _onFormSubmit = (e: h.JSX.TargetedEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity()) {
            const { stage } = this.state;
            switch (stage) {
                case 0:
                    return this._doStage0();

                case 1:
                    return this._doStage1();
            }
        } else {
            form.reportValidity();
        }
    };

    private _onUrlChanged = ({ currentTarget }: h.JSX.TargetedEvent<HTMLInputElement>): void => {
        this.setState({
            url: currentTarget.value,
            urlValid: currentTarget.checkValidity(),
        });
    };

    private _onBackButtonClicked = (): void => {
        const { stage } = this.state;
        if (stage === 0) {
            route('/start');
        } else {
            this.setState({ stage: stage - 1 });
        }
    };

    private _resetState(): void {
        this.setState({
            busy: false,
            criminal: null,
            stage: 0,
            url: '',
            urlValid: false,
        });
    }

    private _doStage0(): void {
        this.setState({ busy: true });

        const { url } = this.state;
        const matches = url.match(/^https?:\/\/[^/]+\/criminal\/([^/]+)/i);

        if (matches) {
            findCriminalBySlug(matches[1]).then((criminal: Criminal | Error) => {
                if (criminal instanceof Error && criminal.message === 'NOT_FOUND') {
                    this.setState({
                        busy: false,
                        criminal: null,
                        error: 'Запис не знайдено',
                    });
                } else if ('id' in criminal) {
                    this.setState({
                        busy: false,
                        criminal,
                        error: '',
                        stage: 1,
                    });
                } else {
                    this.setState({
                        busy: false,
                        criminal: null,
                        error: 'Виникла несподівана помилка. Будь ласка, спробуйте ще раз пізніше.',
                    });
                }
            });
        } else {
            // Should not happen, but if it does, someone is playing with the code
            this._resetState();
        }
    }

    private _doStage1(): void {
        const { criminal } = this.state;
        if (criminal) {
            route(`/criminal/update/${criminal.id}`);
        }
    }

    private _renderStage0(): ComponentChild {
        const { busy, url, urlValid } = this.state;

        return (
            <Fragment>
                <label htmlFor="existing-record" className="required">
                    Посилання на існуючий запис:
                </label>
                <input
                    type="url"
                    id="existing-record"
                    required
                    pattern="^https://myrotvorets\.center/criminal/.+"
                    placeholder="https://myrotvorets.center/criminal/..."
                    value={url}
                    onChange={this._onUrlChanged}
                />

                <p className="help">
                    Будь ласка, вставте URL-адресу існуючого запису. Посилання має виглядати так:{' '}
                    <code>https://myrotvorets.center/criminal/name/</code>
                </p>

                <p className="button-container">
                    <button type="submit" disabled={!urlValid || busy}>
                        {busy ? 'Перевірка…' : 'Продовжити'}
                    </button>

                    <button type="button" onClick={this._onBackButtonClicked}>
                        Повернутись
                    </button>
                </p>
            </Fragment>
        );
    }

    private _renderStage1(): ComponentChild {
        const criminal = this.state.criminal as Criminal;

        return (
            <Fragment>
                <p>Ви хочете оновити ось цей запис?</p>

                <CriminalRecord criminal={criminal} />

                <p className="button-container">
                    <button type="submit">Так, продовжити</button>

                    <button type="button" onClick={this._onBackButtonClicked}>
                        Ні, повернутись
                    </button>
                </p>
            </Fragment>
        );
    }

    public render(): ComponentChild {
        const { error, stage } = this.state;
        let content: ComponentChild;

        if (stage === 0) {
            content = this._renderStage0();
        } else if (stage === 1) {
            content = this._renderStage1();
        }

        return (
            <form className="checkform block block--centered" onSubmit={this._onFormSubmit}>
                <header className="block__header">Доповнити інформацію</header>

                <Alert message={error} />

                {content}
            </form>
        );
    }
}

export default withLoginCheck(CheckCriminalForm);
