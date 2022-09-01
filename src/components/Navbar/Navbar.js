import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar(){
    return (
        <nav className='navbar'>
            <ul>
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
    );
}