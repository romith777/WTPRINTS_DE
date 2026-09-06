import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('de_token') || '');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('de_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('de_token', token);
    } else {
      localStorage.removeItem('de_token');
      localStorage.removeItem('de_user');
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('de_user', JSON.stringify(user));
    }
  }, [user]);

  const login = (newToken, userData) => {
    setToken(newToken);
    if (userData) setUser(userData);
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const contextValue = {
    token,
    setToken,
    user,
    setUser,
    login,
    logout,
    isLoading,
    setIsLoading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
