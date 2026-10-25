import { h } from 'preact';
import { useState } from 'preact/hooks';

import refresh from '../../assets/refresh.svg';
import './footer.scss';

export default function Footer(): h.JSX.Element {
    const [year] = useState(() => new Date().getFullYear());

    return (
        <footer className="site-footer">
            <p>
                &copy; {year} <a href="https://myrotvorets.center/">Myrotvorets Research Center</a>
            </p>
            <p>
                Версія:{' '}
                <span id="version">
                    {process.env.APP_VERSION} <img src={refresh as string} alt="" width={17} height={17} />
                </span>{' '}
                &nbsp;<a href="mailto:support@myrotvorets.center">Щось не працює?</a>
            </p>
        </footer>
    );
}
