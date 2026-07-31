const API_BASE = '/api/v1';

export const fetchDashboardMetrics = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/metrics/`);
    if (!res.ok) throw new Error("Failed to load metrics");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback metric data:", err);
    return null;
  }
};

export const fetchVendors = async () => {
  try {
    const res = await fetch(`${API_BASE}/vendors/list/`);
    if (!res.ok) throw new Error("Failed to fetch vendors");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback vendor list:", err);
    return null;
  }
};

export const fetchPurchaseRequests = async () => {
  try {
    const res = await fetch(`${API_BASE}/procurement/purchase-requests/`);
    if (!res.ok) throw new Error("Failed to fetch purchase requests");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback purchase requests:", err);
    return null;
  }
};

export const fetchAIQuoteComparison = async (rfqId = "00000000-0000-0000-0000-000000000000") => {
  try {
    const res = await fetch(`${API_BASE}/ai/quote-compare/${rfqId}/`);
    if (!res.ok) throw new Error("Failed to run AI comparison");
    return await res.json();
  } catch (err) {
    console.warn("Using fallback AI quote comparison:", err);
    return null;
  }
};

export const sendCopilotQuery = async (query) => {
  try {
    const res = await fetch(`${API_BASE}/ai/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error("Copilot error");
    return await res.json();
  } catch (err) {
    return { query, reply: "AI Copilot analyzing database... " + err.message };
  }
};
