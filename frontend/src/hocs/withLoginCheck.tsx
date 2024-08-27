import { ComponentConstructor, ComponentType, h } from 'preact';
import { connect } from 'unistore/preact';
import { route } from 'preact-router';
import { AppState } from '../redux/store';
import Loader from '../components/Loader';

type UserState = 'unknown' | 'visitor' | 'user';

interface MappedProps {
    state: UserState;
}

function mapStateToProps(state: AppState): MappedProps {
    let s: UserState;
    if (state.user === undefined) {
        s = 'unknown';
    } else if (state.user === null) {
        s = 'visitor';
    } else {
        s = 'user';
    }

    return {
        state: s,
    };
}

export const withLoginCheck = <P extends object>(
    WrappedComponent: ComponentType<P>,
): ComponentConstructor<P, unknown> =>
    connect<P, unknown, AppState, MappedProps>(mapStateToProps)(
        ({ state, ...props }: P & MappedProps): h.JSX.Element | null => {
            switch (state) {
                case 'unknown':
                    return <Loader />;

                case 'user':
                    return <WrappedComponent {...(props as P)} />;

                default:
                    route('/login');
                    return null;
            }
        },
    );

export const withVisitorCheck = <P extends object>(
    WrappedComponent: ComponentType<P>,
): ComponentConstructor<P, unknown> =>
    connect<P, unknown, AppState, MappedProps>(mapStateToProps)(
        ({ state, ...props }: P & MappedProps): h.JSX.Element | null => {
            switch (state) {
                case 'unknown':
                    return <Loader />;

                case 'visitor':
                    return <WrappedComponent {...(props as P)} />;

                default:
                    route('/start');
                    return null;
            }
        },
    );
