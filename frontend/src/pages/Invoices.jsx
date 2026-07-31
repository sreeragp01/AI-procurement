import React, { useState, useEffect } from 'react';
import { procurementAPI } from '../services/api';
import { FileCheck, CheckCircle2, ShieldAlert, DollarSign, PlusCircle, ArrowRight } from 'lucide-react';

export const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await procurementAPI.getInvoices().catch(() => ({ data: [] }));
      setInvoices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-amber">Accounts Payable</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>3-Way Matching Engine</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Vendor Invoices & 3-Way Matching</h1>
        </div>

        <button className="btn btn-primary">
          <PlusCircle size={16} /> Record Vendor Invoice
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileCheck size={28} color="#FBBF24" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>3-Way Matching Compliance System Active</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Automatically verifies line items and pricing across <strong>Purchase Order (PO)</strong> + <strong>Warehouse Goods Receipt (GRN)</strong> + <strong>Vendor Invoice</strong> before approving payments.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Vendor</th>
              <th>PO Reference</th>
              <th>Total Amount</th>
              <th>IGST Tax</th>
              <th>3-Way Match Status</th>
              <th>Payment Due Date</th>
            </tr>
          </thead>
          <tbody>
            {(invoices || []).map((inv) => (
              <tr key={inv.id}>
                <td><strong>{inv.invoice_number}</strong></td>
                <td>{inv.vendor_name}</td>
                <td><span className="badge badge-indigo">{inv.po_number}</span></td>
                <td style={{ fontWeight: 800, color: '#FFF' }}>₹{parseFloat(inv.invoice_amount || 0).toLocaleString()}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₹{parseFloat(inv.tax_amount || 0).toLocaleString()}</td>
                <td>
                  <span className={`badge ${inv.matching_status === 'MATCHED' ? 'badge-emerald' : 'badge-rose'}`}>
                    <CheckCircle2 size={14} /> {inv.matching_status}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{inv.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
