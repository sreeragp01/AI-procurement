import React, { useState, useEffect } from 'react';
import { procurementAPI } from '../services/api';
import { CreditCard, CheckCircle2, DollarSign, PlusCircle, ArrowUpRight } from 'lucide-react';

export const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await procurementAPI.getPayments();
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-emerald">Financial Settlement</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Disbursement Logs</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Payment Disbursements</h1>
        </div>

        <button className="btn btn-emerald">
          <PlusCircle size={16} /> Process Vendor Payment
        </button>
      </div>

      {/* Payment Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Payment Voucher</th>
              <th>Invoice Reference</th>
              <th>Amount Paid</th>
              <th>Payment Method</th>
              <th>Transaction Ref</th>
              <th>Status</th>
              <th>Date Cleared</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.payment_number}</strong></td>
                <td><span className="badge badge-indigo">{p.invoice_number}</span></td>
                <td style={{ fontWeight: 800, color: '#10B981', fontSize: '1rem' }}>₹{parseFloat(p.amount_paid).toLocaleString()}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.payment_method}</td>
                <td style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#818CF8' }}>{p.transaction_reference || 'N/A'}</td>
                <td>
                  <span className={`badge ${p.status === 'COMPLETED' ? 'badge-emerald' : 'badge-amber'}`}>
                    <CheckCircle2 size={14} /> {p.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
