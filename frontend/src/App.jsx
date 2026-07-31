import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Vendors } from './pages/Vendors';
import { PurchaseRequests } from './pages/PurchaseRequests';
import { RFQs } from './pages/RFQs';
import { AIQuoteComparison } from './pages/AIQuoteComparison';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { ContractAudit } from './pages/ContractAudit';
import { AICopilotChat } from './pages/AICopilotChat';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="purchase-requests" element={<PurchaseRequests />} />
            <Route path="rfqs" element={<RFQs />} />
            <Route path="ai-quote-comparison" element={<AIQuoteComparison />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="contract-audit" element={<ContractAudit />} />
            <Route path="copilot-chat" element={<AICopilotChat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
