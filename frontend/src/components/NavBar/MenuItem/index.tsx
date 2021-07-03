import { RenderableProps, h } from 'preact';

export default function MenuItem({ children }: RenderableProps<unknown>): h.JSX.Element {
    return (
        <li className="nav__menuitem" role="menuitem">
            {children}
        </li>
    );
}
