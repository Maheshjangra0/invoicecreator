# 🚀 SETUP & RUN GUIDE
## Automated Invoice & Billing Platform

This guide will help you set up and run the Invoice & Billing Platform on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
  - Download from: https://nodejs.org/
  - Check version: `node --version`

- **npm** (comes with Node.js)
  - Check version: `npm --version`

---

## 🛠️ Installation Steps

### Step 1: Navigate to Project Directory

Open your terminal/command prompt and navigate to the project folder:

```bash
cd "c:\Users\mahes\OneDrive\Desktop\invoice genertor"
```

### Step 2: Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

This will install:
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1
- jsPDF 2.5.1 (for PDF generation)
- html2canvas 1.4.1 (for PDF generation)

**Note:** The installation may take 2-5 minutes depending on your internet speed.

---

## ▶️ Running the Application

### Start Development Server

Once installation is complete, start the development server:

```bash
npm start
```

**What happens next:**
1. The application will compile
2. Your default browser will automatically open
3. The app will be available at: `http://localhost:3000`

**If the browser doesn't open automatically:**
- Manually open your browser
- Navigate to: `http://localhost:3000`

---

## 🎯 Using the Application

### 1. **Dashboard** (Home Page)
- View total revenue statistics
- See paid vs unpaid invoices
- Check monthly revenue chart
- View recent invoices

### 2. **Adding Clients**
1. Click "Clients" tab in navigation
2. Click "+ Add New Client" button
3. Fill in client details:
   - Name (required)
   - Email (required)
   - Address (required)
   - GST Number (optional)
4. Click "Add Client"

### 3. **Creating an Invoice**
1. Click "Create Invoice" tab
2. Select a client from dropdown
3. Set invoice date and due date
4. Add invoice items:
   - Click "+ Add Item"
   - Enter description, quantity, and price
   - System auto-calculates totals
5. Set tax rate (default: 18%)
6. Add discount if needed
7. Click "Create Invoice"

### 4. **Managing Invoices**
1. Click "Invoices" tab
2. View all invoices in table format
3. Available actions:
   - 👁️ **View** - Preview invoice
   - ✏️ **Edit** - Modify invoice details
   - ✅ **Mark as Paid** - Change status
   - 🗑️ **Delete** - Remove invoice

### 5. **Exporting Invoices**
1. View any invoice
2. Click "📄 Export PDF"
3. PDF will download automatically

### 6. **Email Invoice (Mock)**
1. View any invoice
2. Click "📧 Send Email"
3. Mock email confirmation will appear

---

## 📂 Project Structure

```
invoice-generator/
├── public/
│   └── index.html              # Main HTML file
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx   # Dashboard component
│   │   │   └── Dashboard.css   # Dashboard styles
│   │   ├── Clients/
│   │   │   ├── ClientList.jsx  # Client list view
│   │   │   ├── ClientForm.jsx  # Add/edit client form
│   │   │   └── Clients.css     # Client styles
│   │   ├── Invoices/
│   │   │   ├── InvoiceList.jsx # Invoice list view
│   │   │   ├── InvoiceForm.jsx # Create/edit invoice
│   │   │   ├── InvoiceView.jsx # Invoice preview
│   │   │   └── Invoices.css    # Invoice styles
│   │   └── Navigation/
│   │       ├── Navbar.jsx      # Navigation bar
│   │       └── Navbar.css      # Nav styles
│   ├── utils/
│   │   ├── calculations.js     # Invoice calculations
│   │   ├── invoiceNumber.js    # ID generator
│   │   ├── storage.js          # LocalStorage ops
│   │   ├── validation.js       # Form validation
│   │   └── pdfExport.js        # PDF generation
│   ├── App.js                  # Main app component
│   ├── App.css                 # App styles
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies
├── .gitignore                  # Git ignore file
└── README.md                   # Documentation
```

---

## 📊 Features Checklist

### ✅ Client Management
- [x] Add clients
- [x] Edit clients
- [x] Delete clients
- [x] Search clients
- [x] Store GST numbers

### ✅ Invoice System
- [x] Create invoices
- [x] Edit invoices
- [x] Delete invoices
- [x] Multiple line items
- [x] Automatic calculations
- [x] Unique invoice numbers
- [x] Tax calculation
- [x] Discount support

### ✅ Billing Actions
- [x] Save to localStorage
- [x] Mark as paid/unpaid
- [x] View invoice details
- [x] Search invoices
- [x] Filter by status

### ✅ Dashboard Analytics
- [x] Total revenue
- [x] Paid vs unpaid stats
- [x] Monthly revenue chart
- [x] Recent invoices
- [x] Client count

### ✅ Professional Features
- [x] Export to PDF
- [x] Email invoice (mock)
- [x] Responsive design
- [x] Data persistence

---

## 🔧 Troubleshooting

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: Port 3000 already in use
**Solution:** 
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
PORT=3001 npm start
```

### Issue: Dependencies not installing
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: Data not persisting
**Solution:** 
- Check if localStorage is enabled in your browser
- Clear browser cache and reload
- Try a different browser

### Issue: PDF not generating
**Solution:**
- Ensure jsPDF and html2canvas are installed
- Check browser console for errors
- Try a different browser

---

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

This creates a `build/` folder with optimized files ready for deployment.

### Deploying the Build

You can deploy the build folder to:
- **Netlify**: Drag & drop the build folder
- **Vercel**: Connect GitHub repo or upload build
- **GitHub Pages**: Use gh-pages package
- **Any static hosting**: Upload build folder contents

---

## 💾 Data Storage

### LocalStorage Keys Used:
- `invoice_clients` - Client data
- `invoice_invoices` - Invoice data
- `invoice_counter` - Invoice number counter
- `invoice_settings` - App settings

### Backing Up Data:
Data is stored in browser's localStorage. To backup:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Export data manually

### Clearing Data:
```javascript
// Open browser console and run:
localStorage.clear();
```

---

## 🎨 Customization

### Change Company Details:
Edit `src/utils/storage.js` - `getDefaultSettings()` function:
```javascript
companyName: 'Your Company Name',
companyEmail: 'info@yourcompany.com',
companyAddress: 'Your Address',
companyPhone: 'Your Phone'
```

### Change Tax Rate:
Default tax rate is 18%. Change in `getDefaultSettings()`:
```javascript
taxRate: 18  // Change to your tax rate
```

### Change Currency:
Default is USD ($). Change in `getDefaultSettings()`:
```javascript
currency: '$'  // Change to €, £, ₹, etc.
```

---

## 📖 Available Scripts

### `npm start`
Runs the app in development mode.
Open http://localhost:3000 to view it in your browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

---

## 🔐 Security Notes

- This is a frontend-only application
- Data is stored in browser localStorage
- No backend or database connection
- For production use, consider:
  - Adding authentication
  - Using a real database
  - Implementing API endpoints
  - Adding user management

---

## 🆘 Getting Help

If you encounter issues:

1. Check the console for errors (F12 in browser)
2. Review this setup guide
3. Check the troubleshooting section
4. Verify all dependencies are installed

---

## 📝 Additional Notes

### Performance Tips:
- Clear old data periodically
- Don't store too many invoices (localStorage limit: ~5-10MB)
- Use modern browsers (Chrome, Firefox, Edge, Safari)

### Best Practices:
- Backup data regularly
- Test on different browsers
- Keep client information up to date
- Export important invoices as PDF

---

## ✨ Features Not Included (Future Enhancements)

- User authentication
- Backend API integration
- Real email sending (SMTP)
- Multi-currency support
- Invoice templates
- Payment tracking
- Expense management
- Client portal
- Mobile app

---

## 🎉 You're All Set!

The application is now ready to use. Enjoy managing your invoices!

**Quick Start Command:**
```bash
cd "c:\Users\mahes\OneDrive\Desktop\invoice genertor" && npm install && npm start
```

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Production Ready ✅
