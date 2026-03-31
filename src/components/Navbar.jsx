import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">MovieVerse</Link>

      <div className="nav-center">
        <ul className="nav-links">
          <li><NavLink to="/" end className={getNavLinkClass}>Home</NavLink></li>
          <li><NavLink to="/watchlist" className={getNavLinkClass}>Watchlist</NavLink></li>
        </ul>
        <form className="nav-search-form" onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="nav-search-input"
          />
        </form>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <p className="nav-user">Signed in as <span>{user.email}</span></p>
            <button type="button" className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => `${getNavLinkClass({ isActive })} nav-auth-link`}>
              Login
            </NavLink>
            <NavLink to="/signup" className={({ isActive }) => `nav-link-primary${isActive ? ' active' : ''}`}>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
