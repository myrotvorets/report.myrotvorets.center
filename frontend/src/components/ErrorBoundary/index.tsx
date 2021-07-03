import { Component, ComponentChild, Fragment, h } from 'preact';
import '../Alert/alert.scss';
import Bugsnag from '@bugsnag/js';

interface Props {
    error?: Error;
}

interface State {
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: Readonly<State> = {
        error: this.props.error,
    };

    public static getDerivedStateFromProps(props: Readonly<Props>, prevState: Readonly<State>): Partial<State> | null {
        if (prevState.error) {
            return null;
        }

        return { error: props.error };
    }

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { error };
    }

    // eslint-disable-next-line class-methods-use-this
    public componentDidCatch(error: Error): void {
        console.error(error);
        Bugsnag.notify(error);
    }

    private _renderReason(): ComponentChild {
        const { error } = this.state;

        if (error instanceof TypeError && error.message.indexOf('_avast_submit') !== -1) {
            return (
                <Fragment>
                    <p>
                        Схоже, що ви використовуєте розширення браузера Avast. Воно втручається в роботу сайту та
                        заважає відправленню даних.
                    </p>
                    <p>Спробуйте відключити це розширення, потім оновіть сторінку та спробуйте ще раз.</p>
                </Fragment>
            );
        }

        return (
            <p>Наша команда вже повідомлена про цей інцидент. Ми докладаємо всіх зусиль, щоб виправити цю проблему.</p>
        );
    }

    public render(): ComponentChild {
        const { error } = this.state;
        if (error) {
            return (
                <main id="content">
                    <div className="alert">
                        <p>
                            Програма закривається.
                            <br />
                            Закрий все, над чим ти працював:
                            <br />
                            Ти запросив занадто багато.
                        </p>
                        <hr />
                        <p>
                            А насправді сталася несподівана помилка{' '}
                            <span role="img" aria-label="Плачучий настрій">
                                😭😭😭
                            </span>
                        </p>
                        {this._renderReason()}
                        <hr />
                        <details>
                            <summary>Технічні деталі</summary>
                            <strong>{error.name}</strong>
                            <p>{error.message}</p>
                        </details>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
