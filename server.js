const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Page content
const pages = {
  'home': {
    title: 'Home - ISA',
    content: `<h1>Welcome to the International Standards Authority</h1>
<p>The heart of our organization dedicated to maintaining global standards.</p>
<div class="cta-buttons">
  <a href="/submit-report" class="btn btn-primary">Submit a Report</a>
  <a href="/check-status" class="btn btn-secondary">Check Report Status</a>
</div>`
  },
  'about': {
    title: 'About ISA',
    content: `<h1>About ISA</h1>
<p>The International Standards Authority is dedicated to establishing and maintaining global standards across all industries.</p>
<h2>Our Mission</h2>
<p>To create a framework of standards that ensure quality, safety, and consistency worldwide.</p>
<h2>Our Vision</h2>
<p>A world where standards drive innovation and protect communities.</p>`
  },
  'divisions': {
    title: 'Divisions - ISA',
    content: `<h1>ISA Divisions</h1>
<p>Our organization is structured into specialized divisions:</p>
<ul>
  <li>Quality Assurance</li>
  <li>Safety Standards</li>
  <li>Environmental Compliance</li>
  <li>Technical Innovation</li>
  <li>Industry Relations</li>
</ul>`
  },
  'submit-report': {
    title: 'Submit Report - ISA',
    content: `<h1>Submit a Report</h1>
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
</form>`
  },
  'check-status': {
    title: 'Check Status - ISA',
    content: `<h1>Check Report Status</h1>
<p>Enter your report ID to check the current status of your submission.</p>
<form method="GET" action="/api/status" class="status-form">
  <div class="form-group">
    <label for="reportId">Report ID *</label>
    <input type="text" id="reportId" name="reportId" placeholder="e.g., RPT-2026-001" required>
  </div>
  <button type="submit" class="btn btn-primary">Check Status</button>
</form>`
  },
  'login': {
    title: 'Staff Login - ISA',
    content: `<h1>Staff Login</h1>
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
</form>`
  },
  'dashboard': {
    title: 'Dashboard - ISA',
    content: `<h1>Staff Dashboard</h1>
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
</div>`
  },
  'reports': {
    title: 'Reports - ISA',
    content: `<h1>Reports Management</h1>
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
    <tr>
      <td>RPT-2026-001</td>
      <td>John Doe</td>
      <td>Quality Issue</td>
      <td><span class="status-pending">Pending</span></td>
      <td>2026-08-28</td>
      <td><a href="#" class="action-link">View</a></td>
    </tr>
  </tbody>
</table>`
  },
  'cases': {
    title: 'Cases - ISA',
    content: `<h1>Cases Management</h1>
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
    <tr>
      <td>CASE-2026-001</td>
      <td>Quality Standards Violation</td>
      <td><span class="status-open">Open</span></td>
      <td>Jane Smith</td>
      <td>2026-08-25</td>
      <td><a href="#" class="action-link">View</a></td>
    </tr>
  </tbody>
</table>`
  },
  'evidence': {
    title: 'Evidence - ISA',
    content: `<h1>Evidence Management</h1>
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
    <tr>
      <td>EV-2026-001</td>
      <td>CASE-2026-001</td>
      <td>Inspection_Report.pdf</td>
      <td>PDF</td>
      <td>2026-08-26</td>
      <td><a href="#" class="action-link">Download</a></td>
    </tr>
  </tbody>
</table>`
  },
  'staff': {
    title: 'Staff Directory - ISA',
    content: `<h1>Staff Directory</h1>
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
  <div class="staff-card">
    <h3>Jane Smith</h3>
    <p>Director of Quality Assurance</p>
    <p><strong>Email:</strong> jane.smith@isa.org</p>
  </div>
  <div class="staff-card">
    <h3>Robert Johnson</h3>
    <p>Safety Standards Manager</p>
    <p><strong>Email:</strong> r.johnson@isa.org</p>
  </div>
</div>`
  },
  'audit-logs': {
    title: 'Audit Logs - ISA',
    content: `<h1>Audit Logs</h1>
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
    <tr>
      <td>2026-08-28 10:30 AM</td>
      <td>jane.smith@isa.org</td>
      <td>CREATE</td>
      <td>Report</td>
      <td>Created new report RPT-2026-001</td>
    </tr>
  </tbody>
</table>`
  },
  '404': {
    title: '404 - Page Not Found',
    content: `<h1>404 - Page Not Found</h1>
<p>The page you're looking for doesn't exist.</p>
<a href="/" class="btn btn-primary">Return to Home</a>`
  }
};

const renderPage = (pageName) => {
  const pageData = pages[pageName] || pages['404'];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageData.title}</title>
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
      flex-wrap: wrap;
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
      flex-wrap: wrap;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
    }
    .nav-links a:hover {
      color: #3498db;
    }
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
    h3 {
      color: #2c3e50;
      margin-top: 1rem;
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
    .cta-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }
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
    .action-link {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
    }
    .action-link:hover {
      text-decoration: underline;
    }
    .status-pending {
      background-color: #f39c12;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 3px;
      font-size: 0.9rem;
    }
    .status-open {
      background-color: #e74c3c;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 3px;
      font-size: 0.9rem;
    }
    .controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .controls input,
    .controls select,
    .controls button {
      flex: 1;
      min-width: 200px;
    }
    .staff-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .staff-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .staff-card h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .staff-card p {
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
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
      .controls select,
      .controls button {
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
    ${pageData.content}
  </main>
  <footer>
    <p>&copy; 2026 International Standards Authority. All rights reserved.</p>
  </footer>
</body>
</html>`;
};

// Routes
app.get('/', (req, res) => res.send(renderPage('home')));
app.get('/about', (req, res) => res.send(renderPage('about')));
app.get('/divisions', (req, res) => res.send(renderPage('divisions')));
app.get('/submit-report', (req, res) => res.send(renderPage('submit-report')));
app.get('/check-status', (req, res) => res.send(renderPage('check-status')));
app.get('/staff/login', (req, res) => res.send(renderPage('login')));
app.get('/staff/dashboard', (req, res) => res.send(renderPage('dashboard')));
app.get('/staff/reports', (req, res) => res.send(renderPage('reports')));
app.get('/staff/cases', (req, res) => res.send(renderPage('cases')));
app.get('/staff/evidence', (req, res) => res.send(renderPage('evidence')));
app.get('/staff/members', (req, res) => res.send(renderPage('staff')));
app.get('/staff/audit-logs', (req, res) => res.send(renderPage('audit-logs')));

app.post('/api/submit-report', (req, res) => {
  res.json({ message: 'Report received', status: 'pending' });
});

app.post('/api/staff/login', (req, res) => {
  res.json({ message: 'Login endpoint ready' });
});

app.use((req, res) => {
  res.status(404).send(renderPage('404'));
});

app.listen(PORT, () => {
  console.log(`\n✅ ISA Website running on http://localhost:${PORT}\n`);
});
