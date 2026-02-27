/**
 * LocalStorage Operations
 * Handles all data persistence
 */

// Storage keys
const CLIENTS_KEY = 'invoice_clients';
const INVOICES_KEY = 'invoice_invoices';
const SETTINGS_KEY = 'invoice_settings';

// ============ CLIENTS ============

/**
 * Get all clients
 * @returns {Array} clients array
 */
export const getClients = () => {
  try {
    const data = localStorage.getItem(CLIENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting clients:', error);
    return [];
  }
};

/**
 * Save clients to localStorage
 * @param {Array} clients 
 */
export const saveClients = (clients) => {
  try {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving clients:', error);
  }
};

/**
 * Add new client
 * @param {Object} client 
 * @returns {Object} saved client with ID
 */
export const addClient = (client) => {
  const clients = getClients();
  const newClient = {
    ...client,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  
  clients.push(newClient);
  saveClients(clients);
  return newClient;
};

/**
 * Update existing client
 * @param {string} id 
 * @param {Object} updatedData 
 * @returns {Object|null} updated client or null if not found
 */
export const updateClient = (id, updatedData) => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  clients[index] = {
    ...clients[index],
    ...updatedData,
    id, // Preserve ID
    updatedAt: new Date().toISOString()
  };
  
  saveClients(clients);
  return clients[index];
};

/**
 * Delete client
 * @param {string} id 
 * @returns {boolean} true if deleted
 */
export const deleteClient = (id) => {
  const clients = getClients();
  const filtered = clients.filter(c => c.id !== id);
  
  if (filtered.length === clients.length) return false;
  
  saveClients(filtered);
  return true;
};

/**
 * Get client by ID
 * @param {string} id 
 * @returns {Object|null} client or null if not found
 */
export const getClientById = (id) => {
  const clients = getClients();
  return clients.find(c => c.id === id) || null;
};

// ============ INVOICES ============

/**
 * Get all invoices
 * @returns {Array} invoices array
 */
export const getInvoices = () => {
  try {
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting invoices:', error);
    return [];
  }
};

/**
 * Save invoices to localStorage
 * @param {Array} invoices 
 */
export const saveInvoices = (invoices) => {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (error) {
    console.error('Error saving invoices:', error);
  }
};

/**
 * Add new invoice
 * @param {Object} invoice 
 * @returns {Object} saved invoice with ID
 */
export const addInvoice = (invoice) => {
  const invoices = getInvoices();
  const newInvoice = {
    ...invoice,
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: invoice.status || 'unpaid'
  };
  
  invoices.push(newInvoice);
  saveInvoices(invoices);
  return newInvoice;
};

/**
 * Update existing invoice
 * @param {string} id 
 * @param {Object} updatedData 
 * @returns {Object|null} updated invoice or null if not found
 */
export const updateInvoice = (id, updatedData) => {
  const invoices = getInvoices();
  const index = invoices.findIndex(inv => inv.id === id);
  
  if (index === -1) return null;
  
  invoices[index] = {
    ...invoices[index],
    ...updatedData,
    id, // Preserve ID
    updatedAt: new Date().toISOString()
  };
  
  saveInvoices(invoices);
  return invoices[index];
};

/**
 * Delete invoice
 * @param {string} id 
 * @returns {boolean} true if deleted
 */
export const deleteInvoice = (id) => {
  const invoices = getInvoices();
  const filtered = invoices.filter(inv => inv.id !== id);
  
  if (filtered.length === invoices.length) return false;
  
  saveInvoices(filtered);
  return true;
};

/**
 * Get invoice by ID
 * @param {string} id 
 * @returns {Object|null} invoice or null if not found
 */
export const getInvoiceById = (id) => {
  const invoices = getInvoices();
  return invoices.find(inv => inv.id === id) || null;
};

/**
 * Update invoice status
 * @param {string} id 
 * @param {string} status - 'paid' or 'unpaid'
 * @returns {Object|null} updated invoice or null if not found
 */
export const updateInvoiceStatus = (id, status) => {
  return updateInvoice(id, { status });
};

// ============ SETTINGS ============

/**
 * Get settings
 * @returns {Object} settings object
 */
export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return getDefaultSettings();
  }
};

/**
 * Save settings
 * @param {Object} settings 
 * @returns {boolean} true if saved successfully
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Get default settings
 * @returns {Object} default settings
 */
export const getDefaultSettings = () => {
  return {
    companyName: 'Your Company Name',
    companyEmail: 'info@yourcompany.com',
    companyAddress: '123 Business Street, City, State 12345',
    companyPhone: '',
    countryCode: '+1',
    companyGST: '',
    taxRate: 18, // Default 18% tax
    currency: '$',
    invoiceTerms: 'Payment due within 30 days. Thank you for your business!'
  };
};

// ============ UTILITIES ============

/**
 * Generate unique ID
 * @returns {string} unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clear all data (use with caution)
 */
export const clearAllData = () => {
  localStorage.removeItem(CLIENTS_KEY);
  localStorage.removeItem(INVOICES_KEY);
  localStorage.removeItem(SETTINGS_KEY);
};

/**
 * Export all data as JSON
 * @returns {Object} all data
 */
export const exportData = () => {
  return {
    clients: getClients(),
    invoices: getInvoices(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
};

/**
 * Import data from JSON
 * @param {Object} data 
 */
export const importData = (data) => {
  if (data.clients) saveClients(data.clients);
  if (data.invoices) saveInvoices(data.invoices);
  if (data.settings) saveSettings(data.settings);
};
