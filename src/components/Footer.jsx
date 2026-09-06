import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>WTPRINTS-<span className="brand-highlight">DE</span></h2>
          <p>
            Your ultimate partner in custom apparel and accessories. We bring your unique designs to life with premium quality and unmatched style.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/">New Arrivals</Link></li>
              <li><Link to="/">Best Sellers</Link></li>
              <li><Link to="/">Custom Orders</Link></li>
              <li><Link to="/">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Shipping & Returns</Link></li>
              <li><Link to="/">Size Guide</Link></li>
              <li><Link to="/">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WTPrints-DE. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
