const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Layout wrapper
const renderPage = (req, res, pageName, title) => {
  const pages = {
    'home': `<h1>Welcome to the International Standards Authority</h1>
<p>The heart of our organization dedicated to maintaining global standards.</p>
<div class="cta-buttons">
  <a href="/submit-report" class="btn btn-primary">Submit a Report</a>
  <a href="/check-status" class="btn btn-secondary">Check Report Status</a>
</div>`,
    
    'about': `<h1>About ISA</h1>
<p>The International Standards Authority is dedicated to establishing and maintaining global standards across all industries.</p>
<h2>Our Mission</h2>
<p>To create a framework of standards that ensure quality, safety, and consistency worldwide.</p>
<h2>Our Vision</h2>
<p>A world where standards drive innovation and protect communities.</p>`,
    
    'divisions': `<h1>ISA Divisions</h1>
<p>Our organization is structured into specialized divisions:</p>
<ul>
  <li>Quality Assurance</li>
  <li>Safety Standards</li>
  <li>Environmental Compliance</li>
  <li>Technical Innovation</li>
  <li>Industry Relations</li>
</ul>`,
    
    'submit-report': `<h1>Submit a Report</h1>
<p>Report standards violations, compliance issues, or quality concerns.</p>
<form method="POST" action="/api/submit-report" class="report-form">
  <div class="form-group">
    <label for="name">Full Name *</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
    <label for="category">Category *</label>
    <select id="category" name="category" required>
      <option value="">Select a category</option>
      <option value="quality">Quality Issue</option>
      <option value="safety">Safety Violation</option>
      <option value="compliance">Compliance Issue</option>
      <option value="other">Other</option>
    </select>
  </div>
  <div class="form-group">
    <label for="description">Description *</label>
    <textarea id="description" name="description" rows="5" required></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Submit Report</button>
</form>`,
    
    'check-status': `<h1>Check Report Status</h1>
<p>Enter your report ID to check the current status of your submission.</p>
<form method="GET" action="/api/status" class="status-form">
  <div class="form-group">
    <label for="reportId">Report ID *</label>
    <input type="text" id="reportId" name="reportId" placeholder="e.g., RPT-2026-001" required>
  </div>
  <button type="submit" class="btn btn-primary">Check Status</button>
</form>`,
    
    'login': `<h1>Staff Login</h1>
<form method="POST" action="/api/staff/login" class="login-form">
  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
    <label for="password">Password *</label>
    <input type="password" id="password" name="password" required>
  </div>
  <button type="submit" class="btn btn-primary">Login</button>
</form>`,
    
    'dashboard': `<h1>Staff Dashboard</h1>
<p>Welcome to the ISA Staff Portal. Select an option below:</p>
<div class="dashboard-grid">
  <div class="dashboard-card">
    <h2>Reports</h2>
    <p>Manage incoming reports and submissions</p>
    <a href="/staff/reports" class="btn btn-secondary">View Reports</a>
  </div>
  <div class="dashboard-card">
    <h2>Cases</h2>
    <p>Track and manage investigation cases</p>
    <a href="/staff/cases" class="btn btn-secondary">View Cases</a>
  </div>
  <div class="dashboard-card">
    <h2>Evidence</h2>
    <p>Manage case evidence and documentation</p>
    <a href="/staff/evidence" class="btn btn-secondary">View Evidence</a>
  </div>
  <div class="dashboard-card">
    <h2>Staff Directory</h2>
    <p>View team members and contact info</p>
    <a href="/staff/members" class="btn btn-secondary">View Staff</a>
  </div>
  <div class="dashboard-card">
    <h2>Audit Logs</h2>
    <p>Review system activity and changes</p>
    <a href="/staff/audit-logs" class="btn btn-secondary">View Logs</a>
  </div>
</div>`,
    
    'reports': `<h1>Reports Management</h1>
<p>View and manage all submitted reports.</p>
<div class="controls">
  <input type="search" id="search" placeholder="Search reports...">
  <select id="filter">
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="in-review">In Review</option>
    <option value="resolved">Resolved</option>
  </select>
</div>
<table class="reports-table">
  <thead>
    <tr>
      <th>Report ID</th>
      <th>Submitter</th>
      <th>Category</th>
      <th>Status</th>
      <th>Date</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Reports will be populated here -->
  </tbody>
</table>`,
    
    'cases': `<h1>Cases Management</h1>
<p>Track and manage investigation cases.</p>
<div class="controls">
  <a href="#new-case" class="btn btn-primary">Create New Case</a>
  <input type="search" id="search" placeholder="Search cases...">
</div>
<table class="cases-table">
  <thead>
    <tr>
      <th>Case ID</th>
      <th>Description</th>
      <th>Status</th>
      <th>Assigned To</th>
      <th>Created</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Cases will be populated here -->
  </tbody>
</table>`,
    
    'evidence': `<h1>Evidence Management</h1>
<p>Store and manage case evidence and documentation.</p>
<div class="controls">
  <input type="text" id="caseFilter" placeholder="Filter by case ID...">
  <input type="file" id="uploadEvidence" multiple>
  <button class="btn btn-primary">Upload Evidence</button>
</div>
<table class="evidence-table">
  <thead>
    <tr>
      <th>Evidence ID</th>
      <th>Case ID</th>
      <th>File Name</th>
      <th>Type</th>
      <th>Uploaded</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <!-- Evidence will be populated here -->
  </tbody>
</table>`,
    
    'staff': `<h1>Staff Directory</h1>
<p>View all team members and contact information.</p>
<div class="controls">
  <input type="search" id="search" placeholder="Search staff...">
  <select id="departmentFilter">
    <option value="">All Departments</option>
    <option value="quality">Quality Assurance</option>
    <option value="safety">Safety Standards</option>
    <option value="compliance">Environmental Compliance</option>
    <option value="innovation">Technical Innovation</option>
    <option value="relations">Industry Relations</option>
  </select>
</div>
<div class="staff-grid">
  <!-- Staff members will be populated here -->
</div>`,
    
    'audit-logs': `<h1>Audit Logs</h1>
<p>Review system activity and changes.</p>
<div class="controls">
  <input type="search" id="search" placeholder="Search logs...">
  <input type="date" id="dateFilter">
  <select id="actionFilter">
    <option value="">All Actions</option>
    <option value="create">Create</option>
    <option value="update">Update</option>
    <option value="delete">Delete</option>
    <option value="view">View</option>
    <option value="login">Login</option>
  </select>
</div>
<table class="audit-table">
  <thead>
    <tr>
      <th>Timestamp</th>
      <th>User</th>
      <th>Action</th>
      <th>Resource</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <!-- Logs will be populated here -->
  </tbody>
</table>`,
    
    '404': `<h1>404 - Page Not Found</h1>
<p>The page you're looking for doesn't exist.</p>
<a href="/" class="btn btn-primary">Return to Home</a>`
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'ISA'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Navigation */
    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: #3498db;
    }

    /* Main Content */
    main {
      min-height: calc(100vh - 200px);
      padding: 3rem 0;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    h2 {
      color: #34495e;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 1rem;
      color: #555;
    }

    ul {
      margin-left: 2rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
    }

    /* Forms */
    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="date"],
    input[type="search"],
    input[type="file"],
    select,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }

    /* Buttons */
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.3s;
      font-weight: 500;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #7f8c8d;
    }

    /* CTA Buttons */
    .cta-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    /* Dashboard */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .dashboard-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .dashboard-card h2 {
      margin-top: 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-top: 2rem;
    }

    thead {
      background-color: #2c3e50;
      color: white;
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    /* Controls */
    .controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .controls input,
    .controls select {
      flex: 1;
      min-width: 200px;
    }

    /* Staff Grid */
    .staff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    /* Footer */
    footer {
      background-color: #2c3e50;
      color: white;
      text-align: center;
      padding: 2rem 0;
      margin-top: 4rem;
    }

    footer p {
      margin-bottom: 0;
      color: #bdc3c7;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-links {
        flex-direction: column;
        gap: 1rem;
      }

      .cta-buttons {
        flex-direction: column;
      }

      .controls {
        flex-direction: column;
      }

      .controls input,
      .controls select {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="container">
      <a href="/" class="logo">ISA</a>
      <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/divisions">Divisions</a></li>
        <li><a href="/submit-report">Submit Report</a></li>
        <li><a href="/check-status">Status</a></li>
        <li><a href="/staff/login">Staff</a></li>
      </ul>
    </div>
  </nav>

  <main class="container">
    ${pages[pageName] || pages['404']}
  </main>

  <footer>
    <p>&copy; 2026 International Standards Authority. All rights reserved.</p>
  </footer>
</body>
</html>`;

  res.send(html);
};

// Routes - Public
app.get('/', (req, res) => renderPage(req, res, 'home', 'Home - ISA'));
app.get('/about', (req, res) => renderPage(req, res, 'about', 'About ISA'));
app.get('/divisions', (req, res) => renderPage(req, res, 'divisions', 'Divisions - ISA'));
app.get('/submit-report', (req, res) => renderPage(req, res, 'submit-report', 'Submit Report - ISA'));
app.get('/check-status', (req, res) => renderPage(req, res, 'check-status', 'Check Status - ISA'));

// Routes - Staff (Protected)
app.get('/staff/login', (req, res) => renderPage(req, res, 'login', 'Staff Login - ISA'));
app.get('/staff/dashboard', (req, res) => renderPage(req, res, 'dashboard', 'Dashboard - ISA'));
app.get('/staff/reports', (req, res) => renderPage(req, res, 'reports', 'Reports - ISA'));
app.get('/staff/cases', (req, res) => renderPage(req, res, 'cases', 'Cases - ISA'));
app.get('/staff/evidence', (req, res) => renderPage(req, res, 'evidence', 'Evidence - ISA'));
app.get('/staff/members', (req, res) => renderPage(req, res, 'staff', 'Staff Directory - ISA'));
app.get('/staff/audit-logs', (req, res) => renderPage(req, res, 'audit-logs', 'Audit Logs - ISA'));

// 404 Handler
app.use((req, res) => {
  renderPage(req, res, '404', '404 - Page Not Found');
});

app.listen(PORT, () => {
  console.log(`ISA Website running on http://localhost:${PORT}`);
});
