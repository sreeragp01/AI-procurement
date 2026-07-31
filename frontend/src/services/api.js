import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
};

export const vendorsAPI = {
  getVendors: () => api.get('/vendors/'),
  getVendorById: (id) => api.get(`/vendors/${id}/`),
  createVendor: (data) => api.post('/vendors/', data),
  getCategories: () => api.get('/categories/'),
};

export const procurementAPI = {
  // Organizations & Departments
  getOrganizations: () => api.get('/organizations/'),
  getDepartments: () => api.get('/departments/'),

  // Purchase Requests
  getPurchaseRequests: () => api.get('/purchase-requests/'),
  createPurchaseRequest: (data) => api.post('/purchase-requests/', data),
  approvePurchaseRequest: (id, data) => api.post(`/purchase-requests/${id}/approve/`, data),
  rejectPurchaseRequest: (id, data) => api.post(`/purchase-requests/${id}/reject/`, data),
  generateRFQ: (id) => api.post(`/purchase-requests/${id}/generate-rfq/`),

  // Approval Engine & Rules
  getApprovalRules: () => api.get('/approval-rules/'),
  getApprovalLogs: () => api.get('/approval-logs/'),

  // RFQs & Invitations
  getRFQs: () => api.get('/rfqs/'),
  getVendorInvitations: () => api.get('/vendor-invitations/'),

  // Purchase Orders
  getPurchaseOrders: () => api.get('/purchase-orders/'),
  createPOFromQuotation: (data) => api.post('/purchase-orders/create-from-quotation/', data),
  advancePOStatus: (id) => api.post(`/purchase-orders/${id}/advance-status/`),

  // Goods Receipts (GRN)
  getGoodsReceipts: () => api.get('/goods-receipts/'),
  createGoodsReceipt: (data) => api.post('/goods-receipts/', data),

  // Invoices (3-Way Match)
  getInvoices: () => api.get('/invoices/'),
  createInvoice: (data) => api.post('/invoices/', data),

  // Payments
  getPayments: () => api.get('/payments/'),
  createPayment: (data) => api.post('/payments/', data),
};

export const quotationsAPI = {
  getQuotations: (rfqId) => api.get(`/quotations/${rfqId ? `?rfq=${rfqId}` : ''}`),
  uploadQuotationPDF: (formData) => api.post('/quotations/upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const contractsAPI = {
  getContracts: () => api.get('/contracts/'),
  uploadContractPDF: (formData) => api.post('/contracts/upload-audit/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const aiAPI = {
  getQuoteMatrix: (rfqId) => api.get(`/ai/quote-matrix/?rfq_id=${rfqId}`),
  auditContractRisk: (title, vendorId) => api.post('/ai/audit-contract-risk/', { title, vendor_id: vendorId }),
  copilotChat: (query) => api.post('/ai/copilot-chat/', { query }),
};

export const dashboardAPI = {
  getMetrics: () => api.get('/dashboard/metrics/'),
};
