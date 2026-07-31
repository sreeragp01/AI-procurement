# AI Procurement Copilot

AI Procurement Copilot is an AI-powered procurement management SaaS designed for SMBs, manufacturing companies, healthcare facilities, and educational institutions. It streamlines purchasing, vendor management, RFQ bidding, AI quote comparison matrices, contract risk auditing, and procurement decision-making.

---

## 🌟 Key Features

1. **Role-Based Procurement Hub**: Support for System Admin, Procurement Manager, Vendor, and Finance roles.
2. **Vendor Management & AI Scores**: Vendor directory with verified GST/Tax IDs and automated AI quality & delivery scores.
3. **Purchase Request & RFQ Pipeline**: Requisition workflow with priority flags, budget estimators, and RFQ dispatch.
4. **AI Multi-Criteria Quote Comparison**: Evaluates submitted quotations across price, delivery lead time, warranty, payment terms, and commercial risk factors to deliver an Executive AI Recommendation.
5. **Contract Risk Audit Studio**: Detects missing indemnity/delay penalty clauses and highlights legal risk scores.
6. **AI Procurement Copilot Assistant**: Natural language query interface over database records and spend history.

---

## 🚀 How to Run Locally

### Quick Start (One-Click)
Double-click `start_dev.bat` or run in terminal:
```cmd
start_dev.bat
```

### Manual Start

#### 1. Backend (Django REST Framework)
```bash
cd backend
.\.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000
```
- API Base: `http://127.0.0.1:8000/api/v1/`
- Admin Panel: `http://127.0.0.1:8000/admin/` (Login: `admin@apexprocure.com` / `admin123`)

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:3000/`

---

## 📁 Repository Structure

```
ai-procurement-copilot/
├── backend/
│   ├── config/              # Django Settings & Root URLs
│   ├── apps/
│   │   ├── accounts/        # Custom User & Role Auth
│   │   ├── vendors/         # Vendor & Category Models
│   │   ├── procurement/     # PR, RFQ & Purchase Orders
│   │   ├── quotations/      # Vendor PDF Quotes & Extraction
│   │   ├── contracts/       # Contract Storage & Analysis
│   │   ├── ai_engine/       # Multi-criteria Quote Matrix & Copilot RAG
│   │   └── dashboard/       # Spend Metrics & Analytics APIs
│   ├── seed_data.py         # Database Seeding Script
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/      # Glassmorphic Layout (Header, Sidebar)
    │   ├── context/         # Auth & Role Switcher Context
    │   ├── pages/           # Dashboard, Vendors, PRs, RFQs, AI Quote Matrix, Contract Audit, Copilot Chat
    │   └── services/        # API Client Services
    └── package.json
```
