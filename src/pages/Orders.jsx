import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StoreContext } from '../context/StoreContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Orders.css';

const STATUS_PIPELINE = [
 'Processing',
 'Packed',
 'Shipped to Hub',
 'Delivered to Hub',
 'Consolidated',
 'Dispatched to Buyer',
 'Delivered',
];

const FILTER_TABS = ['All', ...STATUS_PIPELINE];

function formatDate(dateStr) {
 return new Date(dateStr).toLocaleDateString('en-IN', {
 day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
 });
}

function shortId(id) {
 return id ? `#${String(id).slice(-8).toUpperCase()}` : '#—';
}

function getStatusClass(status) {
 return `status-${(status || 'Processing').replace(/\s+/g, '-')}`;
}

function OrderSkeleton() {
 return (
 <div className="orders-loading">
 {[1,2,3].map(i => (
 <div key={i} className="order-skeleton">
 <div className="skeleton-line" style={{ height: 18, width: '35%' }} />
 <div className="skeleton-line" style={{ height: 14, width: '55%' }} />
 <div className="skeleton-line" style={{ height: 14, width: '45%' }} />
 </div>
 ))}
 </div>
 );
}

function Orders() {
 const { token, user } = useContext(StoreContext);
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeFilter, setActiveFilter] = useState('All');
 const [updatingId, setUpdatingId] = useState(null);

 const fetchOrders = useCallback(async () => {
 setLoading(true);
 try {
 const res = await axios.get('/api/seller-orders', {
 headers: { Authorization: `Bearer ${token}` }
 });
 if (res.data.success) {
 setOrders(res.data.orders);
 } else {
 toast.error('Failed to load orders');
 }
 } catch (err) {
 console.error(err);
 toast.error('Could not fetch orders — check your connection');
 } finally {
 setLoading(false);
 }
 }, [token]);

 useEffect(() => {
 fetchOrders();
 }, [fetchOrders]);

 const handleStatusChange = async (orderId, newStatus) => {
 setUpdatingId(orderId);
 try {
 const res = await axios.post('/api/update-order-status', 
 { orderId, newStatus },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 if (res.data.success) {
 setOrders(prev =>
 prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
 );
 toast.success(`Order updated → ${newStatus}`);
 } else {
 toast.error('Update failed');
 }
 } catch (err) {
 toast.error('Failed to update order status');
 } finally {
 setUpdatingId(null);
 }
 };

 const filtered = activeFilter === 'All'
 ? orders
 : orders.filter(o => o.status === activeFilter);

 // Stats
 const stats = {
 total: orders.length,
 processing: orders.filter(o => o.status === 'Processing').length,
 shipped: orders.filter(o => o.status === 'Shipped to Hub' || o.status === 'Dispatched to Buyer').length,
 delivered: orders.filter(o => o.status === 'Delivered').length,
 };

 return (
 <main className="orders-wrapper">
 <div className="orders-header">
 <h1 className="orders-title">Orders</h1>
 <p className="orders-sub">
 All orders containing your brand's products from WTPrints
 </p>
 </div>

 {/* Stats Row */}
 <div className="orders-stats">
 <div className="orders-stat">
 <div className="orders-stat-label">Total Orders</div>
 <div className="orders-stat-value">{stats.total}</div>
 </div>
 <div className="orders-stat">
 <div className="orders-stat-label">Processing</div>
 <div className="orders-stat-value red">{stats.processing}</div>
 </div>
 <div className="orders-stat">
 <div className="orders-stat-label">In Transit</div>
 <div className="orders-stat-value amber">{stats.shipped}</div>
 </div>
 <div className="orders-stat">
 <div className="orders-stat-label">Delivered</div>
 <div className="orders-stat-value green">{stats.delivered}</div>
 </div>
 </div>

 {/* Filter Tabs */}
 <div className="orders-filters">
 {FILTER_TABS.map(tab => (
 <button
 key={tab}
 className={`filter-tab${activeFilter === tab ? ' active' : ''}`}
 onClick={() => setActiveFilter(tab)}
 >
 {tab}
 </button>
 ))}
 </div>

 {/* Toolbar */}
 <div className="orders-toolbar">
 <span className="orders-count">
 {loading ? 'Loading...' : `${filtered.length} order${filtered.length !== 1 ? 's' : ''}`}
 </span>
 <button className="refresh-btn" onClick={fetchOrders}>
 Refresh
 </button>
 </div>

 {/* Content */}
 {loading ? (
 <OrderSkeleton />
 ) : filtered.length === 0 ? (
 <div className="orders-empty">
 <div className="orders-empty-icon"></div>
 <div className="orders-empty-title">No orders found</div>
 <div className="orders-empty-sub">
 {activeFilter === 'All'
 ? "Orders from WTPrints customers will appear here once buyers purchase your products."
 : `No orders with status "${activeFilter}" right now.`}
 </div>
 </div>
 ) : (
 <div className="orders-list">
 {filtered.map(order => (
 <div key={order._id} className="order-card">
 <div className="order-card-top">
 <div className="order-meta">
 <div className="order-id">{shortId(order._id)}</div>
 <div className="order-date">{formatDate(order.createdAt)}</div>
 <div className="order-email"> {order.userEmail || 'Guest order'}</div>
 </div>

 <div className="order-status-area">
 <span className={`status-badge ${getStatusClass(order.status)}`}>
 {order.status || 'Processing'}
 </span>
 <select
 className="status-select"
 value={order.status || 'Processing'}
 disabled={updatingId === order._id}
 onChange={(e) => handleStatusChange(order._id, e.target.value)}
 >
 {STATUS_PIPELINE.map(s => (
 <option key={s} value={s}>{s}</option>
 ))}
 </select>
 </div>
 </div>

 {/* Order items (only seller's items) */}
 <div className="order-items">
 {(order.myItems || order.cart || []).map((item, idx) => (
 <div key={idx} className="order-item">
 <div>
 <div className="order-item-name">{item.name}</div>
 <div className="order-item-meta">
 Size: {item.selectedSize || 'M'} · Qty: {item.quantity || 1}
 </div>
 </div>
 <div className="order-item-price">
 ₹{((item.priceCents || 0) / 100).toFixed(2)}
 </div>
 </div>
 ))}
 </div>

 <div className="order-card-footer">
 <div className="order-address">
 {order.shippingDetails
 ? `${order.shippingDetails.address || ''}, ${order.shippingDetails.city || ''}, ${order.shippingDetails.pincode || ''}`
 : 'Address not available'}
 </div>
 <div className="order-total">
 ₹{((order.amount || 0) / 100).toFixed(2)}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </main>
 );
}

export default Orders;
