import React, { useState, useEffect } from 'react';
import { procurementAPI } from '../services/api';
import { CheckCircle2, XCircle, ShieldCheck, Clock, FileText, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';

export const ApprovalCenter = () => {
  const [requests, setRequests] = useState([]);
  const [rules, setRules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovalData();
  }, []);

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      const [prsRes, rulesRes, logsRes] = await Promise.all([
        procurementAPI.getPurchaseRequests().catch(() => ({ data: [] })),
        procurementAPI.getApprovalRules().catch(() => ({ data: [] })),
        procurementAPI.getApprovalLogs().catch(() => ({ data: [] }))
      ]);
      setRequests(Array.isArray(prsRes.data) ? prsRes.data : []);
      setRules(Array.isArray(rulesRes.data) ? rulesRes.data : []);
      setLogs(Array.isArray(logsRes.data) ? logsRes.data : []);
    } catch (err) {
      console.error("Error fetching approval data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await procurementAPI.approvePurchaseRequest(id, { comments: 'Approved via Enterprise Approval Engine' });
      fetchApprovalData();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await procurementAPI.rejectPurchaseRequest(id, { comments: 'Rejected due to budget constraints' });
      fetchApprovalData();
    } catch (err) {
      console.error("Rejection error:", err);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-indigo">Enterprise Governance</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Rule-Based Approval Engine</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Procurement Approval Center</h1>
        </div>
      </div>

      {/* Configurable Threshold Rules Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {(rules || []).map((r) => (
          <div key={r.id} className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid #6366F1' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase' }}>Configured Rule Threshold</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', margin: '0.2rem 0' }}>{r.name}</div>
            <div style={{ fontSize: '0.9rem', color: '#10B981', fontWeight: 700 }}>
              ₹{parseFloat(r.min_amount || 0).toLocaleString()} — ₹{parseFloat(r.max_amount || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <UserCheck size={14} /> Required Role: <strong style={{ color: '#FFF' }}>{r.required_role}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Approval Requests */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem' }}>Pending Requisition Approvals</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {(requests || []).map((pr) => (
          <div key={pr.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                <strong style={{ fontSize: '1.1rem', color: '#FFF' }}>{pr.request_number}</strong>
                <span className={`badge ${pr.priority === 'HIGH' || pr.priority === 'URGENT' ? 'badge-rose' : 'badge-amber'}`}>
                  {pr.priority} PRIORITY
                </span>
                <span className="badge badge-indigo">{pr.department_name || 'IT & Engineering'}</span>
              </div>
              
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {pr.title}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem' }}>
                <span>Requested Budget: <strong style={{ color: '#10B981' }}>₹{parseFloat(pr.total_budget || 0).toLocaleString()}</strong></span>
                <span>Required By: <strong>{pr.required_by_date}</strong></span>
                <span>Requested By: <strong>{pr.created_by_email}</strong></span>
              </div>

              {pr.line_items && pr.line_items.length > 0 && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#0F172A', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Line Item: <strong style={{ color: '#FFF' }}>{pr.line_items[0].item_name}</strong> (x{pr.line_items[0].quantity} {pr.line_items[0].unit_of_measure}) @ ₹{parseFloat(pr.line_items[0].target_unit_price || 0).toLocaleString()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {pr.status === 'APPROVED' ? (
                <span className="badge badge-emerald" style={{ padding: '0.5rem 1rem' }}><CheckCircle2 size={16} /> APPROVED</span>
              ) : pr.status === 'REJECTED' ? (
                <span className="badge badge-rose" style={{ padding: '0.5rem 1rem' }}><XCircle size={16} /> REJECTED</span>
              ) : (
                <>
                  <button className="btn btn-emerald" onClick={() => handleApprove(pr.id)}>
                    <CheckCircle2 size={16} /> Approve PR
                  </button>
                  <button className="btn btn-secondary" style={{ color: '#EF4444' }} onClick={() => handleReject(pr.id)}>
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Trail */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '1rem' }}>Approval Audit Logs</h2>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Requisition</th>
              <th>Approver</th>
              <th>Action</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {(logs || []).map((l) => (
              <tr key={l.id}>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(l.timestamp).toLocaleString()}</td>
                <td><strong>{l.purchase_request}</strong></td>
                <td>{l.approver_name}</td>
                <td>
                  <span className={`badge ${l.action === 'APPROVED' ? 'badge-emerald' : 'badge-rose'}`}>
                    {l.action}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{l.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
