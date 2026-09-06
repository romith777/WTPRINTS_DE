import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Account.css';

function Account() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout, setIsLoading } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // We could show a modal here, but for simplicity we'll just log them out directly
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setIsLoading(true);
    // Mock backend call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated successfully!");
      e.target.reset();
    }, 1000);
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <main className="account-main-wrapper" style={{ marginTop: '150px' }}>
      <div className="account-wrapper">
        <aside className="sidebar">
          <div className="avatar-wrap">
            <div className="avatar-circle" id="avatar-initial">{initial}</div>
            <div className="sidebar-username" id="sidebar-username">{user?.username || 'Seller Account'}</div>
          </div>

          <nav className="side-menu">
            <div 
              className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} 
              onClick={() => setActiveTab('overview')}
            >
              Account
            </div>
            <div 
              className={`menu-item ${activeTab === 'change-password' ? 'active' : ''}`} 
              onClick={() => setActiveTab('change-password')}
            >
              Change Password
            </div>
          </nav>
          
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </aside>

        <section className="account-main">
          {activeTab === 'overview' && (
            <div className="content-section active">
              <h1 className="account-title">My Account</h1>
              <p className="account-sub">Manage your personal information and preferences</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Products</div>
                  <div className="stat-value">0</div>
                </div>
              </div>

              <div className="account-fields">
                <div className="field">
                  <label className="field-label">Brand Name</label>
                  <div className="field-value">{user?.username || 'Not set'}</div>
                </div>

                <div className="field">
                  <label className="field-label">Email Address</label>
                  <div className="field-value">{user?.email || 'Not set'}</div>
                </div>

                <div className="field">
                  <label className="field-label">Delivery Address</label>
                  <div className="field-value empty">Not set yet</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'change-password' && (
            <div className="content-section active">
              <h1 className="account-title">Change Password</h1>
              <p className="account-sub">Update your password to keep your account secure</p>

              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" name="currentPassword" className="form-input" placeholder="Enter current password" required />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" name="newPassword" id="newPassword" className="form-input" placeholder="Enter new password" required minLength="8" />
                  <small className="form-hint">Must be at least 8 characters</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword" className="form-input" placeholder="Confirm new password" required minLength="8" />
                </div>

                <button type="submit" className="submit-btn">Change Password</button>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Account;
