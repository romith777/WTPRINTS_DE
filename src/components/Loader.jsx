import React, { useState, useEffect } from 'react';

function Loader({ isLoading }) {
  const [visible, setVisible] = useState(isLoading);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setFadingOut(false);
    } else if (visible) {
      setFadingOut(true);
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className={`loader-wrapper${fadingOut ? ' fade-out' : ''}`}>
      <div className="loader-brand">
        WT<span>PRINTS</span>-DE
      </div>
      <div className="loader-bar-track">
        <div className="loader-bar-fill" />
      </div>
      <div className="loader-sub">Seller Dashboard</div>
    </div>
  );
}

export default Loader;
