import { Component, ComponentChild, RefObject, createRef, h } from 'preact';

import './alert.scss';

interface Props {
    message?: string;
    className?: string;
}

export default class Alert extends Component<Props> {
    private readonly _ref: RefObject<HTMLDivElement> = createRef();

    public componentDidMount(): void {
        const { children, message } = this.props;
        if ((message || children) && this._ref.current) {
            this._ref.current.scrollIntoView(true);
        }
    }

    public componentDidUpdate(prevProps: Readonly<Props>): void {
        const { children, message } = this.props;
        const { message: prevMessage } = prevProps;
        if ((message || children) && !prevMessage && this._ref.current) {
            this._ref.current.scrollIntoView(true);
        }
    }

    public render(): ComponentChild {
        const { children, className, message } = this.props;
        if (!message && !children) {
            return undefined;
        }

        return (
            <div className={`alert ${className ?? ''}`} role="alert" ref={this._ref}>
                {message ?? children}
            </div>
        );
    }
}
