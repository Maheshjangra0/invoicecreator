/**
 * PDF Export Utility
 * Generates PDF invoices using jsPDF and html2canvas
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from invoice data
 * @param {Object} invoice - Invoice object
 * @param {Object} client - Client object
 * @param {Object} settings - Company settings
 */
export const generateInvoicePDF = async (invoice, client, settings) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;
    
    // Company Header
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text(settings.companyName, margin, yPos);
    
    yPos += 8;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(settings.companyAddress, margin, yPos);
    
    yPos += 5;
    pdf.text(`Email: ${settings.companyEmail}`, margin, yPos);
    
    yPos += 5;
    pdf.text(`Phone: ${settings.companyPhone}`, margin, yPos);
    
    // Invoice Title
    yPos += 15;
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('INVOICE', pageWidth - margin, yPos, { align: 'right' });
    
    // Invoice Details
    yPos += 10;
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 5;
    pdf.text(`Date: ${formatDate(invoice.date)}`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 5;
    pdf.text(`Due Date: ${formatDate(invoice.dueDate)}`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 5;
    pdf.setFont(undefined, 'bold');
    pdf.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - margin, yPos, { align: 'right' });
    
    // Client Details
    yPos += 10;
    pdf.setFont(undefined, 'bold');
    pdf.text('BILL TO:', margin, yPos);
    
    yPos += 6;
    pdf.setFont(undefined, 'normal');
    pdf.text(client.name, margin, yPos);
    
    yPos += 5;
    pdf.text(client.email, margin, yPos);
    
    yPos += 5;
    const addressLines = pdf.splitTextToSize(client.address, 80);
    pdf.text(addressLines, margin, yPos);
    yPos += addressLines.length * 5;
    
    if (client.gst) {
      yPos += 5;
      pdf.text(`GST: ${client.gst}`, margin, yPos);
    }
    
    // Items Table
    yPos += 15;
    
    // Table Header
    pdf.setFont(undefined, 'bold');
    pdf.setFillColor(52, 73, 94);
    pdf.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.text('Description', margin + 2, yPos + 5);
    pdf.text('Qty', pageWidth - 80, yPos + 5, { align: 'right' });
    pdf.text('Price', pageWidth - 55, yPos + 5, { align: 'right' });
    pdf.text('Total', pageWidth - margin - 2, yPos + 5, { align: 'right' });
    
    yPos += 10;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    
    // Table Rows
    invoice.items.forEach((item, index) => {
      if (yPos > 270) { // Check if need new page
        pdf.addPage();
        yPos = margin;
      }
      
      const rowColor = index % 2 === 0 ? [248, 249, 250] : [255, 255, 255];
      pdf.setFillColor(...rowColor);
      pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, 'F');
      
      const descLines = pdf.splitTextToSize(item.description, 90);
      pdf.text(descLines, margin + 2, yPos);
      pdf.text(item.quantity.toString(), pageWidth - 80, yPos, { align: 'right' });
      pdf.text(`${settings.currency}${parseFloat(item.price).toFixed(2)}`, pageWidth - 55, yPos, { align: 'right' });
      pdf.text(`${settings.currency}${parseFloat(item.total).toFixed(2)}`, pageWidth - margin - 2, yPos, { align: 'right' });
      
      yPos += Math.max(8, descLines.length * 5);
    });
    
    // Totals Section
    yPos += 10;
    const totalsX = pageWidth - 70;
    
    pdf.setFont(undefined, 'normal');
    pdf.text('Subtotal:', totalsX, yPos);
    pdf.text(`${settings.currency}${parseFloat(invoice.subtotal).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 6;
    pdf.text(`Tax (${invoice.taxRate}%):`, totalsX, yPos);
    pdf.text(`${settings.currency}${parseFloat(invoice.taxAmount).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    
    if (invoice.discount > 0) {
      yPos += 6;
      pdf.text('Discount:', totalsX, yPos);
      pdf.text(`-${settings.currency}${parseFloat(invoice.discount).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    }
    
    yPos += 8;
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(12);
    pdf.text('Total:', totalsX, yPos);
    pdf.text(`${settings.currency}${parseFloat(invoice.total).toFixed(2)}`, pageWidth - margin, yPos, { align: 'right' });
    
    // Terms and Conditions
    if (settings.invoiceTerms) {
      yPos += 15;
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'bold');
      pdf.text('Terms & Conditions:', margin, yPos);
      
      yPos += 5;
      pdf.setFont(undefined, 'normal');
      const termsLines = pdf.splitTextToSize(settings.invoiceTerms, pageWidth - 2 * margin);
      pdf.text(termsLines, margin, yPos);
    }
    
    // Save PDF
    pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Generate PDF from HTML element (alternative method)
 * @param {string} elementId - ID of HTML element to convert
 * @param {string} filename - PDF filename
 */
export const generatePDFFromHTML = async (elementId, filename) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10;
    
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    return false;
  }
};

/**
 * Format date for display
 * @param {string} dateStr 
 * @returns {string} formatted date
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Mock email sending function
 * @param {string} recipientEmail 
 * @param {Object} invoice 
 * @returns {Promise} mock promise
 */
export const sendInvoiceEmail = async (recipientEmail, invoice) => {
  // Mock email functionality
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Mock: Email sent to ${recipientEmail}`);
      console.log(`Invoice #${invoice.invoiceNumber}`);
      console.log('Subject: Your Invoice is Ready');
      console.log('Body: Please find attached your invoice.');
      
      alert(`Mock Email Sent!\n\nTo: ${recipientEmail}\nSubject: Invoice ${invoice.invoiceNumber}\n\nIn production, this would integrate with an email service (SendGrid, AWS SES, etc.)`);
      
      resolve({
        success: true,
        message: 'Email sent successfully (mock)'
      });
    }, 1000);
  });
};
