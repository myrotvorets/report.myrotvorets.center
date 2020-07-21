import { RenderableProps, h } from 'preact';
import './modal.scss';

export default function Modal({ children }: RenderableProps<unknown>): h.JSX.Element {
    return (
        <div className="Modal">
            <div className="inner">{children}</div>
        </div>
    );
}
