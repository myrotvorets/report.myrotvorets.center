import { h } from 'preact';
import { Link } from 'preact-router';

export default function FourOhFour(): h.JSX.Element {
    return (
        <div id="error" class="alert">
            Ти вступаєш в річку,
            <br />
            Але річка не залишається колишньою.
            <br />
            Цієї web-сторінки тут вже немає 😞
            <br />
            <p>
                <Link href="/">Повернутися до головної сторинки</Link>
            </p>
        </div>
    );
}
