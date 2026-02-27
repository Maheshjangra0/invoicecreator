import React, { useState, useEffect } from 'react';
import { addClient, updateClient } from '../../utils/storage';
import { validateClient } from '../../utils/validation';
import './Clients.css';

const ClientForm = ({ client, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    gst: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        address: client.address || '',
        gst: client.gst || ''
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateClient(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (client) {
        // Update existing client
        updateClient(client.id, formData);
      } else {
        // Add new client
        addClient(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="client-form">
      <div className="form-header">
        <h2>{client ? 'Edit Client' : 'Add New Client'}</h2>
        <button className="btn-close" onClick={onClose}>×</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Client Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter client name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="client@example.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Enter full address"
            rows="3"
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gst">GST Number (Optional)</label>
          <input
            type="text"
            id="gst"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            className={errors.gst ? 'error' : ''}
            placeholder="22AAAAA0000A1Z5"
          />
          {errors.gst && <span className="error-message">{errors.gst}</span>}
          <small className="form-hint">Format: 15 characters (e.g., 22AAAAA0000A1Z5)</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (client ? 'Update Client' : 'Add Client')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
