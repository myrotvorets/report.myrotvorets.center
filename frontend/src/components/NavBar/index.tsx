import { JSX } from 'preact';
import { connect } from 'unistore/preact';
import { Link } from 'preact-router/match';
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
                <Link href={loggedIn ? '/start' : '/'}>Головна</Link>
            </MenuItem>
            {!loggedIn && (
                <MenuItem>
                    <Link href="/login">Увійти</Link>
                </MenuItem>
            )}
            <Submenu title="Взаємодія">
                <MenuItem>
                    <Link href="/about">Про Центр</Link>
                </MenuItem>
                <MenuItem>
                    <Link href="/about/crimes">Перелік злочинів, що досліджуються Центром</Link>
                </MenuItem>
                <MenuItem>
                    <Link href="/about/grounds">Підстави діяльності Центру</Link>
                </MenuItem>
                <MenuItem>
                    <a href="https://myrotvorets.center/contacts/" target="_blank" rel="noopener noreferrer">
                        Про взаємодію та співпрацю з Центром
                    </a>
                </MenuItem>
                <MenuItem>
                    <Link href="/about/complaints">Порядок подання скарг</Link>
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
                    <Link href="/logout">Вийти</Link>
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
