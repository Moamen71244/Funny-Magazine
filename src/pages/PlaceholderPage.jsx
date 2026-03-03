import React from 'react';

const PlaceholderPage = ({ onBack }) => {
  return (
    <div className="page-container" style={{ background: 'var(--pastel-green)' }}>
      <div className="card">
        <h1>Coming Soon!</h1>
        <p style={{ fontSize: '1.2rem' }}>Stay tuned for more fun stories and games.</p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <button onClick={onBack} style={{ backgroundColor: 'white', color: 'var(--text-dark)' }}>BACK</button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
