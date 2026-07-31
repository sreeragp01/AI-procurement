import React, { useState } from 'react';
import { ShoppingBag, Truck, CheckCircle, Clock, PackageCheck, AlertCircle, ArrowRight, Printer, Check } from 'lucide-react';
import { POInvoiceModal } from '../components/common/POInvoiceModal';

export const PurchaseOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "po1",
      po_number: "PO-2026-0001",
      rfq_number: "RFQ-2026-0001",
      vendor_name: "TechCorp Hardware Ltd",
      total_amount: 3600000.00,
      delivery_date: "2026-08-20",
      status: "ISSUED", // ISSUED, ACKNOWLEDGED, IN_TRANSIT, DELIVERED, COMPLETED
      created_at: "2026-08-01"
    },
    {
      id: "po2",
      po_number: "PO-2026-0002",
      rfq_number: "RFQ-2026-0002",
      vendor_name: "Global Steel & Infra",
      total_amount: 850000.00,
      delivery_date: "2026-08-15",
      status: "IN_TRANSIT",
      created_at: "2026-07-28"
    }
  ]);

  const [selectedPO, setSelectedPO] = useState(null);

  const stages = [
    { key: "ISSUED", label: "Issued to Vendor" },
    { key: "ACKNOWLEDGED", label: "Vendor Confirmed" },
    { key: "IN_TRANSIT", label: "Shipped / In Transit" },
    { key: "DELIVERED", label: "Delivered & Inspected" },
    { key: "COMPLETED", label: "Completed & Paid" },
  ];

  const advancePOStatus = (orderId) => {
    const statusOrder = ["ISSUED", "ACKNOWLEDGED", "IN_TRANSIT", "DELIVERED", "COMPLETED"];
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const currIdx = statusOrder.indexOf(o.status);
        const nextStatus = currIdx < statusOrder.length - 1 ? statusOrder[currIdx + 1] : o.status;
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  return (
    <div>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>Purchase Order (PO) Lifecycle Tracker</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Track order status from issuance to vendor acknowledgment, transit, delivery, and payment completion.
          </p>
        </div>
      </div>

      {/* PO Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((po) => {
          const currentStageIdx = stages.findIndex(s => s.key === po.status);

          return (
            <div key={po.id} className="glass-panel" style={{ padding: '1.75rem' }}>
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>{po.po_number}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Linked to {po.rfq_number}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#818CF8', fontWeight: 600 }}>
                    Vendor: {po.vendor_name}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total Contract Amount</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>
                    ₹{po.total_amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status Stepper Progress Bar */}
              <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {stages.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIdx;
                    const isCurrent = idx === currentStageIdx;

                    return (
                      <div key={stage.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isCompleted ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#1E293B',
                          border: isCurrent ? '2px solid #6366F1' : '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          boxShadow: isCurrent ? '0 0 12px var(--primary-glow)' : 'none',
                          marginBottom: '0.5rem'
                        }}>
                          {isCompleted ? <Check size={16} /> : idx + 1}
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCompleted ? '#FFF' : 'var(--text-dim)',
                          textAlign: 'center'
                        }}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(30, 41, 59, 0.5)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} /> Expected Delivery Date: <strong style={{ color: '#FFF' }}>{po.delivery_date}</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() => setSelectedPO(po)}
                  >
                    <Printer size={14} /> Print PO Document
                  </button>

                  {po.status !== 'COMPLETED' && (
                    <button 
                      className="btn btn-emerald" 
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => advancePOStatus(po.id)}
                    >
                      <span>Advance Order Status</span> <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PO Printable Invoice Modal */}
      {selectedPO && (
        <POInvoiceModal po={selectedPO} onClose={() => setSelectedPO(null)} />
      )}
    </div>
  );
};
