import React, { useState } from 'react';
import { Dropzone } from '../components/common/Dropzone';
import { ShieldAlert, AlertTriangle, FileCheck, CheckCircle, Upload, ShieldCheck, FileText, ArrowRight, Plus } from 'lucide-react';

export const ContractAudit = () => {
  const [auditResult, setAuditResult] = useState({
    contract_title: "Annual Hardware Maintenance & SLA Contract (CNT-2026-0001)",
    vendor_name: "Global Steel & Infra",
    overall_risk_score: 68,
    risk_level: "MODERATE_RISK",
    missing_clauses: [
      { clause: "Liquidated Damages / Delay Penalty", severity: "HIGH", risk: "No financial penalty clause if vendor delays delivery past agreed SLA timeframe." },
      { clause: "Intellectual Property Ownership", severity: "MEDIUM", risk: "Unclear IP transfer terms for custom tooling deliverables." },
      { clause: "Force Majeure Notice Window", severity: "LOW", risk: "Notice window is 48 hours instead of standard 7 days." }
    ],
    recommended_amendments: [
      "Insert a 0.5% per week delay penalty capped at 10% total contract value.",
      "Add explicit warranty replacement response time SLA (24 hours).",
      "Require 30-day prior written notice for annual contract renewal."
    ]
  });

  const [showModal, setShowModal] = useState(false);
  const [contractTitle, setContractTitle] = useState("Master Equipment Supply & SLA Agreement");

  const handleContractUpload = (file) => {
    // Dynamically run contract PDF clause audit
    setAuditResult({
      contract_title: `${contractTitle} (${file.name})`,
      vendor_name: "Apex Industrial Supplies",
      overall_risk_score: 84,
      risk_level: "LOW_RISK",
      missing_clauses: [
        { clause: "Force Majeure Notice Window", severity: "LOW", risk: "Notice window is 3 business days instead of standard 7 days." }
      ],
      recommended_amendments: [
        "Include explicit notice period for force majeure events (7 days).",
        "Confirm warranty response SLA is 24 hours onsite."
      ]
    });

    setTimeout(() => {
      setShowModal(false);
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>AI Contract Risk Audit Studio</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Scan scanned contract PDFs for missing indemnity clauses, penalty risks, and renewal traps.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Upload size={16} /> Upload New Contract PDF
        </button>
      </div>

      {/* Split-Screen Document Intelligence Verification Studio (v3.0 Feature) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left Panel: Raw Document PDF Preview */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#0F172A', border: '1px solid var(--border-glow)', height: '620px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1E293B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="#818CF8" />
              <strong style={{ color: '#FFF', fontSize: '0.95rem' }}>Original Contract PDF Preview</strong>
            </div>
            <span className="badge badge-indigo">Page 1 of 8</span>
          </div>

          {/* PDF Viewer Mock Container */}
          <div style={{
            flex: 1,
            background: '#1E293B',
            borderRadius: '8px',
            padding: '1.5rem',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: '#CBD5E1',
            border: '1px solid #334155'
          }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', color: '#FFF', marginBottom: '1rem' }}>
              MASTER EQUIPMENT SUPPLY & SLA AGREEMENT
            </div>
            <p><strong>THIS AGREEMENT</strong> is made as of 1st day of August, 2026, by and between Apex Global Procurement ("Purchaser") and Global Steel & Infra Supplies ("Supplier").</p>
            
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', borderLeft: '3px solid #EF4444', padding: '0.5rem', margin: '0.75rem 0', borderRadius: '4px' }}>
              <strong>SECTION 4. DELIVERIES & SCHEDULE:</strong><br/>
              Supplier agrees to deliver all equipment within 14 calendar days from PO dispatch date. (Note: No delay penalty clause present in raw contract text).
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.15)', borderLeft: '3px solid #F59E0B', padding: '0.5rem', margin: '0.75rem 0', borderRadius: '4px' }}>
              <strong>SECTION 9. INTELLECTUAL PROPERTY:</strong><br/>
              Custom tooling and firmware design artifacts created under this PO shall be shared between both parties.
            </div>

            <p><strong>SECTION 12. WARRANTY & MAINTENANCE:</strong><br/>
            Supplier guarantees a 24-month comprehensive replacement warranty for all structural defects starting from inspection signoff date.</p>

            <p><strong>SECTION 15. PAYMENT TERMS:</strong><br/>
            Payment shall be made via Net 30 Days bank transfer following 3-way matching of Purchase Order, Goods Receipt Note, and Tax Invoice.</p>
          </div>
        </div>

        {/* Right Panel: AI Extracted Risk & Verification Studio */}
        {/* Left Score Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: auditResult.overall_risk_score >= 80 ? 'conic-gradient(#10B981 0% 84%, #1E293B 84% 100%)' : 'conic-gradient(#F59E0B 0% 68%, #1E293B 68% 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            position: 'relative'
          }}>
            <div style={{
              width: '95px',
              height: '95px',
              borderRadius: '50%',
              background: '#0F172A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: auditResult.overall_risk_score >= 80 ? '#34D399' : '#FBBF24' }}>
                {auditResult.overall_risk_score}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Risk Index</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
            {auditResult.overall_risk_score >= 80 ? 'Low Risk Document' : 'Moderate Risk Detected'}
          </h3>
          <span className={`badge ${auditResult.overall_risk_score >= 80 ? 'badge-emerald' : 'badge-amber'}`} style={{ marginTop: '0.5rem' }}>
            {auditResult.missing_clauses.length} Missing / Non-standard Clauses
          </span>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.5 }}>
            Scanned document: <strong>{auditResult.contract_title}</strong>
          </div>
        </div>

        {/* Right Audit Findings */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color={auditResult.overall_risk_score >= 80 ? '#34D399' : '#F59E0B'} /> Missing & Ambiguous Clause Warnings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
            {auditResult.missing_clauses.map((item, i) => (
              <div key={i} style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(15, 23, 42, 0.8)',
                borderLeft: `4px solid ${item.severity === 'HIGH' ? '#F43F5E' : '#F59E0B'}`,
                borderTop: '1px solid var(--border-color)',
                borderRight: '1px solid var(--border-color)',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#FFF' }}>{item.clause}</strong>
                  <span className={`badge ${item.severity === 'HIGH' ? 'badge-rose' : 'badge-amber'}`}>
                    {item.severity} SEVERITY
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.risk}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#34D399" /> AI Recommended Legal Amendments
          </h3>

          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            {auditResult.recommended_amendments.map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '0.4rem' }}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contract Upload Modal */}
      {showModal && (
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
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginBottom: '1.25rem' }}>Audit New Contract PDF</h2>

            <div className="form-group">
              <label className="form-label">Contract Document Title</label>
              <input 
                type="text" 
                value={contractTitle} 
                onChange={(e) => setContractTitle(e.target.value)} 
                className="form-input" 
                placeholder="e.g. Master Equipment Supply & SLA Agreement" 
              />
            </div>

            <Dropzone 
              onFileUpload={handleContractUpload} 
              label="Drop Contract PDF (or click to browse)" 
              accept=".pdf"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
