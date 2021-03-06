import { h } from 'preact';

import '../static.scss';

export default function Complaints(): h.JSX.Element {
    return (
        <section className="static block block--centered">
            <header className="block__header">Порядок подання скарг</header>
            <h2>Порядок виключення із загального доступу відомостей про обʼєкти досліджень центру «Миротворець»</h2>
            <p>
                У випадку, якщо відвідувач нашого сайту вважатиме, що відомості про обʼєкт нашого дослідження помилково
                розміщені на цьому інформаційному ресурсі, переконливо просимо проінформувати обʼєкт дослідження, а
                також запропонувати{' '}
                <strong>
                    <em>особисто</em>
                </strong>{' '}
                електронною поштою направити на зазначену нижче адресу відповідний запит на вилучення{' '}
                <strong>
                    <a href="mailto:lyst2mvs@gmail.com">lyst2mvs@gmail.com</a>
                </strong>
                .
            </p>
            <p>
                У листі слід <strong>аргументовано вказати суть питання</strong>, а також{' '}
                <strong>
                    <em>обовʼязково</em>
                </strong>{' '}
                вказати наступне:
            </p>
            <ul>
                <li>Прізвище, Імʼя, По батькові</li>
                <li>Дата і місце народження</li>
                <li>Дійсні адреси реєстрації та проживання</li>
                <li>Серію та номер паспорта, де, коли і ким виданий (обовʼязкове фото паспорта)</li>
                <li>Номер мобільного телефону для звʼязку</li>
                <li>Скріншот сторінки запису на сайті та її адресу</li>
                <li>За наявності — фото довідки з відділення МВС України, СБ України або вироку чи постанови Суду</li>
            </ul>
            <p className="fnt--bold clr--red">
                Запити, надіслані без виконання зазначених вище вимог, не розглядаються.
            </p>
            <p>
                Також <strong>не розглядаються</strong> запити від третіх осіб або ті, що відправлені з поштових
                серверів, розміщених в РФ (наприклад: mail.ru, yandex.ru, list.ru,…). Після розгляду запиту фахівцями та
                проведення комплексу додаткових заходів, буде обовʼязково прийняте відповідне рішення, про яке вам
                повідомлять.
            </p>
            <p className="fnt--bold clr--red">
                Із загального доступу не виключаються відомості про обʼєкти, у діях яких є явні ознаки скоєння злочинів
                проти національної безпеки України, миру, безпеки людства та міжнародного правопорядку.
            </p>
            <p>
                Разом з тим, у полі «Опис» ставиться відмітка про відповідне рішення Суду, а в запис додаються фото
                цього рішення.
            </p>
        </section>
    );
}
