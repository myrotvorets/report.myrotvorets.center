import { Component, type ComponentChild, type TargetedEvent } from 'preact';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import Bugsnag from '@bugsnag/js';
import { withLoginCheck } from '../../hocs/withLoginCheck';
import { Criminal, findCriminalById, isKnownCriminal } from '../../api/myrotvorets';
import CriminalRecord from '../CriminalRecord';
import Loader from '../Loader';
import Alert from '../Alert/index';
import ModalStatus from '../ModalStatus/index';
import { ResGetTokenPayload, W_GETTOKEN, WorkerRequestGetToken, sendAndWait } from '../../utils/worker';
import { withWorker } from '../../hocs/withWorker';
import { lsGet, lsSet } from '../../utils/localstorage';
import { ErrorResponse, GSData, ReportData, addSuspect, updateCriminal } from '../../api/informant';

import './infoform.scss';
import { uploadFiles } from '../../api/storage';

type OwnProps =
    | {
          mode: 'add';
          id: undefined;
      }
    | {
          mode: 'update';
          id: string;
      };

interface MappedProps {
    worker?: Worker;
}

type Props = OwnProps & MappedProps;

interface State {
    error: string;
    criminal: Criminal | false;
    state: 'idle' | 'verifying' | 'success' | 'busy';
    data: ReportData;
    status: string;
    uploadedFileNumber: number;
    filesToUpload: number;
}

class InfoForm extends Component<Props, State> {
    private static _parseError(e: ErrorResponse | Error): string {
        if (e instanceof Error) {
            return e.message;
        }

        switch (e.code) {
            case 'AUTH_FAILED':
                return 'Помилка аутентифікації. Будь ласка, увійдіть ще раз і повторіть спробу.';

            case 'COMM_ERROR':
                return 'Помилка зв’язку з сервером. Будь ласка, перевірте підключення до Інтернету і повторіть спробу.';

            case 'VALIDATION_FAILED':
                return 'Сервер відхилив запит. Переконайтеся, що дані, які ви намагаєтеся надіслати, не мають помилок.';

            default:
                return 'Невідома помилка. Будь ласка, повторіть спробу пізніше.';
        }
    }

    public constructor(props: Props) {
        super(props);

        const criminal = props.mode === 'update' ? isKnownCriminal(props.id) : false;

        this.state = {
            error: '',
            criminal,
            state: props.mode === 'update' && criminal === false ? 'verifying' : 'idle',
            status: '',
            uploadedFileNumber: -1,
            filesToUpload: -1,
            data: {
                name: lsGet('f_name'),
                dob: lsGet('f_dob'),
                country: lsGet('f_country'),
                address: lsGet('f_address'),
                phone: lsGet('f_phone'),
                description: lsGet('f_description'),
                note: lsGet('f_note'),
            },
        };
    }

    public componentDidMount(): void {
        if (this.props.mode === 'update') {
            const { id } = this.props;
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(id)) {
                route('/start');
            } else if (this.state.state === 'verifying') {
                this._verifyCriminal();
            }
        }
    }

    private readonly _onInputChanged = ({
        currentTarget,
    }: TargetedEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
        const { name, value } = currentTarget;

        this.setState((prevState: Readonly<State>): Partial<State> => {
            lsSet(`f_${name}`, value);
            return {
                data: {
                    ...prevState.data,
                    [name]: value,
                },
            };
        });
    };

    private readonly _onFileChange = ({ currentTarget }: TargetedEvent<HTMLInputElement>): void => {
        const { files } = currentTarget;
        if (files) {
            const { length } = files;
            if (length > 15) {
                currentTarget.value = '';
                this.setState({
                    error: 'Ви намагаєтеся завантажити занадто багато файлів. Будь ласка, скористайтеся файлообмінником.',
                });

                return;
            }

            let size = 0;
            for (let i = 0; i < length; ++i) {
                const entry = files[i];
                size += entry.size;
            }

            if (size > 20971520) {
                currentTarget.value = '';
                this.setState({
                    error: 'Ви намагаєтеся завантажити занадто великі файли. Будь ласка, скористайтеся файлообмінником.',
                });
            }
        }
    };

    private readonly _onFormSubmit = (event: TargetedEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            let token: string;
            const req: WorkerRequestGetToken = { type: W_GETTOKEN, payload: undefined };

            this.setState({ state: 'busy', status: 'Проходимо аутентифікацію…' });
            sendAndWait<WorkerRequestGetToken, ResGetTokenPayload>(this.props.worker, req, W_GETTOKEN)
                .then((r): Promise<string> => {
                    if (r.success) {
                        token = r.token;
                        return this._uploadFiles(form, r.uid);
                    }

                    const s = r.message || r.code;
                    throw new Error(s);
                })
                .then((path) => {
                    this.setState({ status: 'Відправляємо дані на сервер…' });
                    const { criminal, data } = this.state;
                    const files: GSData = { path };
                    return criminal === false
                        ? addSuspect(token, data, files)
                        : updateCriminal(token, criminal, data, files);
                })
                .then((j) => {
                    if (j.success) {
                        this._resetLocalStorage();
                        this.setState({ state: 'success' });
                        return;
                    }

                    this.setState({ state: 'idle', error: InfoForm._parseError(j), status: '' });
                })
                .catch((e: unknown) =>
                    this.setState({ state: 'idle', error: InfoForm._parseError(e as Error), status: '' }),
                );
        } else {
            form.reportValidity();
        }
    };

    private readonly _onFileUploadProgress = (e: Event): void => {
        if (e instanceof CustomEvent) {
            const { detail: progress } = e as CustomEvent<number>;
            this.setState(
                ({ uploadedFileNumber, filesToUpload }: State): Partial<State> => ({
                    status: `Завантаження файлу ${uploadedFileNumber} із ${filesToUpload}: ${
                        progress >= 0 ? progress.toString() : '?'
                    }%`,
                }),
            );
        }
    };

    private readonly _onOverallUploadProgress = (e: Event): void => {
        if (e instanceof CustomEvent) {
            const { detail } = e as CustomEvent<number>;
            this.setState(
                ({ filesToUpload }: State): Partial<State> => ({
                    uploadedFileNumber: detail,
                    status: `Завантаження файлу ${detail} із ${filesToUpload}: 0%`,
                }),
            );
        }
    };

    private _verifyCriminal(): void {
        const { id } = this.props;
        // findCriminalById() never fails
        void findCriminalById(id!).then((r) => {
            if ('id' in r) {
                this.setState({
                    criminal: r,
                    state: 'idle',
                });
            } else {
                route('/start');
            }
        });
    }

    private async _uploadFiles(form: HTMLFormElement, uid: string): Promise<string> {
        const f = form.elements.namedItem('files');

        if (f instanceof HTMLInputElement && f.files && f.files.length > 0) {
            try {
                this.setState({
                    status: 'Завантаження файлів…',
                    filesToUpload: f.files.length,
                    uploadedFileNumber: -1,
                });

                document.addEventListener('fileuploadprogress', this._onFileUploadProgress);
                document.addEventListener('overalluploadprogress', this._onOverallUploadProgress);

                return await uploadFiles(this.props.worker!, uid, f.files);
            } catch (e) {
                Bugsnag.notify(e as Error);
                throw e;
            } finally {
                document.removeEventListener('overalluploadprogress', this._onOverallUploadProgress);
                document.removeEventListener('fileuploadprogress', this._onFileUploadProgress);
            }
        }

        return '';
    }

    private _resetLocalStorage(): void {
        Object.keys(this.state.data).forEach((key) => lsSet(`f_${key}`, ''));
    }

    public render(): ComponentChild {
        const { mode } = this.props;
        const { criminal, error, data: form, state } = this.state;

        if (state === 'verifying') {
            return <Loader />;
        }

        if (state === 'success') {
            return (
                <div className="alert success">
                    <p>
                        <strong>Повідомлення відправлено.</strong>
                    </p>
                    <p>Якщо ви зробили все правильно, запис найближчим часом зʼявиться в Чистилищі.</p>
                    <p>
                        <Link href="/start">
                            <strong>Наступна жертва</strong>
                        </Link>
                    </p>
                </div>
            );
        }

        const reqOnAdd = mode === 'add';
        const title = reqOnAdd ? 'Додати новий запис' : 'Доповнити інформацію';
        const reqCls = reqOnAdd ? 'required' : undefined;
        const nameMinLength = reqOnAdd ? 5 : undefined;
        const busy = state === 'busy';

        return (
            <form className="block block--centered" onSubmit={this._onFormSubmit}>
                <header className="block__header">{title}</header>

                <Alert message={error} />

                {criminal && <CriminalRecord criminal={criminal} />}

                <label htmlFor="f_name" className={reqCls}>
                    <abbr title="Прізвище, ім'я, по батькові">ПІБ:</abbr>
                </label>
                <input
                    type="text"
                    name="name"
                    id="f_name"
                    value={form.name}
                    onChange={this._onInputChanged}
                    required={reqOnAdd}
                    minLength={nameMinLength}
                    disabled={busy}
                    className="form-control"
                />

                <label htmlFor="f_dob">Дата народження:</label>
                <input
                    type="date"
                    name="dob"
                    id="f_dob"
                    value={form.dob}
                    onChange={this._onInputChanged}
                    disabled={busy}
                />

                <label htmlFor="f_country">Країна:</label>
                <input
                    type="text"
                    name="country"
                    id="f_country"
                    value={form.country}
                    onChange={this._onInputChanged}
                    disabled={busy}
                />

                <label htmlFor="f_address">Адреса:</label>
                <input
                    type="text"
                    name="address"
                    id="f_address"
                    value={form.address}
                    onChange={this._onInputChanged}
                    disabled={busy}
                />

                <label htmlFor="f_phone">Номер телефону:</label>
                <input
                    type="text"
                    name="phone"
                    id="f_phone"
                    value={form.phone}
                    onChange={this._onInputChanged}
                    disabled={busy}
                />

                <label htmlFor="f_description" className="required">
                    Опис:
                </label>
                <textarea
                    name="description"
                    id="f_description"
                    value={form.description}
                    onChange={this._onInputChanged}
                    rows={20}
                    required
                    minLength={10}
                    aria-describedby="f_description_help"
                    disabled={busy}
                />
                <p id="f_description_help" className="help">
                    Адреси в соціальних мережах, посилання на джерела, опис злочинів
                </p>

                <label htmlFor="f_note">Примітка:</label>
                <input
                    type="text"
                    name="note"
                    id="f_note"
                    value={form.note}
                    onChange={this._onInputChanged}
                    disabled={busy}
                />

                <label htmlFor="f_files">Фотографії, документи</label>
                <input
                    type="file"
                    name="files"
                    id="f_files"
                    multiple
                    aria-describedby="f_files_help"
                    onChange={this._onFileChange}
                    disabled={busy}
                />
                <p id="f_files_help" className="help">
                    Можна завантажити кілька файлів. Щоб вибрати кілька файлів, утримуйте клавіші Shift або Ctrl при
                    виборі файлів.
                    <br />
                    <strong>Не завантажуйте файли великого розміру.</strong> Якщо загальний розмір файлів перевищує{' '}
                    <strong>10 МБ</strong>, або ви хочете завантажити <strong>більше 10 файлів</strong>, будь ласка,{' '}
                    <strong>скористайтеся файлообмінником</strong> та додайте посилання на завантажені файли в поле
                    Опис.
                </p>

                <div className="button-container">
                    <button type="submit" disabled={busy}>
                        {busy ? 'Надсилання даних…' : 'Надіслати'}
                    </button>
                </div>

                <ModalStatus status={this.state.status} />
            </form>
        );
    }
}

export default withWorker(withLoginCheck(InfoForm));
