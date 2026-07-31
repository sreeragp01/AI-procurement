import React, { useState, useEffect } from 'react';
import { vendorsAPI, procurementAPI } from '../services/api';
import { Building2, Send, FileText, CheckCircle2, Upload, DollarSign, Clock, Truck, ShieldCheck, Award } from 'lucide-react';

export const VendorPortal = () => {
  const [openRfqs, setOpenRfqs] = useState([
    {
      id: "rfq1",
      rfq_number: "RFQ-2026-0001",
      title: "Procurement of 20 Developer Laptops (M3 / 32GB RAM)",
      category_name: "IT & Hardware",
      deadline: "2026-08-20",
      status: "OPEN",
      items: [{ item_name: "Developer Laptops (M3 / 32GB RAM)", quantity: 20, unit_of_measure: "Units" }]
    },
    {
      id: "rfq2",
      rfq_number: "RFQ-2026-0002",
      title: "Industrial Grade Fasteners & Steel Cables",
      category_name: "Industrial Raw Materials",
      deadline: "2026-08-15",
      status: "OPEN",
      items: [{ item_name: "High-Tensile Steel Cables", quantity: 500, unit_of_measure: "Meters" }]
    }
  ]);

  const [quoteForm, setQuoteForm] = useState({
    rfq_number: "RFQ-2026-0001",
    vendor_company: "TechCorp Hardware Ltd",
    total_price: 3600000,
    currency: "INR",
    delivery_days: 5,
    warranty_months: 24,
    payment_terms: "20% Advance, 80% Net 30 days post inspection",
    notes: "Includes 24/7 onsite SLA support for all 20 units."
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert(`Quotation submitted successfully for ${quoteForm.rfq_number}! Our procurement team will review your offer.`);
    }, 1000);
  };

  return (
    <div className="page-body">
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-indigo">Version 4.0 Active</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Supplier Self-Service Portal</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>Vendor Bid Submission & Self-Service Portal</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}>
          <Building2 size={20} color="#818CF8" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>Logged Supplier: TechCorp Hardware Ltd</div>
            <div style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 600 }}>⭐ Verified Gold Tier Supplier (Rating: 4.85/5)</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Open RFQ Invitations */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#818CF8" /> Open RFQ Invitations Dispatched to You
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {openRfqs.map((rfq) => (
              <div key={rfq.id} style={{ padding: '1rem', background: '#0F172A', border: '1px solid #1E293B', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '1rem', color: '#818CF8' }}>{rfq.rfq_number}</strong>
                  <span className="badge badge-emerald">Bidding Open</span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginBottom: '0.4rem' }}>
                  {rfq.title}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Category: <strong style={{ color: '#FFF' }}>{rfq.category_name}</strong></span>
                  <span>Submission Deadline: <strong>{rfq.deadline}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Commercial Quotation Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} color="#10B981" /> Submit Commercial Quotation
          </h2>

          <form onSubmit={handleSubmitQuote}>
            <div className="form-group">
              <label className="form-label">Target RFQ Number</label>
              <select 
                value={quoteForm.rfq_number} 
                onChange={(e) => setQuoteForm({...quoteForm, rfq_number: e.target.value})}
                className="form-select"
              >
                <option value="RFQ-2026-0001">RFQ-2026-0001 (Developer Laptops)</option>
                <option value="RFQ-2026-0002">RFQ-2026-0002 (Steel Cables)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Total Quoted Amount</label>
                <input 
                  type="number" 
                  required 
                  value={quoteForm.total_price} 
                  onChange={(e) => setQuoteForm({...quoteForm, total_price: parseFloat(e.target.value) || 0})}
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency</label>
                <select 
                  value={quoteForm.currency} 
                  onChange={(e) => setQuoteForm({...quoteForm, currency: e.target.value})}
                  className="form-select"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Delivery Lead Time (Days)</label>
                <input 
                  type="number" 
                  required 
                  value={quoteForm.delivery_days} 
                  onChange={(e) => setQuoteForm({...quoteForm, delivery_days: parseInt(e.target.value) || 1})}
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Warranty (Months)</label>
                <input 
                  type="number" 
                  required 
                  value={quoteForm.warranty_months} 
                  onChange={(e) => setQuoteForm({...quoteForm, warranty_months: parseInt(e.target.value) || 0})}
                  className="form-input" 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Commercial Payment Terms</label>
              <input 
                type="text" 
                required 
                value={quoteForm.payment_terms} 
                onChange={(e) => setQuoteForm({...quoteForm, payment_terms: e.target.value})}
                className="form-input" 
              />
            </div>

            <button type="submit" className="btn btn-emerald" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submitted}>
              <Send size={16} /> {submitted ? 'Submitting Quote...' : 'Transmit Quotation to Buyer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
