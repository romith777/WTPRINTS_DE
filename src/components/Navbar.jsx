import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function Navbar() {
  const { user } = useContext(StoreContext);
  const initial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : null;

  return (
    <header className="navtotal">
      <div className="navbar">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <h1 className="nav-txt">WTPRINTS-DE</h1>
        </Link>

        {/* Nav Links */}
        <nav className="nav-components">
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Products
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Orders
          </NavLink>

          {/* Account Pill */}
          <NavLink to="/account" className="nav-account-pill">
            {initial ? (
              <div className="nav-avatar">{initial}</div>
            ) : (
              <div className="nav-avatar nav-avatar-placeholder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
            )}
            <span className="nav-username">
              {user?.username || 'Account'}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
