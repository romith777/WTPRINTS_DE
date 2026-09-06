import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { StoreContext } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import Orders from './pages/Orders';

function App() {
  const { isLoading, token } = useContext(StoreContext);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            padding: '14px 20px',
            fontWeight: '600',
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            cursor: 'pointer',
            fontFamily: "'Inter', -apple-system, sans-serif",
            letterSpacing: '0',
          },
          success: {
            iconTheme: { primary: '#ee0652', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      >
        {(t) => (
          <div onClick={() => toast.dismiss(t.id)}>
            <ToastBar toast={t} />
          </div>
        )}
      </Toaster>

      <Loader isLoading={isLoading} />
      {!isLoginPage && <Navbar />}

      <Routes>
        <Route path="/"          element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/products"  element={token ? <Home />      : <Navigate to="/login" />} />
        <Route path="/orders"    element={token ? <Orders />    : <Navigate to="/login" />} />
        <Route path="/account"   element={token ? <Account />   : <Navigate to="/login" />} />
        <Route path="/login"     element={<Login />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>

      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
