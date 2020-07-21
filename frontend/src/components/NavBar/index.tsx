import { h } from 'preact';
import { connect } from 'unistore/preact';
import { Link } from 'preact-router';
import { AppState } from '../../redux/store';

import './navbar.scss';
import MenuBar from './MenuBar/index';
import Submenu from './Submenu/index';
import MenuItem from './MenuItem/index';

type OwnProps = unknown;
type MappedProps = {
    loggedIn: boolean;
};

type Props = OwnProps & MappedProps;

function NavBar(props: Props): h.JSX.Element {
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
                    <a href="https://myrotvorets.center/contacts/" target="_blank" rel="noopener">
                        Про взаємодію та співпрацю з Центром
                    </a>
                </MenuItem>
                <MenuItem>
                    <Link href="/about/complaints">Порядок подання скарг</Link>
                </MenuItem>
            </Submenu>
            <Submenu title="Наші проекти">
                <MenuItem>
                    <a href="https://myrotvorets.center/" target="_blank" rel="noopener">
                        Миротворець
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="https://identigraf.center/" target="_blank" rel="noopener">
                        IDentigraF
                    </a>
                </MenuItem>
                <MenuItem>
                    <a href="https://myrotvorets.news/" target="_blank" rel="noopener">
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

export default connect<OwnProps, unknown, AppState, MappedProps>(mapStateToProps)(NavBar);
