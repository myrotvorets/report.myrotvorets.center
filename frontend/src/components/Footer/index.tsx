import { h } from 'preact';

import './footer.scss';

export default function Footer(): h.JSX.Element {
    return (
        <footer className="site-footer">
            <p>
                &copy; {new Date().getFullYear()} <a href="https://myrotvorets.center/">Myrotvorets Research Center</a>
            </p>
            <p>
                <a href="mailto:support@myrotvorets.center">Щось не працює?</a>
            </p>
        </footer>
    );
}
