const API_BASE_URL = '/api/v1';

const customFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  const headers = isFormData
    ? { ...(options.headers || {}) }
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.data = data;
    throw error;
  }

  return { data, status: response.status };
};

export const authAPI = {
  login: (credentials) => customFetch('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => customFetch('/auth/register/', { method: 'POST', body: JSON.stringify(userData) }),
};

export const vendorsAPI = {
  getVendors: () => customFetch('/vendors/'),
  getVendorById: (id) => customFetch(`/vendors/${id}/`),
  createVendor: (data) => customFetch('/vendors/', { method: 'POST', body: JSON.stringify(data) }),
  getCategories: () => customFetch('/categories/'),
};

export const procurementAPI = {
  getOrganizations: () => customFetch('/organizations/'),
  getDepartments: () => customFetch('/departments/'),

  getPurchaseRequests: () => customFetch('/purchase-requests/'),
  createPurchaseRequest: (data) => customFetch('/purchase-requests/', { method: 'POST', body: JSON.stringify(data) }),
  approvePurchaseRequest: (id, data) => customFetch(`/purchase-requests/${id}/approve/`, { method: 'POST', body: JSON.stringify(data || {}) }),
  rejectPurchaseRequest: (id, data) => customFetch(`/purchase-requests/${id}/reject/`, { method: 'POST', body: JSON.stringify(data || {}) }),
  generateRFQ: (id) => customFetch(`/purchase-requests/${id}/generate-rfq/`, { method: 'POST' }),

  getWorkflowRules: () => customFetch('/workflow-rules/'),
  getApprovalRules: () => customFetch('/approval-rules/'),
  getApprovalLogs: () => customFetch('/approval-logs/'),

  getNotifications: () => customFetch('/notifications/'),
  markNotificationRead: (id) => customFetch(`/notifications/${id}/mark-read/`, { method: 'POST' }),

  getRFQs: () => customFetch('/rfqs/'),
  getVendorInvitations: () => customFetch('/vendor-invitations/'),

  getPurchaseOrders: () => customFetch('/purchase-orders/'),
  createPOFromQuotation: (data) => customFetch('/purchase-orders/create-from-quotation/', { method: 'POST', body: JSON.stringify(data) }),
  advancePOStatus: (id) => customFetch(`/purchase-orders/${id}/advance-status/`, { method: 'POST' }),

  getGoodsReceipts: () => customFetch('/goods-receipts/'),
  createGoodsReceipt: (data) => customFetch('/goods-receipts/', { method: 'POST', body: JSON.stringify(data) }),

  getInvoices: () => customFetch('/invoices/'),
  createInvoice: (data) => customFetch('/invoices/', { method: 'POST', body: JSON.stringify(data) }),

  getPayments: () => customFetch('/payments/'),
  createPayment: (data) => customFetch('/payments/', { method: 'POST', body: JSON.stringify(data) }),
};

export const quotationsAPI = {
  getQuotations: (rfqId) => customFetch(`/quotations/${rfqId ? `?rfq=${rfqId}` : ''}`),
  uploadQuotationPDF: (formData) => customFetch('/quotations/upload/', { method: 'POST', body: formData }),
};

export const contractsAPI = {
  getContracts: () => customFetch('/contracts/'),
  uploadContractPDF: (formData) => customFetch('/contracts/upload-audit/', { method: 'POST', body: formData }),
};

export const aiAPI = {
  getQuoteMatrix: (rfqId) => customFetch(`/ai/quote-matrix/${rfqId}/`),
  auditContractRisk: (title, vendorId) => customFetch('/ai/audit-contract-risk/', { method: 'POST', body: JSON.stringify({ title, vendor_id: vendorId }) }),
  copilotChat: (query) => customFetch('/ai/copilot-chat/', { method: 'POST', body: JSON.stringify({ query }) }),
  recommendVendors: (rfqId) => customFetch('/ai/recommend-vendors/', { method: 'POST', body: JSON.stringify({ rfq_id: rfqId }) }),
  getSpendForecasting: () => customFetch('/ai/spend-forecasting/'),
};

export const dashboardAPI = {
  getMetrics: () => customFetch('/dashboard/metrics/'),
};
