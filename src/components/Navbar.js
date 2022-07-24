import { NavLink } from 'react-router-dom';

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
            </ul>
        </nav>
    );
}