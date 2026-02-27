import React, { useState } from 'react';
import Navbar from './components/Navigation/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ClientList from './components/Clients/ClientList';
import InvoiceList from './components/Invoices/InvoiceList';
import InvoiceForm from './components/Invoices/InvoiceForm';
import Settings from './components/Settings/Settings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // If switching to create-invoice tab, show the form
    if (tab === 'create-invoice') {
      setEditingInvoice(null);
      setShowInvoiceForm(true);
    } else {
      setShowInvoiceForm(false);
      setEditingInvoice(null);
    }
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
    setActiveTab('create-invoice');
  };

  const handleCloseInvoiceForm = (saved) => {
    setShowInvoiceForm(false);
    setEditingInvoice(null);
    
    // If saved, redirect to invoices list
    if (saved) {
      setActiveTab('invoices');
    } else {
      // If cancelled, go back to previous view
      if (activeTab === 'create-invoice') {
        setActiveTab('dashboard');
      }
    }
  };

  const renderContent = () => {
    if (showInvoiceForm) {
      return (
        <div className="form-page">
          <InvoiceForm
            invoice={editingInvoice}
            onClose={handleCloseInvoiceForm}
          />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleTabChange} />;
      
      case 'clients':
        return <ClientList />;
      
      case 'invoices':
        return <InvoiceList onEdit={handleEditInvoice} />;
      
      case 'settings':
        return <Settings />;
      
      case 'create-invoice':
        // This is handled by showInvoiceForm above
        return <Dashboard onNavigate={handleTabChange} />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="main-content">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>© 2026 InvoicePro • Professional Billing Platform</p>
      </footer>
    </div>
  );
}

export default App;
