import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../../lib/api';
import { useState } from 'react';
import './Navbar.css';

import Logo from '../../assets/Logo.png'

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = Boolean(getToken());

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    clearToken();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/account">
          <img src={Logo} alt="Spoonful" />
        </Link>
      </div>

      <div className="profile-menu">
        <button
          type="button"
          className="account-button"
          aria-label="Open account menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
        </button>

        {menuOpen ? (
          <div className="profile-dropdown" role="menu">
            <Link
              to="/recipes"
              role="menuitem"
              className={location.pathname.startsWith('/recipes') ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Browse Recipes
            </Link>
            <button type="button" role="menuitem" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
