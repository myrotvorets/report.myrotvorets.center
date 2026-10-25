import { JSX } from 'preact';
import { connect } from 'unistore/preact';
import { AppState } from '../../redux/store';

import MenuBar from './MenuBar/index';
import Submenu from './Submenu/index';
import MenuItem from './MenuItem/index';

import './navbar.scss';

interface MappedProps {
    loggedIn: boolean;
}

type Props = MappedProps;

function NavBar(props: Readonly<Props>): JSX.Element {
    const { loggedIn } = props;
    return (
        <MenuBar>
            <MenuItem>
                <a href={loggedIn ? '/start' : '/'}>Головна</a>
            </MenuItem>
            {!loggedIn && (
                <MenuItem>
                    <a href="/login">Увійти</a>
                </MenuItem>
            )}
            <Submenu title="Взаємодія">
                <MenuItem>
                    <a href="/about">Про Центр</a>
                </MenuItem>
                <MenuItem>
                    <a href="/about/crimes">Перелік злочинів, що досліджуються Центром</a>
                </MenuItem>
                <MenuItem>
                    <a href="/about/grounds">Підстави діяльності Центру</a>
                </MenuItem>
                <MenuItem>
                    <a href="https://myrotvorets.center/contacts/" target="_blank" rel="noopener noreferrer">
                        Про взаємодію та співпрацю з Центром
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="/about/complaints">Порядок подання скарг</a>
                </MenuItem>
            </Submenu>
            <Submenu title="Наші проекти">
                <MenuItem>
                    <a href="https://myrotvorets.center/" target="_blank" rel="noopener noreferrer">
                        Миротворець
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="https://identigraf.center/" target="_blank" rel="noopener noreferrer">
                        IDentigraF
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="https://myrotvorets.news/" target="_blank" rel="noopener noreferrer">
                        Myrotvorets.NEWS
                    </a>
                </MenuItem>
            </Submenu>
            {loggedIn && (
                <MenuItem>
                    <a href="/logout">Вийти</a>
                </MenuItem>
            )}
        </MenuBar>
    );
}

function mapStateToProps(state: AppState): MappedProps {
    return {
        loggedIn: !!state.user,
    };
}

export default connect<unknown, unknown, AppState, MappedProps>(mapStateToProps)(NavBar);
