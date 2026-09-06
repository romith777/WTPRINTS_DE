import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StoreContext } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const STATUS_COLORS = {
  'Processing':        '#f59e0b',
  'Packed':            '#3b82f6',
  'Shipped to Hub':    '#6366f1',
  'Delivered to Hub':  '#8b5cf6',
  'Consolidated':      '#ec4899',
  'Dispatched to Buyer': '#10b981',
  'Delivered':         '#16a34a',
};

function formatCurrency(paise) {
  return `₹${((paise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function shortId(id) {
  return id ? `#${String(id).slice(-8).toUpperCase()}` : '#—';
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="dash-stat-card">
      <div className="dash-stat-label">{label}</div>
      <div className="dash-stat-value" style={accent ? { color: accent } : {}}>{value}</div>
      {sub && <div className="dash-stat-sub">{sub}</div>}
    </div>
  );
}

function Dashboard() {
  const { token, user } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/api/seller-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setOrders(res.data.orders);
    } catch {
      // silently fail — page still shows with zero data
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Computed analytics ──
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;

  // Status breakdown
  const statusBreakdown = orders.reduce((acc, o) => {
    const s = o.status || 'Processing';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Last 5 orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // Revenue by item (top products)
  const productRevenue = {};
  orders.forEach(order => {
    (order.myItems || order.cart || []).forEach(item => {
      if (!item.name) return;
      if (!productRevenue[item.name]) productRevenue[item.name] = { revenue: 0, count: 0 };
      productRevenue[item.name].revenue += (item.priceCents || 0) * (item.quantity || 1);
      productRevenue[item.name].count += (item.quantity || 1);
    });
  });

  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  return (
    <main className="dash-wrapper">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
            {' '}{user?.username || 'Seller'}
          </h1>
          <p className="dash-sub">Here's what's happening with your store today.</p>
        </div>
        <Link to="/orders" className="dash-view-orders-btn">View All Orders</Link>
      </div>

      {/* Top Stats */}
      <div className="dash-stats-grid">
        <StatCard
          label="Total Revenue"
          value={loading ? '—' : formatCurrency(totalRevenue)}
          sub={`across ${totalOrders} orders`}
          accent="#ee0652"
        />
        <StatCard
          label="Total Orders"
          value={loading ? '—' : totalOrders}
          sub={`${processingOrders} pending action`}
        />
        <StatCard
          label="Avg. Order Value"
          value={loading ? '—' : formatCurrency(avgOrderValue)}
          sub="per order"
        />
        <StatCard
          label="Delivered"
          value={loading ? '—' : deliveredOrders}
          sub={totalOrders > 0 ? `${Math.round((deliveredOrders / totalOrders) * 100)}% completion rate` : '0% completion'}
          accent="#16a34a"
        />
      </div>

      <div className="dash-body">
        {/* Recent Orders */}
        <div className="dash-section dash-recent">
          <div className="dash-section-header">
            <h2 className="dash-section-title">Recent Orders</h2>
            <Link to="/orders" className="dash-section-link">See all</Link>
          </div>
          <div className="dash-recent-list">
            {loading ? (
              [1,2,3,4,5].map(i => (
                <div key={i} className="dash-order-row skeleton-row">
                  <div className="skeleton-line" style={{ height: 14, width: '30%' }} />
                  <div className="skeleton-line" style={{ height: 14, width: '20%' }} />
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <div className="dash-empty">
                <p className="dash-empty-text">No orders yet. They will appear here once buyers purchase your products.</p>
              </div>
            ) : recentOrders.map(order => (
              <div key={order._id} className="dash-order-row">
                <div className="dash-order-left">
                  <span className="dash-order-id">{shortId(order._id)}</span>
                  <span className="dash-order-email">{order.userEmail || 'Guest'}</span>
                </div>
                <div className="dash-order-right">
                  <span
                    className="dash-status-dot"
                    style={{ background: STATUS_COLORS[order.status] || '#6b7280' }}
                    title={order.status}
                  />
                  <span className="dash-order-status">{order.status || 'Processing'}</span>
                  <span className="dash-order-amount">{formatCurrency(order.amount)}</span>
                  <span className="dash-order-date">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="dash-right-col">
          {/* Status Breakdown */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Order Status</h2>
            </div>
            <div className="dash-status-list">
              {loading ? (
                <div className="dash-empty"><p className="dash-empty-text">Loading...</p></div>
              ) : Object.keys(statusBreakdown).length === 0 ? (
                <div className="dash-empty"><p className="dash-empty-text">No data yet</p></div>
              ) : Object.entries(statusBreakdown).map(([status, count]) => (
                <div key={status} className="dash-status-row">
                  <div className="dash-status-left">
                    <div
                      className="dash-status-indicator"
                      style={{ background: STATUS_COLORS[status] || '#6b7280' }}
                    />
                    <span className="dash-status-name">{status}</span>
                  </div>
                  <div className="dash-status-right">
                    <div
                      className="dash-status-bar"
                      style={{
                        width: `${Math.round((count / totalOrders) * 100)}%`,
                        background: STATUS_COLORS[status] || '#6b7280',
                      }}
                    />
                    <span className="dash-status-count">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Top Products</h2>
            </div>
            <div className="dash-products-list">
              {loading ? (
                <div className="dash-empty"><p className="dash-empty-text">Loading...</p></div>
              ) : topProducts.length === 0 ? (
                <div className="dash-empty"><p className="dash-empty-text">No product data yet</p></div>
              ) : topProducts.map(([name, data], idx) => (
                <div key={name} className="dash-product-row">
                  <div className="dash-product-rank">{idx + 1}</div>
                  <div className="dash-product-info">
                    <div className="dash-product-name">{name}</div>
                    <div className="dash-product-sold">{data.count} sold</div>
                  </div>
                  <div className="dash-product-revenue">{formatCurrency(data.revenue)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
