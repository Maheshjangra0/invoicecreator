import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../utils/storage';
import './Settings.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    companyPhone: '',
    countryCode: '+1',
    companyGST: '',
    taxRate: 18,
    currency: '$',
    invoiceTerms: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const settings = getSettings();
    setFormData(settings);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const saved = saveSettings(formData);
      if (saved) {
        setSaveStatus('success');
        console.log('Settings saved successfully:', formData);
      } else {
        setSaveStatus('error');
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default settings?')) {
      const defaultSettings = {
        companyName: 'Your Company Name',
        companyEmail: 'info@yourcompany.com',
        companyAddress: '123 Business Street, City, State 12345',
        companyPhone: '',
        countryCode: '+1',
        companyGST: '',
        taxRate: 18,
        currency: '$',
        invoiceTerms: 'Payment due within 30 days. Thank you for your business!'
      };
      setFormData(defaultSettings);
      saveSettings(defaultSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your company details and invoice preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h2>Company Information</h2>
          <p className="section-description">This information will appear on your invoices</p>
          
          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Enter your company name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="companyEmail">Email *</label>
              <input
                type="email"
                id="companyEmail"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                required
                placeholder="company@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyPhone">Phone Number *</label>
              <div className="phone-input-group">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="country-code-select"
                  required
                >
                  <option value="+1">+1</option>
                  <option value="+91">+91</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+86">+86</option>
                  <option value="+49">+49</option>
                  <option value="+33">+33</option>
                  <option value="+39">+39</option>
                  <option value="+34">+34</option>
                  <option value="+7">+7</option>
                  <option value="+55">+55</option>
                  <option value="+27">+27</option>
                  <option value="+20">+20</option>
                  <option value="+971">+971</option>
                  <option value="+65">+65</option>
                </select>
                <input
                  type="tel"
                  id="companyPhone"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleChange}
                  required
                  placeholder="1234567890"
                  className="phone-number-input"
                />
              </div>
              <small>Enter phone number without country code</small>
              {formData.companyPhone && (
                <div className="phone-preview">
                  📞 Full Number: <strong>{formData.countryCode} {formData.companyPhone}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="companyAddress">Address *</label>
            <textarea
              id="companyAddress"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter your complete business address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyGST">GST Number (Optional)</label>
            <input
              type="text"
              id="companyGST"
              name="companyGST"
              value={formData.companyGST}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
            />
            <small>Indian GST format (15 characters)</small>
          </div>
        </div>

        <div className="settings-section">
          <h2>Invoice Preferences</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taxRate">Default Tax Rate (%)</label>
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
              <small>Default tax rate for new invoices</small>
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency Symbol</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="$">$ - Dollar</option>
                <option value="₹">₹ - Rupee</option>
                <option value="€">€ - Euro</option>
                <option value="£">£ - Pound</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="invoiceTerms">Default Invoice Terms</label>
            <textarea
              id="invoiceTerms"
              name="invoiceTerms"
              value={formData.invoiceTerms}
              onChange={handleChange}
              rows="3"
              placeholder="Payment terms and conditions..."
            />
            <small>These terms will appear at the bottom of your invoices</small>
          </div>
        </div>

        <div className="settings-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Reset to Default
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
        </div>

        {saveStatus === 'success' && (
          <div className="alert alert-success">
            ✅ Settings saved successfully!
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="alert alert-error">
            ❌ Error saving settings. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default Settings;
