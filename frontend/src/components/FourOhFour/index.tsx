import { JSX } from 'preact';

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
                <a href="/">Повернутися до головної сторінки</a>
            </p>
        </div>
    );
}
