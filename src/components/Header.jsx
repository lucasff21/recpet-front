import '../styles/ComponentLayout.css';
import logo from '../assets/logo-pet.png';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
    const { user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);


    const LINKS = [
      {path: '/', label: 'Home'},
      {path: '/quem-somos', label: 'Quem somos'},
      {path: '/adotar', label: 'Adotar'}
    ]

    return (
        <header className="flex justify-between items-center px-4 py-2 bg-white shadow-md relative">
            <img src={logo} alt="Logo" className="w-10 h-10"/>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    )}
            </button>

            <nav
                className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white shadow-md md:shadow-none flex flex-col md:flex-row gap-4 md:gap-16 p-2 md:p-0 ${menuOpen ? 'block' : 'hidden'} md:flex`}>
                {LINKS.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={({isActive}) => `no-underline font-bold ${isActive ? 'text-orange-500 font-bold hover:text-orange-600' : 'text-gray-700 hover:text-gray-900'}`}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {user ? (
                <div className="hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         className="bi bi-people" viewBox="0 0 16 16">
                        <path
                            d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                    </svg>
                    {user.name || user.email}
                </div>
            ) : (
                <Link to="/login" className="hidden md:block">
                    <button className="bg-cyan-800 text-white px-4 py-2 font-semibold rounded hover:bg-cyan-900">
                        Entrar
                    </button>
                </Link>
            )}
        </header>
    );
}

export default Header;