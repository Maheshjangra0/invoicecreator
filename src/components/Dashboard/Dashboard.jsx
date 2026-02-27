import React, { useState, useEffect } from 'react';
import { getInvoices, getClients } from '../../utils/storage';
import { getRevenueStats, formatCurrency, calculateMonthlyRevenue } from '../../utils/calculations';
import './Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidRevenue: 0,
    unpaidRevenue: 0,
    paidCount: 0,
    unpaidCount: 0
  });
  
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const invoices = getInvoices();
    const clientsData = getClients();
    
    // Calculate statistics
    const revenueStats = getRevenueStats(invoices);
    setStats(revenueStats);
    
    // Get recent invoices (last 5)
    const recent = invoices
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentInvoices(recent);
    
    setClients(clientsData);
    
    // Calculate monthly revenue for last 6 months
    const currentDate = new Date();
    const monthly = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const revenue = calculateMonthlyRevenue(invoices, month, year);
      
      monthly.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue
      });
    }
    
    setMonthlyData(monthly);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="dashboard-subtitle">Track your business performance at a glance</p>
        </div>
        <button className="btn btn-secondary" onClick={loadDashboardData}>
          <span>↻</span> Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
            <small>{stats.paidCount + stats.unpaidCount} total invoices</small>
          </div>
        </div>

        <div className="stat-card stat-paid">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Paid Amount</h3>
            <p className="stat-value">{formatCurrency(stats.paidRevenue)}</p>
            <small>{stats.paidCount} paid invoices</small>
          </div>
        </div>

        <div className="stat-card stat-unpaid">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Pending Amount</h3>
            <p className="stat-value">{formatCurrency(stats.unpaidRevenue)}</p>
            <small>{stats.unpaidCount} pending invoices</small>
          </div>
        </div>

        <div className="stat-card stat-clients">
          <div className="stat-icon-wrapper">
            <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M16 11a3 3 0 100-6M21 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3>Active Clients</h3>
            <p className="stat-value">{clients.length}</p>
            <small>Registered clients</small>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h2>Monthly Revenue (Last 6 Months)</h2>
          <div className="bar-chart">
            {monthlyData.map((data, index) => (
              <div key={index} className="bar-item">
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      height: `${(data.revenue / maxRevenue) * 100}%`
                    }}
                    title={formatCurrency(data.revenue)}
                  >
                    <span className="bar-value">{formatCurrency(data.revenue)}</span>
                  </div>
                </div>
                <span className="bar-label">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h2>Revenue Distribution</h2>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <div
                className="pie-segment pie-paid"
                style={{
                  '--percentage': stats.totalRevenue > 0 
                    ? (stats.paidRevenue / stats.totalRevenue) * 100 
                    : 50
                }}
              ></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color legend-paid"></span>
                <span className="legend-text">
                  Paid: {formatCurrency(stats.paidRevenue)}
                  {stats.totalRevenue > 0 && 
                    ` (${Math.round((stats.paidRevenue / stats.totalRevenue) * 100)}%)`
                  }
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-unpaid"></span>
                <span className="legend-text">
                  Unpaid: {formatCurrency(stats.unpaidRevenue)}
                  {stats.totalRevenue > 0 && 
                    ` (${Math.round((stats.unpaidRevenue / stats.totalRevenue) * 100)}%)`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="recent-section">
        <h2>Recent Invoices</h2>
        {recentInvoices.length === 0 ? (
          <div className="empty-state">
            <p>No invoices yet</p>
          </div>
        ) : (
          <div className="recent-invoices-list">
            {recentInvoices.map(invoice => (
              <div key={invoice.id} className="recent-invoice-item">
                <div className="invoice-info">
                  <span className="invoice-number-badge">{invoice.invoiceNumber}</span>
                  <span className="invoice-client">{getClientName(invoice.clientId)}</span>
                </div>
                <div className="invoice-details">
                  <span className="invoice-date">
                    {new Date(invoice.date).toLocaleDateString()}
                  </span>
                  <span className="invoice-amount">{formatCurrency(invoice.total)}</span>
                  <span className={`status-badge status-${invoice.status}`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <div className="action-card" onClick={() => onNavigate && onNavigate('create-invoice')}>
            <span className="action-icon">+</span>
            <h3>Create Invoice</h3>
            <p>Generate a new invoice for your clients</p>
          </div>
          <div className="action-card" onClick={() => onNavigate && onNavigate('clients')}>
            <span className="action-icon">◉</span>
            <h3>Manage Clients</h3>
            <p>View and manage your client database</p>
          </div>
          <div className="action-card" onClick={() => onNavigate && onNavigate('invoices')}>
            <span className="action-icon">▢</span>
            <h3>View Invoices</h3>
            <p>Review all invoices and reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
