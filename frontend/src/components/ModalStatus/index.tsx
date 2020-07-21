import { h } from 'preact';
import Modal from '../Modal/index';

interface Props {
    status: string;
}

export default function ModalStatus({ status }: Props): h.JSX.Element | null {
    return status ? (
        <Modal>
            <div className="block block--centered">
                <header className="block__header">Надсилання даних</header>

                <p>Будь ласка, зачекайте, це може зайняти деякий час.</p>
                <p>{status}</p>
            </div>
        </Modal>
    ) : null;
}
