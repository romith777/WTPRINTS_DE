import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
              <input type="text" placeholder="search your products" name="search" className="search-area" />
              <button type="submit" className="search-button">
                <img src="/assets/search-icon.png" alt="search-icon" style={{ width: '100%' }} />
              </button>
            </form>
          </div>
        </div>
        <div className="nav-components">
          <Link to="/account">
            <div>
              <p style={{ fontSize: 'large' }}>My Account</p>
            </div>
          </Link>
          <Link to="/credits">
            <div>
              <p style={{ fontSize: 'large' }}>WTCredits</p>
            </div>
          </Link>
          <Link to="/contact">
            <div>
              <p style={{ fontSize: 'large' }}>Contact Us</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
