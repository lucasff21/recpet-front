import '../styles/ComponentLayout.css';
import logo from '../assets/logo-pet.png';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const LINKS = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Blog' },
    { path: '/quem-somos', label: 'Quem somos' },
  ];

  const USER_MENU = [
    ...(isAdmin
      ? [{ path: '/admin/adocoes', label: 'Dashboard', icon: 'grid' }]
      : []),
    { path: '#', label: 'Meu Perfil', icon: 'user' },
    { path: '#', label: 'Configurações', icon: 'settings' },
    {
      action: () => {
        logout();
        navigate('/');
      },
      label: 'Sair',
      icon: 'logout',
    },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
    }
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  const renderUserMenuItems = () =>
    USER_MENU.map((item, index) => (
      <button
        key={index}
        onClick={() => handleMenuItemClick(item)}
        className="flex items-center gap-2 no-underline text-gray-700 hover:text-orange-600 w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        {item.label}
      </button>
    ));

  const renderUserMenu = (isMobile = false) => {
    if (!user) return null;

    return (
      <div className={isMobile ? 'md:hidden' : 'hidden md:block relative'}>
        <button
          onClick={toggleUserMenu}
          className={`flex items-center gap-2 ${isMobile ? 'w-full' : 'cursor-pointer hover:bg-gray-100 px-3 py-2 rounded'}`}
        >
          <span className="font-bold">
            {user.nome.split(' ')[0] || user.email}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
          >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
          </svg>
        </button>

        {userMenuOpen && (
          <div
            className={`${isMobile ? 'ml-4 mt-2 space-y-2' : 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'}`}
          >
            {renderUserMenuItems()}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 bg-white shadow-md md:relative">
      <img src={logo} alt="Logo" className="w-10 h-10" />

      <button className="md:hidden" onClick={toggleMenu}>
        {menuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M4 4l8 8m0-8l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <nav
        className={`absolute z-2 gap-4 md:static top-16 left-0 w-full md:w-auto bg-white shadow-md md:shadow-none flex flex-col md:flex-row md:space-x-8 p-2 md:p-0 ${menuOpen ? 'block' : 'hidden'} md:flex`}
      >
        {LINKS.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `no-underline font-bold hover:text-orange-600 ${isActive ? 'text-orange-500 font-bold hover:text-orange-600' : 'text-gray-700 hover:text-gray-900'}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}

        {renderUserMenu(true)}

        {!user && (
          <Link
            to="/login"
            className="md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <button className="bg-cyan-800 text-white px-4 py-2 rounded hover:bg-cyan-900 w-full">
              Entrar
            </button>
          </Link>
        )}
      </nav>

      {!user ? (
        <Link to="/login" className="hidden md:block">
          <button className="bg-cyan-800 text-white px-4 py-2 rounded hover:bg-cyan-900">
            Entrar
          </button>
        </Link>
      ) : (
        renderUserMenu()
      )}
    </header>
  );
};

export default Header;
