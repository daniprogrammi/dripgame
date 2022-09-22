import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import Logo from '../Logo/Logo';

export default function Navbar(){
    return (
        <div className='topbarContent'>
            <Logo></Logo>
        <nav className='navbar'>
            <ul className="navbar-links">
                <li>
                    <NavLink exact to='/' activeClassName='activeNav'>Home</NavLink>
                </li>
                <li>
                    <NavLink exact to='/about' activeClassName='activeNav'>About</NavLink>
                </li>
                <li>
                    <NavLink exact to='/contribute' activeClassName='activeNav'>Contribute</NavLink>
                </li>
                <li>
                    <NavLink exact to='/artwork' activeClassName='activeNav'>Artwork</NavLink>
                </li>  
                <li>
                    <NavLink exact to='/admin' activeClassName='activeNav'>Admin</NavLink>
                </li>
            </ul>
        </nav>
        </div>
    );
}