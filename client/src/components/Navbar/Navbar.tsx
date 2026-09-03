import { Link, NavLink, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../../lib/api';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getToken());

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/">Spoonful</Link>
      </div>

      <nav className="navbar-links" aria-label="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recipes">Browse</NavLink>
        {isLoggedIn ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
        {!isLoggedIn ? <NavLink to="/login">Login</NavLink> : null}
      </nav>

      {isLoggedIn ? (
        <button type="button" className="nav-logout" onClick={handleLogout}>
          Logout
        </button>
      ) : null}
    </header>
  );
}
