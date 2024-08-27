import { ComponentConstructor, ComponentType, h } from 'preact';
import { connect } from 'unistore/preact';
import { AppState } from '../redux/store';

interface MappedProps {
    worker?: Worker;
}

const mapStateToProps = ({ worker }: AppState): MappedProps => ({ worker });

export const withWorker = <P extends object>(
    WrappedComponent: ComponentType<P>,
): ComponentConstructor<P & MappedProps, unknown> =>
    connect<P, unknown, AppState, MappedProps>(mapStateToProps)(
        ({ ...props }: P & MappedProps): h.JSX.Element => <WrappedComponent {...props} />,
    );
