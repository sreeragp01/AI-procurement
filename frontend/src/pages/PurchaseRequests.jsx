import React, { useEffect, useState } from 'react';
import { procurementAPI } from '../services/api';
import { ShoppingBag, Plus, Calendar, DollarSign, Tag, CheckCircle2, Clock, Check, X, FileCheck2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PurchaseRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([
    {
      id: "pr1",
      request_number: "PR-2026-0001",
      title: "Procurement of 20 Developer Laptops (M3 / 32GB RAM)",
      category_details: { name: "IT & Hardware" },
      total_budget: "4000000.00",
      required_by_date: "2026-08-20",
      priority: "HIGH",
      status: "RFQ_CREATED",
      created_by_details: { email: "admin@apexprocure.com", first_name: "Sreerag" }
    },
    {
      id: "pr2",
      request_number: "PR-2026-0002",
      title: "Industrial Grade Fasteners & Steel Cables (500 Units)",
      category_details: { name: "Industrial Raw Materials" },
      total_budget: "850000.00",
      required_by_date: "2026-08-15",
      priority: "URGENT",
      status: "PENDING_APPROVAL",
      created_by_details: { email: "finance@apexprocure.com", first_name: "Finance Team" }
    },
    {
      id: "pr3",
      request_number: "PR-2026-0003",
      title: "Ergonomic Office Chairs & Dual Monitor Stands",
      category_details: { name: "Office & Stationery" },
      total_budget: "350000.00",
      required_by_date: "2026-09-01",
      priority: "MEDIUM",
      status: "APPROVED",
      created_by_details: { email: "admin@apexprocure.com", first_name: "Sreerag" }
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newPR, setNewPR] = useState({
    title: '',
    category: 'IT & Hardware',
    quantity: 10,
    estimated_unit_price: 50000,
    required_by_date: '2026-08-25',
    priority: 'HIGH'
  });

  useEffect(() => {
    procurementAPI.getPurchaseRequests().then(res => {
      if (res && res.data && Array.isArray(res.data)) {
        setRequests(res.data);
      }
    }).catch(err => console.error("Error loading purchase requests:", err));
  }, []);

  const approvePR = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const rejectPR = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const generateRFQ = (id) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'RFQ_CREATED' } : r));
    navigate('/rfqs');
  };

  const handleCreatePR = (e) => {
    e.preventDefault();
    const count = requests.length + 1;
    const added = {
      id: `pr-${Date.now()}`,
      request_number: `PR-2026-000${count}`,
      title: newPR.title,
      category_details: { name: newPR.category },
      total_budget: (newPR.quantity * newPR.estimated_unit_price).toFixed(2),
      required_by_date: newPR.required_by_date,
      priority: newPR.priority,
      status: 'PENDING_APPROVAL',
      created_by_details: { email: "admin@apexprocure.com", first_name: "Sreerag" }
    };
    setRequests([added, ...requests]);
    setShowModal(false);
    setNewPR({ title: '', category: 'IT & Hardware', quantity: 10, estimated_unit_price: 50000, required_by_date: '2026-08-25', priority: 'HIGH' });
  };

  return (
    <div>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>Purchase Requests (PR) & Approvals</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Multi-stage approval workflow: Requester ➔ Department Manager ➔ Finance Approval ➔ Auto-RFQ.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Purchase Request
        </button>
      </div>

      {/* Table Panel */}
      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>PR Number</th>
              <th>Requisition Title</th>
              <th>Category</th>
              <th>Total Budget</th>
              <th>Required Date</th>
              <th>Priority</th>
              <th>Approval Status</th>
              <th>Manager Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong style={{ color: '#818CF8' }}>{r.request_number}</strong>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#FFF' }}>{r.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Requested by {r.created_by_details?.first_name || 'User'}</div>
                </td>
                <td>
                  <span className="badge badge-indigo">
                    {r.category_details?.name || "General"}
                  </span>
                </td>
                <td>
                  <strong style={{ color: '#FFF' }}>₹{parseFloat(r.total_budget || 0).toLocaleString()}</strong>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} /> {r.required_by_date}
                  </div>
                </td>
                <td>
                  <span className={`badge ${r.priority === 'URGENT' ? 'badge-rose' : r.priority === 'HIGH' ? 'badge-amber' : 'badge-emerald'}`}>
                    {r.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge ${r.status === 'APPROVED' || r.status === 'RFQ_CREATED' ? 'badge-emerald' : r.status === 'REJECTED' ? 'badge-rose' : 'badge-amber'}`}>
                    {r.status === 'RFQ_CREATED' ? 'RFQ DISPATCHED' : r.status}
                  </span>
                </td>
                <td>
                  {r.status === 'PENDING_APPROVAL' && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-emerald" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => approvePR(r.id)}>
                        <Check size={12} /> Approve
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => rejectPR(r.id)}>
                        <X size={12} /> Reject
                      </button>
                    </div>
                  )}

                  {r.status === 'APPROVED' && (
                    <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => generateRFQ(r.id)}>
                      <FileCheck2 size={12} /> Generate RFQ
                    </button>
                  )}

                  {r.status === 'RFQ_CREATED' && (
                    <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
                      RFQ Active in Bidding
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create PR Modal */}
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
          <div className="glass-panel" style={{ width: '480px', padding: '2rem', background: '#0F172A', border: '1px solid var(--border-glow)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginBottom: '1.25rem' }}>New Purchase Request</h2>

            <form onSubmit={handleCreatePR}>
              <div className="form-group">
                <label className="form-label">Requisition Title / Need</label>
                <input 
                  type="text" 
                  required 
                  value={newPR.title} 
                  onChange={(e) => setNewPR({...newPR, title: e.target.value})} 
                  className="form-input" 
                  placeholder="e.g. Need 20 Laptops for Engineering Team" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  value={newPR.category} 
                  onChange={(e) => setNewPR({...newPR, category: e.target.value})} 
                  className="form-select"
                >
                  <option value="IT & Hardware">IT & Hardware</option>
                  <option value="Industrial Raw Materials">Industrial Raw Materials</option>
                  <option value="Office & Stationery">Office & Stationery</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input 
                    type="number" 
                    required 
                    value={newPR.quantity} 
                    onChange={(e) => setNewPR({...newPR, quantity: parseInt(e.target.value) || 1})} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Est. Unit Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    value={newPR.estimated_unit_price} 
                    onChange={(e) => setNewPR({...newPR, estimated_unit_price: parseFloat(e.target.value) || 0})} 
                    className="form-input" 
                  />
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                Total Estimated Budget: <strong style={{ color: '#818CF8' }}>₹{(newPR.quantity * newPR.estimated_unit_price).toLocaleString()}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Required Date</label>
                  <input 
                    type="date" 
                    required 
                    value={newPR.required_by_date} 
                    onChange={(e) => setNewPR({...newPR, required_by_date: e.target.value})} 
                    className="form-input" 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    value={newPR.priority} 
                    onChange={(e) => setNewPR({...newPR, priority: e.target.value})} 
                    className="form-select"
                  >
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Purchase Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
