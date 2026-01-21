import { Component, type ComponentChild } from 'preact';
import { type ActionBinder, connect } from 'unistore/preact';
import { ActionMap } from 'unistore';
import { route } from 'preact-router';
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
    public componentDidMount(): void {
        if (this.props.loggedIn) {
            this.props.logOutUser().catch((error: unknown) => this.setState({ error: error as Error }));
        } else {
            route('/');
        }
    }

    public componentDidUpdate(): void {
        if (this.state.error) {
            throw this.state.error;
        }

        if (!this.props.loggedIn) {
            route('/');
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
