import { Component, ComponentChild, type ContextType } from 'preact';
import { LocationProvider } from 'preact-iso';
import { connect } from 'unistore/preact';
import { AppState } from '../../redux/store';

type OwnProps = unknown;

interface MappedProps {
    loggedIn: boolean;
}

type Props = OwnProps & MappedProps;

class Home extends Component<Props> {
    public static readonly contextType = LocationProvider.ctx;

    declare public context: ContextType<typeof LocationProvider.ctx>;

    private readonly _formSubmitHandler = (e: Event): void => {
        e.preventDefault();
        const { loggedIn } = this.props;

        if (loggedIn) {
            this.context.route('/start');
        } else {
            this.context.route('/login');
        }
    };

    public render(): ComponentChild {
        return (
            <form className="block block--centered" onSubmit={this._formSubmitHandler}>
                <header className="block__header">Повідомити про ймовірного злочинця</header>
                <p>
                    <a href="/about">Центр «Миротворець»</a> досліджує <a href="/about/crimes">ознаки злочинів</a> проти
                    національної безпеки України, миру, безпеки людства та міжнародного правопорядку{' '}
                    <a href="/about/grounds">відповідно до</a> чинного законодавства України та міжнародних
                    нормативно-правових актів, ратифікованих нашою державою.
                </p>
                <p>
                    Перед тим, як повідомити нам про обʼєкт, в діях якого містяться явні ознаки скоєння злочинів, що
                    досліджуються Центром, будь ласка, уважно прочитайте{' '}
                    <a href="https://myrotvorets.center/contacts/" target="_blank" rel="noopener noreferrer">
                        Про взаємодію та співпрацю з Центром «МИРОТВОРЕЦЬ»
                    </a>{' '}
                    та натиснить «Почати».
                </p>
                <div className="button-container">
                    <button type="submit">Почати</button>
                </div>
            </form>
        );
    }
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: !!state.user,
    };
}

export default connect<OwnProps, unknown, AppState, MappedProps>(mapStateToProps)(Home);
