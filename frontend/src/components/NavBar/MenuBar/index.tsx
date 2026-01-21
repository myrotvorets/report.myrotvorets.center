import { Component, ComponentChild } from 'preact';

interface State {
    open: boolean;
}

export default class MenuBar extends Component<unknown, State> {
    public state: Readonly<State> = {
        open: false,
    };

    private readonly _onMenuOpenClicked = (): void => {
        this.setState(
            (prevState: Readonly<State>): Partial<State> => ({
                open: !prevState.open,
            }),
        );
    };

    private readonly _onMouseLeaveHandler = (): void => {
        this.setState({
            open: false,
        });
    };

    public render(): ComponentChild {
        const { open } = this.state;
        return (
            <nav className="nav" onMouseLeave={this._onMouseLeaveHandler}>
                <button
                    className="nav__btn"
                    onClick={this._onMenuOpenClicked}
                    aria-label="Перемикання навігації"
                    aria-expanded={open ? 'true' : 'false'}
                    aria-controls="navbar-content"
                >
                    <svg width="34" height="34">
                        <path d="M0 28.332h34v-3.777H0zm0-9.441h34v-3.782H0zM0 5.668v3.777h34V5.668" />
                    </svg>
                </button>
                <ul className={`nav__menu${open ? ' nav__menu--open' : ''}`} id="navbar-content">
                    {this.props.children}
                </ul>
            </nav>
        );
    }
}
