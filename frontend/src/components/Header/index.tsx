import { h } from 'preact';
import './header.scss';

export default function Header(): h.JSX.Element {
    return (
        <header className="site-header">
            <h1>
                <a href="/">«Миротворець»</a>
            </h1>
            <h2>
                Центр дослідження ознак злочинів проти національної безпеки України, миру, безпеки людства та
                міжнародного правопорядку
            </h2>
        </header>
    );
}
