import React from 'react';
import { FileCheck2, Scale, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RFQs = () => {
  const navigate = useNavigate();

  const rfqs = [
    {
      id: "rfq1",
      rfq_number: "RFQ-2026-0001",
      pr_number: "PR-2026-0001",
      title: "Procurement of 20 Developer Laptops (M3 / 32GB RAM)",
      invited_count: 2,
      deadline: "2026-08-10 18:00",
      status: "EVALUATED",
      quotes_count: 2,
      best_price: "₹3,600,000"
    },
    {
      id: "rfq2",
      rfq_number: "RFQ-2026-0002",
      pr_number: "PR-2026-0002",
      title: "Industrial Grade Fasteners & Steel Cables",
      invited_count: 3,
      deadline: "2026-08-12 18:00",
      status: "PUBLISHED",
      quotes_count: 1,
      best_price: "Pending Submissions"
    }
  ];

  return (
    <div>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>RFQs & Vendor Bidding</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Request for Quotations dispatched to vendors with deadline tracking.
          </p>
        </div>
        <button className="btn btn-emerald" onClick={() => navigate('/ai-quote-comparison')}>
          <Scale size={16} /> Open AI Decision Matrix
        </button>
      </div>

      {/* RFQ Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {rfqs.map((r) => (
          <div key={r.id} className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileCheck2 size={24} color="#818CF8" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                  <strong style={{ fontSize: '1.1rem', color: '#FFF' }}>{r.rfq_number}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Linked to {r.pr_number}</span>
                  <span className={`badge ${r.status === 'EVALUATED' ? 'badge-emerald' : 'badge-amber'}`}>
                    {r.status === 'EVALUATED' ? 'AI Matrix Generated' : 'Bidding Open'}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {r.title}
                </h3>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={14} /> Invited Vendors: <strong style={{ color: '#FFF' }}>{r.invited_count}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} /> Deadline: <strong style={{ color: '#FFF' }}>{r.deadline}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} color="#34D399" /> Quotes Uploaded: <strong style={{ color: '#34D399' }}>{r.quotes_count}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Best Price Submitted</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34D399' }}>{r.best_price}</div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                onClick={() => navigate('/ai-quote-comparison')}
              >
                <span>Evaluate AI Comparison</span> <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
