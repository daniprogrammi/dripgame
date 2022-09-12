import logo from './logo192.png';
import './Logo.scss'

export default function Logo() {
    return (
        <div className="logoDiv">
            <img className='logoImage' src={logo}>
            </img>
            <a className='logoLink' href='#'> 
            <p className="logoTitle">DripGame</p>
            </a> 
        </div>
    );
}