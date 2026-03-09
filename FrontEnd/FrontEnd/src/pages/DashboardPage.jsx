import React from 'react';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="hero-section">
        <h1 className="hero-title">Find Your Next Opportunity</h1>
        <p className="hero-subtitle">Search for jobs and companies</p>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Job title, keywords, or company" 
          />
          <button className="search-button">Search</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;