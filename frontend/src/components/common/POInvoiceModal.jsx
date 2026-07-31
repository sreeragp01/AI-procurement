import React from 'react';
import { Printer, Download, X, Sparkles, Building2, Calendar, FileText } from 'lucide-react';

export const POInvoiceModal = ({ po, onClose }) => {
  if (!po) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '1rem'
    }}>
      <div style={{
        width: '800px',
        maxHeight: '90vh',
        background: '#FFFFFF',
        color: '#1E293B',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden'
      }}>
        {/* Modal Controls Header */}
        <div style={{
          padding: '1rem 1.5rem',
          background: '#0F172A',
          color: '#FFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>
            <Sparkles size={18} color="#818CF8" /> Official Purchase Order Document — {po.po_number}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-emerald" onClick={handlePrint} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              <Printer size={14} /> Print / Save as PDF
            </button>
            <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-po-document" style={{ padding: '2.5rem', overflowY: 'auto', flex: 1, fontFamily: 'Arial, sans-serif' }}>
          {/* Header Branding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', pb: '1.5rem', paddingBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                APEX GLOBAL PROCUREMENT LTD
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                Corporate Towers, Floor 14, BKC, Mumbai — 400051
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Email: procurement@apexglobal.com | Phone: +91 22 6789 0000
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.3rem', fontWeight: 600 }}>
                GSTIN: 27AAACA1234F1Z9
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase' }}>
                PURCHASE ORDER
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                {po.po_number}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                Date: {po.created_at || '2026-08-01'}
              </div>
            </div>
          </div>

          {/* Vendor & Shipping Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '2rem 0' }}>
            {/* Vendor Info */}
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                VENDOR DETAILS (ISSUED TO):
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{po.vendor_name}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>Bandra Kurla Complex, Mumbai</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>GSTIN: 27AAACT1234F1Z5</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Contact: Vikram Malhotra (+91 98765 43210)</div>
            </div>

            {/* Ship To Info */}
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                DELIVERY & SHIPPING ADDRESS:
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>Apex Central Warehouse #4</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>Logistics Park, MIDC Industrial Zone</div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>Navi Mumbai — 400705</div>
              <div style={{ fontSize: '0.85rem', color: '#4F46E5', fontWeight: 600, marginTop: '0.2rem' }}>
                Delivery Deadline: {po.delivery_date}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ background: '#0F172A', color: '#FFF' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase' }}>#</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase' }}>Item Description</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', textTransform: 'uppercase' }}>Unit Price (₹)</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>1</td>
                <td style={{ padding: '1rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Developer Laptop (M3 Pro, 32GB RAM, 1TB SSD)</strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Includes 24-Month Onsite Warranty & Bag</div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>20</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>152,542.37</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>3,050,847.46</td>
              </tr>
            </tbody>
          </table>

          {/* Totals Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <div style={{ width: '320px', background: '#F8FAFC', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '0.4rem' }}>
                <span>Subtotal (Excl. Tax):</span>
                <span>₹3,050,847.46</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '0.6rem' }}>
                <span>IGST @ 18%:</span>
                <span>₹549,152.54</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', borderTop: '2px solid #E2E8F0', paddingTop: '0.6rem' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#4F46E5' }}>₹{po.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms & Authorization Signatures */}
          <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>TERMS & CONDITIONS:</div>
              <ul style={{ fontSize: '0.75rem', color: '#64748B', paddingLeft: '1.1rem', lineHeight: 1.5 }}>
                <li>Payment terms: 20% Advance, 80% Net 30 days post delivery & inspection.</li>
                <li>Delay penalty: 0.5% per week of delay capped at 10% total order value.</li>
                <li>Invoice must reference PO number {po.po_number}.</li>
              </ul>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <div style={{ borderBottom: '1px dashed #94A3B8', height: '40px', marginBottom: '0.5rem' }}></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Authorized Signatory</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Apex Procurement Committee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
