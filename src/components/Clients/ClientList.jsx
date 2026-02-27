import React, { useState, useEffect } from 'react';
import { getClients, deleteClient } from '../../utils/storage';
import ClientForm from './ClientForm';
import './Clients.css';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const clientsData = getClients();
    setClients(clientsData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
      loadClients();
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingClient(null);
    loadClients();
  };

  const handleAddNew = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="client-list-container">
      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p className="page-subtitle">Manage your client relationships</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <span>+</span> Add New Client
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="clients-grid">
        {filteredClients.length === 0 ? (
          <div className="empty-state">
            <p>No clients found</p>
            <button className="btn btn-secondary" onClick={handleAddNew}>
              Add Your First Client
            </button>
          </div>
        ) : (
          filteredClients.map(client => (
            <div key={client.id} className="client-card">
              <div className="client-card-header">
                <h3>{client.name}</h3>
                <div className="client-card-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => handleEdit(client)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDelete(client.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="client-card-body">
                <div className="client-info">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{client.email}</span>
                </div>
                
                <div className="client-info">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{client.address}</span>
                </div>
                
                {client.gst && (
                  <div className="client-info">
                    <span className="info-label">GST:</span>
                    <span className="info-value">{client.gst}</span>
                  </div>
                )}
                
                <div className="client-meta">
                  <small>Created: {new Date(client.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ClientForm
              client={editingClient}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
