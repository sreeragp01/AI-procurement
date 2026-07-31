import React, { useEffect, useState } from 'react';
import { fetchAIQuoteComparison } from '../services/api';
import { Dropzone } from '../components/common/Dropzone';
import { 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  ShieldAlert, 
  FileText, 
  DollarSign,
  Clock,
  ShieldCheck,
  Check,
  Upload,
  Plus,
  Truck,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIQuoteComparison = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    rfq_id: "RFQ-2026-0001",
    quotations_evaluated: 2,
    best_price_vendor: "TechCorp Hardware Ltd",
    fastest_delivery_vendor: "Nexus Digital Solutions",
    best_overall_vendor: "TechCorp Hardware Ltd",
    executive_summary: "AI Procurement Copilot Recommendation:\n1. Best Financial Value: TechCorp Hardware Ltd at ₹3,600,000.00 (Save ₹250,000).\n2. Commercial Risk Alert: Nexus Digital demands 100% upfront advance payment prior to dispatch.\n3. Final Decision: Award to TechCorp Hardware Ltd based on 24-month warranty and 10% lower cost.",
    comparison_matrix: [
      {
        quotation_id: "q1",
        vendor_id: "v1",
        vendor_name: "TechCorp Hardware Ltd",
        vendor_rating: 4.85,
        total_price: 3600000,
        currency: "INR",
        delivery_days: 5,
        warranty_months: 24,
        payment_terms: "20% Advance, 80% Net 30 days after inspection",
        risk_level: "LOW",
        risk_reasons: [
          "Favorable commercial terms: Net 30 days payment post inspection.",
          "Extended 24-month onsite warranty included.",
          "Verified rating 4.85/5 with 98% quality score."
        ],
        is_best_price: true,
        is_fastest_delivery: false
      },
      {
        quotation_id: "q2",
        vendor_id: "v2",
        vendor_name: "Nexus Digital Solutions",
        vendor_rating: 4.60,
        total_price: 3850000,
        currency: "INR",
        delivery_days: 3,
        warranty_months: 12,
        payment_terms: "100% Advance Payment on Order Confirmation",
        risk_level: "HIGH",
        risk_reasons: [
          "HIGH RISK: Demands 100% upfront advance payment prior to dispatch.",
          "Price is ₹250,000 higher than TechCorp offer.",
          "Shorter warranty duration of 12 months."
        ],
        is_best_price: false,
        is_fastest_delivery: true
      }
    ]
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [vendorName, setVendorName] = useState("Apex Industrial Supplies");
  const [awarded, setAwarded] = useState(false);

  useEffect(() => {
    fetchAIQuoteComparison().then(res => {
      if (res && res.comparison_matrix) {
        setData(res);
      }
    });
  }, []);

  const handleAwardRFQ = () => {
    setAwarded(true);
  };

  const handleUploadParsed = (file) => {
    const newQuote = {
      quotation_id: `q-${Date.now()}`,
      vendor_id: `v-${Date.now()}`,
      vendor_name: vendorName || "Uploaded Vendor Quote",
      vendor_rating: 4.70,
      total_price: 3450000,
      currency: "INR",
      delivery_days: 4,
      warranty_months: 36,
      payment_terms: "10% Advance, 90% Net 30",
      risk_level: "LOW",
      risk_reasons: [
        "Parsed from uploaded PDF: Lowest price submitted (₹3,450,000).",
        "Extended 36-month warranty extracted from document.",
        "Verified low commercial risk terms."
      ],
      is_best_price: true,
      is_fastest_delivery: false
    };

    const updatedMatrix = data.comparison_matrix.map(item => ({ ...item, is_best_price: false }));
    updatedMatrix.unshift(newQuote);

    setData({
      ...data,
      best_price_vendor: newQuote.vendor_name,
      best_overall_vendor: newQuote.vendor_name,
      executive_summary: `AI Procurement Copilot Recommendation:\n1. New Lowest Quote Extracted: ${newQuote.vendor_name} at ₹3,450,000 (Saves ₹150,000 vs TechCorp).\n2. 36-Month Warranty parsed from PDF document.\n3. Final Decision: Award to ${newQuote.vendor_name} for maximum cost savings.`,
      comparison_matrix: updatedMatrix
    });

    setTimeout(() => {
      setShowUploadModal(false);
    }, 1500);
  };

  return (
    <div>
      {/* Page Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-indigo">AI Unique Feature</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Evaluating RFQ-2026-0001</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>AI Multi-Criteria Quote Comparison</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>
            <Upload size={16} /> Upload Quote PDF
          </button>

          {awarded ? (
            <button className="btn btn-emerald" onClick={() => navigate('/purchase-orders')}>
              <Truck size={16} /> Track PO-2026-0001 <ArrowRight size={14} />
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleAwardRFQ}
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Award size={18} /> Award RFQ & Generate PO
            </button>
          )}
        </div>
      </div>

      {/* AI Executive Recommendation Banner */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--primary-glow)'
          }}>
            <Sparkles size={24} color="#FFF" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>AI Executive Recommendation</h2>
              <span className="badge badge-emerald">Optimal Cost-Risk Balance</span>
            </div>
            
            <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {data.executive_summary}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid Matrix Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {data.comparison_matrix.map((q) => (
          <div 
            key={q.quotation_id} 
            className="glass-panel" 
            style={{
              padding: '1.75rem',
              border: q.is_best_price ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
              position: 'relative'
            }}
          >
            {q.is_best_price && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                background: 'var(--accent-emerald)',
                color: '#FFF',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.2rem 0.75rem',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                🏆 Recommended Winner
              </div>
            )}

            {/* Vendor Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>{q.vendor_name}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                ⭐ {q.vendor_rating} / 5.0 Rating • Verified Supplier
              </div>
            </div>

            {/* Key Comparison Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: q.is_best_price ? 'rgba(16, 185, 129, 0.12)' : 'rgba(30, 41, 59, 0.6)',
                border: q.is_best_price ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quoted Price</span>
                <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: q.is_best_price ? '#34D399' : '#FFF' }}>
                  ₹{q.total_price.toLocaleString()}
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Delivery Lead Time</div>
                  <strong style={{ fontSize: '1rem', color: q.is_fastest_delivery ? '#818CF8' : '#FFF' }}>
                    {q.delivery_days} Days
                  </strong>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Warranty Period</div>
                  <strong style={{ fontSize: '1rem', color: '#FFF' }}>
                    {q.warranty_months} Months
                  </strong>
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Payment Terms</div>
                <div style={{ fontSize: '0.85rem', color: '#FFF', fontWeight: 600 }}>{q.payment_terms}</div>
              </div>
            </div>

            {/* AI Risk Assessment */}
            <div style={{ background: q.risk_level === 'HIGH' ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: q.risk_level === 'HIGH' ? '1px solid rgba(244, 63, 94, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>AI Risk Evaluation</span>
                <span className={`badge ${q.risk_level === 'HIGH' ? 'badge-rose' : 'badge-emerald'}`}>
                  {q.risk_level} RISK
                </span>
              </div>

              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {q.risk_reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Quote PDF Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '500px', padding: '2rem', background: '#0F172A', border: '1px solid var(--border-glow)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginBottom: '1.25rem' }}>Upload Vendor Quotation PDF</h2>
            
            <div className="form-group">
              <label className="form-label">Vendor Name</label>
              <input 
                type="text" 
                value={vendorName} 
                onChange={(e) => setVendorName(e.target.value)} 
                className="form-input" 
                placeholder="e.g. Apex Industrial Supplies" 
              />
            </div>

            <Dropzone 
              onFileUpload={handleUploadParsed} 
              label="Drop Vendor Quote PDF (or click to browse)" 
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
