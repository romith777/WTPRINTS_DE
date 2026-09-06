import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { StoreContext } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';

import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';

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
            fontSize: '16px', 
            padding: '16px 24px',
            fontWeight: 'bold',
            background: '#111',
            color: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          },
          success: {
            iconTheme: {
              primary: '#ee0652',
              secondary: '#fff',
            },
          }
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
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={token ? <Account /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;
