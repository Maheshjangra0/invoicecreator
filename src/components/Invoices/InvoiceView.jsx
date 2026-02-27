import React from 'react';
import { getSettings } from '../../utils/storage';
import { formatCurrency } from '../../utils/calculations';
import { generateInvoicePDF, sendInvoiceEmail } from '../../utils/pdfExport';
import './Invoices.css';

const InvoiceView = ({ invoice, client, onClose }) => {
  const settings = getSettings();

  const handleExportPDF = async () => {
    const success = await generateInvoicePDF(invoice, client, settings);
    if (success) {
      alert('Invoice PDF generated successfully!');
    } else {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleSendEmail = async () => {
    if (!client || !client.email) {
      alert('Client email not found!');
      return;
    }
    
    await sendInvoiceEmail(client.email, invoice);
  };

  return (
    <div className="invoice-view">
      <div className="invoice-view-header">
        <h2>Invoice Preview</h2>
        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExportPDF}>
            📄 Export PDF
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleSendEmail}>
            📧 Send Email
          </button>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className="invoice-preview" id="invoice-preview">
        {/* Company Header */}
        <div className="invoice-header">
          <div className="company-info">
            <h1>{settings.companyName}</h1>
            <p>{settings.companyAddress}</p>
            <p>Email: {settings.companyEmail}</p>
            <p>Phone: {settings.companyPhone}</p>
          </div>
          
          <div className="invoice-title">
            <h2>INVOICE</h2>
            <div className="invoice-details">
              <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-badge-inline status-${invoice.status}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bill-to-section">
          <h3>BILL TO:</h3>
          <div className="client-details">
            <p><strong>{client?.name || 'N/A'}</strong></p>
            <p>{client?.email || 'N/A'}</p>
            <p>{client?.address || 'N/A'}</p>
            {client?.gst && <p>GST: {client.gst}</p>}
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-items-table">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Quantity</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="totals-line">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="totals-line">
            <span>Tax ({invoice.taxRate}%):</span>
            <span>{formatCurrency(invoice.taxAmount)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="totals-line">
              <span>Discount:</span>
              <span>-{formatCurrency(invoice.discountAmount || invoice.discount)}</span>
            </div>
          )}
          <div className="totals-line total-line">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="invoice-notes">
            <h4>Notes:</h4>
            <p>{invoice.notes}</p>
          </div>
        )}

        {/* Terms */}
        <div className="invoice-terms">
          <h4>Terms & Conditions:</h4>
          <p>{settings.invoiceTerms}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
