import { JSX } from 'preact';
import { Link } from 'preact-router/match';

export default function FourOhFour(): JSX.Element {
    return (
        <div id="error" className="alert">
            Ти вступаєш в річку,
            <br />
            Але річка не залишається колишньою.
            <br />
            Цієї web-сторінки тут вже немає 😞
            <br />
            <p>
                <Link href="/">Повернутися до головної сторінки</Link>
            </p>
        </div>
    );
}
