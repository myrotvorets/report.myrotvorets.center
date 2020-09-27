import { Component, ComponentChild, h } from 'preact';

export default class DeleteForm extends Component {
    // eslint-disable-next-line class-methods-use-this
    private _renderStep1(): ComponentChild {
        return (
            <div>
                <div>
                    <p>В запиті на вилучення даних потрібно вказати:</p>
                    <ul>
                        <li>сутність питання;</li>
                        <li>прізвище, ім’я, по батькові;</li>
                        <li>дату і місце народження;</li>
                        <li>
                            <strong>дійсні</strong> адреси реєстрації та проживання;
                        </li>
                        <li>серію та номер паспорта, де, коли і ким виданий (обов’язкове фото паспорта);</li>
                        <li>номер мобільного телефону для зв’язку;</li>
                        <li>скріншот сторінки запису на сайті та її адресу;</li>
                        <li>
                            в разі наявності — фото довідки з відділення МВС України, СБ України або вироку чи постанови
                            Суду.
                        </li>
                    </ul>

                    <p>
                        Заяву потрібно <strong>особисто</strong> електронною поштою направити на адресу{' '}
                        <a href="mailto:lyst2mvs@gmail.com?subject=Запит+на+вилучення+данних+з+Миротворцю">
                            lyst2mvs@gmail.com
                        </a>{' '}
                        або скористатися даним сайтом.
                    </p>
                </div>
                <label>
                    <input type="checkbox" required /> Я розумію, що запити від третіх осіб щодо вилучення даних не
                    розглядаються
                </label>

                <label>
                    <input type="checkbox" required /> Я розумію, що із загального доступу не виключаються відомості про
                    об’єкти, у діях яких є явні ознаки скоєння злочинів проти національної безпеки України, миру,
                    безпеки людства та міжнародного правопорядку
                </label>

                <button>Повернутись</button>
                <button>Продовжити</button>
            </div>
        );
    }

    public render(): ComponentChild {
        return this._renderStep1();
    }
}
