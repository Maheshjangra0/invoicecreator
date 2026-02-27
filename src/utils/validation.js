/**
 * Form Validation Utilities
 * Validates user input for clients and invoices
 */

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean} true if valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate client data
 * @param {Object} client 
 * @returns {Object} validation result with errors
 */
export const validateClient = (client) => {
  const errors = {};
  
  if (!client.name || client.name.trim() === '') {
    errors.name = 'Client name is required';
  }
  
  if (!client.email || client.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!isValidEmail(client.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!client.address || client.address.trim() === '') {
    errors.address = 'Address is required';
  }
  
  // GST is optional, but if provided, validate format
  if (client.gst && client.gst.trim() !== '') {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(client.gst.toUpperCase())) {
      errors.gst = 'Invalid GST format (e.g., 22AAAAA0000A1Z5)';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate invoice data
 * @param {Object} invoice 
 * @returns {Object} validation result with errors
 */
export const validateInvoice = (invoice) => {
  const errors = {};
  
  if (!invoice.clientId) {
    errors.clientId = 'Please select a client';
  }
  
  if (!invoice.date) {
    errors.date = 'Invoice date is required';
  }
  
  if (!invoice.dueDate) {
    errors.dueDate = 'Due date is required';
  }
  
  // Check if due date is after invoice date
  if (invoice.date && invoice.dueDate) {
    const invoiceDate = new Date(invoice.date);
    const dueDate = new Date(invoice.dueDate);
    
    if (dueDate < invoiceDate) {
      errors.dueDate = 'Due date must be after invoice date';
    }
  }
  
  // Validate items
  if (!invoice.items || invoice.items.length === 0) {
    errors.items = 'Invoice must have at least one item';
  } else {
    const itemErrors = [];
    
    invoice.items.forEach((item, index) => {
      const itemError = {};
      
      if (!item.description || item.description.trim() === '') {
        itemError.description = 'Description is required';
      }
      
      const quantity = parseFloat(item.quantity);
      if (!item.quantity || isNaN(quantity) || quantity <= 0) {
        itemError.quantity = 'Quantity must be greater than 0';
      }
      
      const price = parseFloat(item.price);
      if (!item.price || isNaN(price) || price <= 0) {
        itemError.price = 'Price must be greater than 0';
      }
      
      if (Object.keys(itemError).length > 0) {
        itemErrors[index] = itemError;
      }
    });
    
    if (itemErrors.length > 0) {
      errors.itemErrors = itemErrors;
    }
  }
  
  // Validate tax rate
  if (invoice.taxRate !== undefined && invoice.taxRate !== '') {
    const taxRate = parseFloat(invoice.taxRate);
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
      errors.taxRate = 'Tax rate must be between 0 and 100';
    }
  }
  
  // Validate discount
  if (invoice.discount !== undefined && invoice.discount !== '') {
    const discount = parseFloat(invoice.discount);
    if (isNaN(discount) || discount < 0) {
      errors.discount = 'Discount cannot be negative';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate positive number
 * @param {*} value 
 * @returns {boolean} true if valid positive number
 */
export const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validate non-negative number
 * @param {*} value 
 * @returns {boolean} true if valid non-negative number
 */
export const isNonNegativeNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Sanitize string input
 * @param {string} str 
 * @returns {string} sanitized string
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} dateStr 
 * @returns {boolean} true if valid
 */
export const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};
