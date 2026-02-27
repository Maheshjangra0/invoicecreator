import React, { useState, useEffect } from 'react';
import { getInvoices, deleteInvoice, updateInvoiceStatus, getClients } from '../../utils/storage';
import { formatCurrency } from '../../utils/calculations';
import InvoiceView from './InvoiceView';
import './Invoices.css';

const InvoiceList = ({ onEdit }) => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const invoicesData = getInvoices();
    const clientsData = getClients();
    setInvoices(invoicesData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setClients(clientsData);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      loadData();
    }
  };

  const handleToggleStatus = (invoice) => {
    const newStatus = invoice.status === 'paid' ? 'unpaid' : 'paid';
    updateInvoiceStatus(invoice.id, newStatus);
    loadData();
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseView = () => {
    setSelectedInvoice(null);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(inv.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    return status === 'paid' ? 'status-badge status-paid' : 'status-badge status-unpaid';
  };

  return (
    <div className="invoice-list-container">
      <div className="page-header">
        <div>
          <h1>Invoices</h1>
          <p className="page-subtitle">Manage and track all your invoices</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by invoice number or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({invoices.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`}
            onClick={() => setFilterStatus('paid')}
          >
            Paid ({invoices.filter(i => i.status === 'paid').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'unpaid' ? 'active' : ''}`}
            onClick={() => setFilterStatus('unpaid')}
          >
            Unpaid ({invoices.filter(i => i.status === 'unpaid').length})
          </button>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <p>No invoices found</p>
          {searchTerm === '' && filterStatus === 'all' && (
            <p className="empty-hint">Create your first invoice to get started</p>
          )}
        </div>
      ) : (
        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>
                    <span className="invoice-number">{invoice.invoiceNumber}</span>
                  </td>
                  <td>{getClientName(invoice.clientId)}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="amount-cell">
                    <strong>{formatCurrency(invoice.total)}</strong>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(invoice.status)}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-view"
                        onClick={() => handleView(invoice)}
                        title="View"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(invoice)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-status"
                        onClick={() => handleToggleStatus(invoice)}
                        title={invoice.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                      >
                        {invoice.status === 'paid' ? '❌' : '✅'}
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(invoice.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedInvoice && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <InvoiceView
              invoice={selectedInvoice}
              client={clients.find(c => c.id === selectedInvoice.clientId)}
              onClose={handleCloseView}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
