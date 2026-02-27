/**
 * Invoice Number Generator
 * Generates unique invoice numbers with auto-incrementing
 */

const INVOICE_COUNTER_KEY = 'invoice_counter';
const INVOICE_PREFIX = 'INV';

/**
 * Get current counter from localStorage
 * @returns {number} current counter value
 */
const getCounter = () => {
  const counter = localStorage.getItem(INVOICE_COUNTER_KEY);
  return counter ? parseInt(counter, 10) : 0;
};

/**
 * Set counter in localStorage
 * @param {number} value 
 */
const setCounter = (value) => {
  localStorage.setItem(INVOICE_COUNTER_KEY, value.toString());
};

/**
 * Generate unique invoice number
 * Format: INV-YYYY-XXXX (e.g., INV-2026-0001)
 * @returns {string} invoice number
 */
export const generateInvoiceNumber = () => {
  const currentYear = new Date().getFullYear();
  const counter = getCounter() + 1;
  setCounter(counter);
  
  // Pad counter with zeros (e.g., 1 -> 0001)
  const paddedCounter = counter.toString().padStart(4, '0');
  
  return `${INVOICE_PREFIX}-${currentYear}-${paddedCounter}`;
};

/**
 * Reset counter (useful for new year or testing)
 * @param {number} value - New counter value (default: 0)
 */
export const resetInvoiceCounter = (value = 0) => {
  setCounter(value);
};

/**
 * Get next invoice number without incrementing
 * @returns {string} next invoice number
 */
export const previewNextInvoiceNumber = () => {
  const currentYear = new Date().getFullYear();
  const nextCounter = getCounter() + 1;
  const paddedCounter = nextCounter.toString().padStart(4, '0');
  
  return `${INVOICE_PREFIX}-${currentYear}-${paddedCounter}`;
};

/**
 * Validate invoice number format
 * @param {string} invoiceNumber 
 * @returns {boolean} true if valid format
 */
export const isValidInvoiceNumber = (invoiceNumber) => {
  if (!invoiceNumber) return false;
  
  // Format: INV-YYYY-XXXX
  const pattern = /^INV-\d{4}-\d{4}$/;
  return pattern.test(invoiceNumber);
};

/**
 * Extract counter from invoice number
 * @param {string} invoiceNumber 
 * @returns {number|null} counter value or null if invalid
 */
export const extractCounterFromInvoiceNumber = (invoiceNumber) => {
  if (!isValidInvoiceNumber(invoiceNumber)) return null;
  
  const parts = invoiceNumber.split('-');
  return parseInt(parts[2], 10);
};
