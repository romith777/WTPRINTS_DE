import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function Navbar() {
  const { user } = useContext(StoreContext);
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <header className="navtotal">
      <div className="navbar">
        <Link to="/">
          <div className="nav-logo">
            <h1 className="nav-txt">WTPRINTS-DE</h1>
          </div>
        </Link>
        <div className="search-bar">
          <div className="search-region">
            <form action="" className="search-form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Search your products..." name="search" className="search-area" />
              <button type="submit" className="search-button">
                <img src="/assets/search-icon.png" alt="search" style={{ width: '100%' }} />
              </button>
            </form>
          </div>
        </div>
        <div className="nav-components">
          <NavLink to="/orders">
            <div><p style={{ fontSize: 'large' }}>Orders</p></div>
          </NavLink>
          <NavLink to="/account">
            <div className="nav-avatar-link">
              <div className="nav-avatar">{initial}</div>
              <p style={{ fontSize: 'large' }}>{user?.username || 'My Account'}</p>
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
