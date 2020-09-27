import { h } from 'preact';

import logo from '../../assets/myrotvorets.svg';
import Modal from '../Modal';
import './loader.scss';

export default function Loader(): h.JSX.Element {
    return (
        <Modal>
            <img src={logo as string} alt="Зачекайте, будь ласка" className="Loader" />
        </Modal>
    );
}
