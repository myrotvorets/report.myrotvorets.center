import { Component, type ComponentChild, type ContextType } from 'preact';
import { type ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import { LocationProvider } from 'preact-iso';
import { logOutUser } from '../../redux/actions';
import { type AppState } from '../../redux/store';
import Loader from '../../components/Loader';

type OwnProps = unknown;
interface MappedProps {
    loggedIn: boolean;
}

interface ActionProps extends ActionMap<AppState> {
    logOutUser: typeof logOutUser;
}

type Props = OwnProps & MappedProps & ActionBinder<AppState, ActionProps>;

interface State {
    error?: Error;
}

class LogoutRoute extends Component<Props, State> {
    public static readonly contextType = LocationProvider.ctx;

    declare public context: ContextType<typeof LocationProvider.ctx>;

    public componentDidMount(): void {
        if (this.props.loggedIn) {
            this.props.logOutUser().catch((error: unknown) => this.setState({ error: error as Error }));
        } else {
            this.context.route('/');
        }
    }

    public componentDidUpdate(): void {
        if (this.state.error) {
            throw this.state.error;
        }

        if (!this.props.loggedIn) {
            this.context.route('/');
        }
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    public render(): ComponentChild {
        return <Loader />;
    }
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: !!state.user,
    };
}

export default connect<OwnProps, unknown, AppState, MappedProps, ActionProps>(mapStateToProps, { logOutUser })(
    LogoutRoute,
);
