import { Component, ComponentChild, h } from 'preact';
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

    public componentDidCatch(error: Error): void {
        Bugsnag.notify(error);
    }

    public render(): ComponentChild {
        const { error } = this.state;
        if (error) {
            return (
                <main>
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
                        <p>
                            Наша команда вже повідомлена про цей інцидент. Ми докладаємо всіх зусиль, щоб виправити цю
                            проблему.
                        </p>
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
