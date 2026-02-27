import React, { useState, useEffect } from 'react';
import { getClients, addInvoice, updateInvoice, getSettings } from '../../utils/storage';
import { generateInvoiceNumber } from '../../utils/invoiceNumber';
import { calculateInvoiceTotals, calculateLineTotal } from '../../utils/calculations';
import { validateInvoice } from '../../utils/validation';
import './Invoices.css';

const InvoiceForm = ({ invoice, onClose }) => {
  const [clients, setClients] = useState([]);
  
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }],
    taxRate: 18,
    discount: 0,
    discountType: 'fixed',
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    status: 'unpaid',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const clientsData = getClients();
    const settingsData = getSettings();
    setClients(clientsData);

    if (invoice) {
      setFormData({
        ...invoice,
        date: invoice.date.split('T')[0],
        dueDate: invoice.dueDate.split('T')[0]
      });
    } else {
      const invoiceNumber = generateInvoiceNumber();
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      
      setFormData(prev => ({
        ...prev,
        invoiceNumber,
        taxRate: settingsData.taxRate,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
    }
  }, [invoice]);

  const calculateTotals = () => {
    const totals = calculateInvoiceTotals(
      formData.items,
      formData.taxRate,
      formData.discount,
      formData.discountType
    );
    
    setFormData(prev => ({
      ...prev,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total
    }));
  };

  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.items, formData.taxRate, formData.discount, formData.discountType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Parse numeric fields
    let processedValue = value;
    if (name === 'taxRate' || name === 'discount') {
      processedValue = value === '' ? 0 : parseFloat(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    // Parse numeric values
    if (field === 'quantity') {
      // Quantity should be whole number only
      newItems[index][field] = value === '' ? '' : parseInt(value) || 0;
    } else if (field === 'price') {
      newItems[index][field] = value === '' ? '' : parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    
    // Calculate total for this item
    if (field === 'quantity' || field === 'price') {
      const qty = parseInt(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].price) || 0;
      newItems[index].total = calculateLineTotal(qty, price);
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
    
    // Clear item errors if they exist
    if (errors.itemErrors && errors.itemErrors[index]) {
      const newItemErrors = [...(errors.itemErrors || [])];
      if (newItemErrors[index] && newItemErrors[index][field]) {
        delete newItemErrors[index][field];
        if (Object.keys(newItemErrors[index]).length === 0) {
          newItemErrors[index] = undefined;
        }
        setErrors(prev => ({
          ...prev,
          itemErrors: newItemErrors
        }));
      }
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) {
      alert('Invoice must have at least one item');
      return;
    }
    
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateInvoice(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Create detailed error message
      let errorMessage = 'Please fix the following errors:\n\n';
      if (validation.errors.clientId) errorMessage += '- ' + validation.errors.clientId + '\n';
      if (validation.errors.date) errorMessage += '- ' + validation.errors.date + '\n';
      if (validation.errors.dueDate) errorMessage += '- ' + validation.errors.dueDate + '\n';
      if (validation.errors.items) errorMessage += '- ' + validation.errors.items + '\n';
      if (validation.errors.itemErrors) {
        errorMessage += '- Some invoice items have errors. Please check:\n';
        validation.errors.itemErrors.forEach((itemError, index) => {
          if (itemError) {
            if (itemError.description) errorMessage += `  Item ${index + 1}: ${itemError.description}\n`;
            if (itemError.quantity) errorMessage += `  Item ${index + 1}: ${itemError.quantity}\n`;
            if (itemError.price) errorMessage += `  Item ${index + 1}: ${itemError.price}\n`;
          }
        });
      }
      
      alert(errorMessage);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (invoice) {
        updateInvoice(invoice.id, formData);
      } else {
        addInvoice(formData);
      }
      
      onClose(true); // true indicates save was successful
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="invoice-form">
      <div className="form-header">
        <h2>{invoice ? 'Edit Invoice' : 'Create New Invoice'}</h2>
        <button className="btn-close" onClick={() => onClose(false)}>×</button>
      </div>
      
      {clients.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>No Clients Available</h3>
          <p>You need to add at least one client before creating an invoice.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              onClose(false);
              // User should navigate to clients page
            }}
          >
            Go to Clients Page
          </button>
        </div>
      ) : (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Invoice Number</label>
            <input
              type="text"
              value={formData.invoiceNumber}
              readOnly
              disabled
              className="input-readonly"
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientId">Client *</label>
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className={errors.clientId ? 'error' : ''}
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && <span className="error-message">{errors.clientId}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Invoice Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date *</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? 'error' : ''}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="items-section">
          <div className="section-header">
            <h3>Invoice Items</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddItem}
            >
              + Add Item
            </button>
          </div>

          {errors.items && <span className="error-message">{errors.items}</span>}

          <div className="items-table">
            <div className="items-header">
              <div className="item-col-desc">Description</div>
              <div className="item-col-qty">Quantity</div>
              <div className="item-col-price">Price</div>
              <div className="item-col-total">Total</div>
              <div className="item-col-action"></div>
            </div>

            {formData.items.map((item, index) => {
              const itemError = errors.itemErrors && errors.itemErrors[index];
              return (
              <div key={index} className="item-row">
                <div className="item-col-desc">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Item description *"
                    className={itemError && itemError.description ? 'error' : ''}
                    title={itemError && itemError.description ? itemError.description : ''}
                  />
                </div>
                <div className="item-col-qty">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    step="1"
                    placeholder="Qty *"
                    className={itemError && itemError.quantity ? 'error' : ''}
                    title={itemError && itemError.quantity ? itemError.quantity : ''}
                  />
                </div>
                <div className="item-col-price">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="Price *"
                    className={itemError && itemError.price ? 'error' : ''}
                    title={itemError && itemError.price ? itemError.price : ''}
                  />
                </div>
                <div className="item-col-total">
                  <span className="item-total">${item.total.toFixed(2)}</span>
                </div>
                <div className="item-col-action">
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => handleRemoveItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    ×
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="taxRate">Tax Rate (%)</label>
            <input
              type="number"
              id="taxRate"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount</label>
            <div className="input-group">
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="discount-type-select"
              >
                <option value="fixed">$</option>
                <option value="percentage">%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="totals-section">
          <div className="totals-row">
            <span>Subtotal:</span>
            <span>${formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="totals-row">
            <span>Tax ({formData.taxRate}%):</span>
            <span>${formData.taxAmount.toFixed(2)}</span>
          </div>
          {formData.discount > 0 && (
            <div className="totals-row">
              <span>Discount:</span>
              <span>-${calculateInvoiceTotals(formData.items, formData.taxRate, formData.discount, formData.discountType).discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="totals-row total-row">
            <span>Total:</span>
            <span>${formData.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes or terms..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onClose(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
          </button>
        </div>
      </form>
      )}
    </div>
  );
};

export default InvoiceForm;
