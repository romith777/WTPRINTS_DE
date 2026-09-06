import React from 'react';

function Loader({ isLoading }) {
  if (!isLoading) return null;
  
  return (
    <div className="loader-wrapper" style={{ display: 'flex' }}>
      <div className="loader">
        <span className="loader-inner">
          <span>WTPRINTS-DE<div className="loader-in-line"></div></span>
        </span>
      </div>
    </div>
  );
}

export default Loader;
