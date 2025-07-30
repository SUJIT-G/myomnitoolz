
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NavLinkItem } from '../types';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const navLinks: NavLinkItem[] = [
  { path: '/home', label: 'Home' },
  { path: '/tools', label: 'Tools' },
];

const Header: React.FC = () => {
  const { user, loading, login, logout } = useAuth(); // Use auth context
  const activeClassName = "text-teal-400";
  const inactiveClassName = "text-white hover:text-teal-300 transition-colors duration-200";

  return (
    <header className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <Link to="/home" className="flex items-center text-3xl font-bold tracking-tight hover:text-teal-400 transition-colors duration-200">
          <svg className="w-8 h-8 mr-2 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.05.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.644.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.127.332-.183.582-.495.644-.87l.213-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          OmniToolz
        </Link>
        <ul className="flex items-center space-x-4 lg:space-x-6">
          {navLinks.map(link => (
             <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} font-semibold text-lg`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {/* Auth Button */}
          <li>
            {loading ? (
                <span className="text-sm text-slate-400 px-3 py-1.5">Authenticating...</span>
            ) : user ? (
              <button
                onClick={logout}
                className={`${inactiveClassName} font-semibold text-lg px-3 py-1.5 border border-transparent hover:border-teal-300 rounded-md`}
              >
                Logout (Pro User)
              </button>
            ) : (
              <button
                onClick={login}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg px-3 py-1.5 rounded-md transition-colors duration-200 shadow-sm"
              >
                Login to Pro
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
