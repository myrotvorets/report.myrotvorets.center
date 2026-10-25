import { ComponentConstructor, ComponentType, h } from 'preact';
import { connect } from 'unistore/preact';
import { useLocation } from 'preact-iso';
import { useEffect } from 'preact/hooks';
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
            const { route } = useLocation();
            useEffect(() => {
                if (state !== 'unknown' && state !== 'user') {
                    route('/login');
                }
            }, [state, route]);

            switch (state) {
                case 'unknown':
                    return <Loader />;

                case 'user':
                    return <WrappedComponent {...(props as P)} />;

                default:
                    return null;
            }
        },
    );

export const withVisitorCheck = <P extends object>(
    WrappedComponent: ComponentType<P>,
): ComponentConstructor<P, unknown> =>
    connect<P, unknown, AppState, MappedProps>(mapStateToProps)(
        ({ state, ...props }: P & MappedProps): h.JSX.Element | null => {
            const { route } = useLocation();
            useEffect(() => {
                if (state !== 'unknown' && state !== 'visitor') {
                    route('/start');
                }
            }, [state, route]);

            switch (state) {
                case 'unknown':
                    return <Loader />;

                case 'visitor':
                    return <WrappedComponent {...(props as P)} />;

                default:
                    return null;
            }
        },
    );
