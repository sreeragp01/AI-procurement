import React, { useState, useEffect } from 'react';
import { procurementAPI } from '../services/api';
import { PackageCheck, CheckCircle2, ShieldAlert, Truck, PlusCircle, AlertCircle } from 'lucide-react';

export const GoodsReceipts = () => {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGRNs();
  }, []);

  const fetchGRNs = async () => {
    try {
      setLoading(true);
      const res = await procurementAPI.getGoodsReceipts().catch(() => ({ data: [] }));
      setGrns(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching GRNs:", err);
      setGrns([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-emerald">Warehouse & Receiving</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Goods Receipt Notes (GRN)</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Goods Receipt & Quality Inspection</h1>
        </div>

        <button className="btn btn-primary">
          <PlusCircle size={16} /> Record Warehouse Receiving (GRN)
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {(grns || []).map((grn) => (
          <div key={grn.id} className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>{grn.grn_number}</h3>
                  <span className="badge badge-indigo">PO: {grn.po_number}</span>
                  <span className={`badge ${grn.inspection_status === 'PASSED' ? 'badge-emerald' : 'badge-rose'}`}>
                    <CheckCircle2 size={14} /> {grn.inspection_status}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Received Date: <strong>{grn.received_date}</strong> • Inspected By: <strong>{grn.received_by_name}</strong>
                </div>
              </div>
            </div>

            {grn.received_items && grn.received_items.length > 0 && (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Ordered Qty</th>
                    <th>Received Qty</th>
                    <th>Accepted Qty</th>
                    <th>Inspection Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {grn.received_items.map((item, idx) => (
                    <tr key={idx}>
                      <td><strong>{item.item_name}</strong></td>
                      <td>{item.qty_ordered} Units</td>
                      <td style={{ color: '#2563EB', fontWeight: 700 }}>{item.qty_received} Units</td>
                      <td style={{ color: '#10B981', fontWeight: 700 }}>{item.qty_accepted} Units</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
