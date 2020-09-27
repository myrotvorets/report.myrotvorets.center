import { Component, ComponentChild, h } from 'preact';

interface Props {
    title: string;
}

interface State {
    open: boolean;
}

export default class Submenu extends Component<Props, State> {
    public state: Readonly<State> = {
        open: false,
    };

    private readonly _onMouseEnterHandler = (e: h.JSX.TargetedMouseEvent<HTMLLIElement>): void => {
        const li = e.currentTarget;
        const ul = li.parentElement;
        if (
            ul &&
            (self.getComputedStyle(ul).position === 'absolute' ||
                (ul.classList.contains('nav__menu') && !ul.classList.contains('nav__menu--open')))
        ) {
            this.setState({
                open: true,
            });
        }
    };

    private readonly _onMouseLeaveHandler = (e: h.JSX.TargetedMouseEvent<HTMLLIElement>): void => {
        const li = e.currentTarget;
        const ul = li.parentElement;
        if (
            ul &&
            (self.getComputedStyle(ul).position === 'absolute' ||
                (ul.classList.contains('nav__menu') && !ul.classList.contains('nav__menu--open')))
        ) {
            this.setState({
                open: false,
            });
        }
    };

    private readonly _onClickCaptureHandler = (e: h.JSX.TargetedMouseEvent<HTMLElement>): void => {
        if (e.target && (e.target as HTMLElement).closest('li') === e.currentTarget) {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.setState(
                (prevState): Partial<State> => ({
                    open: !prevState.open,
                }),
            );
        } else if (e.target && (e.target as HTMLElement).getAttribute('href') !== '#') {
            this.setState({ open: false });
        }
    };

    public render(): ComponentChild {
        const { children, title } = this.props;
        const { open } = this.state;
        return (
            <li
                className={`nav__menuitem nav__menuitem--has-children${open ? ' nav__menuitem--open' : ''}`}
                onMouseEnter={this._onMouseEnterHandler}
                onMouseLeave={this._onMouseLeaveHandler}
                onClickCapture={this._onClickCaptureHandler}
            >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" role="button" aria-haspopup="true" aria-expanded={open ? 'true' : 'false'}>
                    {title}
                </a>
                <ul className="nav__submenu">{children}</ul>
            </li>
        );
    }
}
