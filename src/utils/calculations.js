/**
 * Invoice Calculation Engine
 * Handles all invoice-related calculations
 */

/**
 * Calculate line item total
 * @param {number} quantity 
 * @param {number} price 
 * @returns {number} total
 */
export const calculateLineTotal = (quantity, price) => {
  const qty = parseFloat(quantity) || 0;
  const unitPrice = parseFloat(price) || 0;
  return qty * unitPrice;
};

/**
 * Calculate subtotal from all items
 * @param {Array} items - Array of invoice items
 * @returns {number} subtotal
 */
export const calculateSubtotal = (items) => {
  if (!items || items.length === 0) return 0;
  
  return items.reduce((sum, item) => {
    const total = calculateLineTotal(item.quantity, item.price);
    return sum + total;
  }, 0);
};

/**
 * Calculate tax amount
 * @param {number} subtotal 
 * @param {number} taxRate - Tax rate as percentage (e.g., 18 for 18%)
 * @returns {number} tax amount
 */
export const calculateTax = (subtotal, taxRate) => {
  const sub = parseFloat(subtotal) || 0;
  const rate = parseFloat(taxRate) || 0;
  return (sub * rate) / 100;
};

/**
 * Calculate discount amount
 * @param {number} subtotal 
 * @param {number} discount - Discount as percentage or fixed amount
 * @param {string} type - 'percentage' or 'fixed'
 * @returns {number} discount amount
 */
export const calculateDiscount = (subtotal, discount, type = 'fixed') => {
  const sub = parseFloat(subtotal) || 0;
  const disc = parseFloat(discount) || 0;
  
  if (type === 'percentage') {
    return (sub * disc) / 100;
  }
  return disc;
};

/**
 * Calculate final total
 * @param {number} subtotal 
 * @param {number} taxAmount 
 * @param {number} discountAmount 
 * @returns {number} final total
 */
export const calculateTotal = (subtotal, taxAmount, discountAmount) => {
  const sub = parseFloat(subtotal) || 0;
  const tax = parseFloat(taxAmount) || 0;
  const discount = parseFloat(discountAmount) || 0;
  
  return sub + tax - discount;
};

/**
 * Calculate complete invoice totals
 * @param {Array} items - Invoice items
 * @param {number} taxRate - Tax rate percentage
 * @param {number} discount - Discount amount
 * @param {string} discountType - 'percentage' or 'fixed'
 * @returns {Object} Complete calculation breakdown
 */
export const calculateInvoiceTotals = (items, taxRate = 0, discount = 0, discountType = 'fixed') => {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, discount, discountType);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = calculateTax(taxableAmount, taxRate);
  const total = subtotal + taxAmount - discountAmount;
  
  return {
    subtotal: roundToTwo(subtotal),
    taxAmount: roundToTwo(taxAmount),
    discountAmount: roundToTwo(discountAmount),
    total: roundToTwo(total)
  };
};

/**
 * Round number to 2 decimal places
 * @param {number} num 
 * @returns {number} rounded number
 */
export const roundToTwo = (num) => {
  return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
};

/**
 * Format currency for display
 * @param {number} amount 
 * @param {string} currency - Currency symbol
 * @returns {string} formatted currency
 */
export const formatCurrency = (amount, currency = '$') => {
  const num = parseFloat(amount) || 0;
  return `${currency}${num.toFixed(2)}`;
};

/**
 * Validate invoice items
 * @param {Array} items 
 * @returns {Object} validation result
 */
export const validateInvoiceItems = (items) => {
  if (!items || items.length === 0) {
    return { valid: false, message: 'Invoice must have at least one item' };
  }
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (!item.description || item.description.trim() === '') {
      return { valid: false, message: `Item ${i + 1}: Description is required` };
    }
    
    if (!item.quantity || parseFloat(item.quantity) <= 0) {
      return { valid: false, message: `Item ${i + 1}: Quantity must be greater than 0` };
    }
    
    if (!item.price || parseFloat(item.price) <= 0) {
      return { valid: false, message: `Item ${i + 1}: Price must be greater than 0` };
    }
  }
  
  return { valid: true, message: '' };
};

/**
 * Calculate monthly revenue from invoices
 * @param {Array} invoices 
 * @param {number} month - Month (1-12)
 * @param {number} year 
 * @returns {number} monthly revenue
 */
export const calculateMonthlyRevenue = (invoices, month, year) => {
  if (!invoices || invoices.length === 0) return 0;
  
  return invoices
    .filter(inv => {
      const invDate = new Date(inv.date);
      return invDate.getMonth() + 1 === month && 
             invDate.getFullYear() === year &&
             inv.status === 'paid';
    })
    .reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0);
};

/**
 * Get revenue statistics
 * @param {Array} invoices 
 * @returns {Object} revenue statistics
 */
export const getRevenueStats = (invoices) => {
  if (!invoices || invoices.length === 0) {
    return {
      totalRevenue: 0,
      paidRevenue: 0,
      unpaidRevenue: 0,
      paidCount: 0,
      unpaidCount: 0
    };
  }
  
  const stats = invoices.reduce((acc, inv) => {
    const amount = parseFloat(inv.total || 0);
    
    if (inv.status === 'paid') {
      acc.paidRevenue += amount;
      acc.paidCount += 1;
    } else {
      acc.unpaidRevenue += amount;
      acc.unpaidCount += 1;
    }
    
    return acc;
  }, {
    paidRevenue: 0,
    unpaidRevenue: 0,
    paidCount: 0,
    unpaidCount: 0
  });
  
  stats.totalRevenue = stats.paidRevenue + stats.unpaidRevenue;
  
  return {
    totalRevenue: roundToTwo(stats.totalRevenue),
    paidRevenue: roundToTwo(stats.paidRevenue),
    unpaidRevenue: roundToTwo(stats.unpaidRevenue),
    paidCount: stats.paidCount,
    unpaidCount: stats.unpaidCount
  };
};
