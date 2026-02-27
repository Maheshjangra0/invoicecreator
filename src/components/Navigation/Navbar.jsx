import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '■' },
    { id: 'invoices', label: 'Invoices', icon: '▢' },
    { id: 'create-invoice', label: 'Create', icon: '+' },
    { id: 'clients', label: 'Clients', icon: '◉' },
    { id: 'settings', label: 'Settings', icon: '⚙' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onTabChange('dashboard')}>
        <div className="brand-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="4" fill="#2563eb"/>
            <path d="M10 12h12M10 16h8M10 20h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="brand-info">
          <span className="brand-text">InvoicePro</span>
          <span className="brand-tagline">Billing Platform</span>
        </div>
      </div>
      
      <div className="navbar-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
