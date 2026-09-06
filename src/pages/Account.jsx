import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Account.css';

const SECTIONS = ['overview', 'change-password'];

function Account() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout, setIsLoading } = useContext(StoreContext);
  const navigate = useNavigate();
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    logout();
    toast.success('Logged out — see you soon!');
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password updated!');
      e.target.reset();
    }, 1200);
  };

  return (
    <main className="account-main-wrapper">
      <div className="account-wrapper">

        {/* ─── SIDEBAR ─── */}
        <aside className="sidebar">
          <div className="avatar-wrap">
            <div className="avatar-circle">{initial}</div>
            <div className="sidebar-username">{user?.username || 'Seller'}</div>
            <div className="sidebar-role">Brand Partner</div>
          </div>

          <nav className="side-menu">
            {[
              { id: 'overview',        label: 'My Account'      },
              { id: 'change-password', label: 'Change Password' },
            ].map(({ id, label }) => (
              <button
                key={id}
                className={`menu-item${activeTab === id ? ' active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {label}
              </button>
            ))}

            <Link to="/orders" className="menu-item menu-item-link">
              My Orders
            </Link>
          </nav>


          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <section className="account-main">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div className="section-header">
                <h1 className="account-title">My Account</h1>
                <p className="account-sub">Manage your brand information and preferences</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">—</div>
                  <div className="stat-hint"><Link to="/orders">View all →</Link></div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Products</div>
                  <div className="stat-value">—</div>
                  <div className="stat-hint"><Link to="/">Manage →</Link></div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Account Status</div>
                  <div className="stat-value stat-active">Active</div>
                  <div className="stat-hint">Brand Partner</div>
                </div>
              </div>


              <div className="account-fields">
                <div className="field">
                  <label className="field-label">Brand Name</label>
                  <div className="field-value">{user?.username || 'Not set'}</div>
                  <div className="field-note">This is your public brand name visible to buyers on WTPrints</div>
                </div>
                <div className="field">
                  <label className="field-label">Email Address</label>
                  <div className="field-value">{user?.email || <span className="field-empty">Not set yet</span>}</div>
                </div>
                <div className="field">
                  <label className="field-label">Phone Number</label>
                  <div className="field-value field-empty">Not set yet</div>
                </div>
                <div className="field">
                  <label className="field-label">Pickup / Return Address</label>
                  <div className="field-value field-empty">Not set yet</div>
                </div>
              </div>
            </div>
          )}

          {/* CHANGE PASSWORD */}
          {activeTab === 'change-password' && (
            <div>
              <div className="section-header">
                <h1 className="account-title">Change Password</h1>
                <p className="account-sub">Update your password to keep your account secure</p>
              </div>

              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" name="currentPassword" className="form-input" placeholder="Enter current password" required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" name="newPassword" className="form-input" placeholder="Minimum 8 characters" required minLength="8" />
                  <small className="form-hint">Must be at least 8 characters</small>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" name="confirmPassword" className="form-input" placeholder="Repeat new password" required minLength="8" />
                </div>
                <button type="submit" className="submit-btn">Update Password</button>
              </form>
            </div>
          )}

        </section>
      </div>
    </main>
  );
}

export default Account;
