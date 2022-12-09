import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import Logo from '../Logo/Logo';

export default function Navbar() {
    return (
        <div className='topbarContent'>
            <Logo></Logo>
            <nav className='navbar'>
                <ul className="navbar-links">
                    <li>
                        <NavLink end to='/'>Home</NavLink>
                    </li>
                    <li>
                        <NavLink end to='/about'>About</NavLink>
                    </li>
                    <li>
                        <NavLink end to='/contribute'>Contribute</NavLink>
                    </li>
                    <li>
                        <NavLink end to='/artwork'>Artwork</NavLink>
                    </li>
                    <li>
                        <NavLink end to='/admin'>Admin</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
