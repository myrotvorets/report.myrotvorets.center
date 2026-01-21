import { Component, type ComponentChild, type TargetedEvent } from 'preact';
import { route } from 'preact-router';
import { withLoginCheck } from '../../hocs/withLoginCheck';

interface State {
    action: string;
}

class StartForm extends Component<unknown, State> {
    public state: Readonly<State> = {
        action: '',
    };

    private readonly _onActionChanged = ({ currentTarget }: TargetedEvent<HTMLInputElement>): void => {
        const { value } = currentTarget;
        this.setState({
            action: value,
        });
    };

    private readonly _onFormSubmit = (e: TargetedEvent<HTMLFormElement>): unknown => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity()) {
            switch (this.state.action) {
                case 'add':
                    route('/criminal/add');
                    break;

                case 'update':
                    route('/update/check');
                    break;

                default:
                    break;
            }

            return;
        }

        form.reportValidity();
    };

    public render(): ComponentChild {
        const { action } = this.state;
        return (
            <form className="block block--centered" onSubmit={this._onFormSubmit}>
                <header className="block__header">Виберіть дію</header>

                <strong>Я хочу:</strong>
                <label>
                    <input
                        type="radio"
                        value="add"
                        name="action"
                        checked={action === 'add'}
                        onChange={this._onActionChanged}
                        required
                    />
                    Додати дані про обʼєкт для «Чистилища»
                </label>
                <label>
                    <input
                        type="radio"
                        value="update"
                        name="action"
                        checked={action === 'update'}
                        onChange={this._onActionChanged}
                        required
                    />
                    Доповнити інформацію про існуючий запис в «Чистилищі»
                </label>
                <label>
                    <input
                        type="radio"
                        value="delete"
                        name="action"
                        checked={action === 'delete'}
                        disabled
                        onChange={this._onActionChanged}
                        required
                    />
                    Подати запит на видалення запису
                </label>

                <div className="button-container">
                    <button type="submit" disabled={!action}>
                        Продовжити
                    </button>
                </div>
            </form>
        );
    }
}

export default withLoginCheck(StartForm);
