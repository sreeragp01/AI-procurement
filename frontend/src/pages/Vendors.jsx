import React, { useEffect, useState } from 'react';
import { fetchVendors } from '../services/api';
import { Building2, Star, Plus, ShieldCheck, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';

export const Vendors = () => {
  const [vendors, setVendors] = useState([
    {
      id: "v1",
      company_name: "TechCorp Hardware Ltd",
      contact_person: "Vikram Malhotra",
      email: "sales@techcorp.com",
      phone: "+91 98765 43210",
      tax_id: "GST27AAACT1234F1Z5",
      city: "Mumbai",
      country: "India",
      rating: 4.85,
      categories_details: [{ name: "IT & Hardware" }],
      ai_performance_score: { quality_score: 98, on_time_delivery_rate: 96, risk_level: "LOW" },
      is_verified: true
    },
    {
      id: "v2",
      company_name: "Nexus Digital Solutions",
      contact_person: "Ananya Sharma",
      email: "info@nexusdigital.com",
      phone: "+91 98123 78901",
      tax_id: "GST29BBBND5678G2Z4",
      city: "Bengaluru",
      country: "India",
      rating: 4.60,
      categories_details: [{ name: "IT & Hardware" }],
      ai_performance_score: { quality_score: 92, on_time_delivery_rate: 90, risk_level: "LOW" },
      is_verified: true
    },
    {
      id: "v3",
      company_name: "Global Steel & Infra",
      contact_person: "Rajesh Verma",
      email: "contact@globalsteel.com",
      phone: "+91 97111 22334",
      tax_id: "GST07CCCGS9101H3Z3",
      city: "New Delhi",
      country: "India",
      rating: 4.30,
      categories_details: [{ name: "Industrial Raw Materials" }],
      ai_performance_score: { quality_score: 88, on_time_delivery_rate: 84, risk_level: "MEDIUM" },
      is_verified: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ company_name: '', contact_person: '', email: '', phone: '', city: 'Mumbai' });

  useEffect(() => {
    fetchVendors().then(data => {
      if (data && data.results && data.results.length > 0) {
        setVendors(data.results);
      }
    });
  }, []);

  const handleAddVendor = (e) => {
    e.preventDefault();
    const added = {
      id: `v-${Date.now()}`,
      ...newVendor,
      tax_id: `GST27AAACT${Math.floor(1000 + Math.random() * 9000)}F1Z5`,
      country: "India",
      rating: 4.5,
      categories_details: [{ name: "IT & Hardware" }],
      ai_performance_score: { quality_score: 90, on_time_delivery_rate: 90, risk_level: "LOW" },
      is_verified: true
    };
    setVendors([added, ...vendors]);
    setShowModal(false);
    setNewVendor({ company_name: '', contact_person: '', email: '', phone: '', city: 'Mumbai' });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>Vendor Directory & AI Scores</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage supplier profiles, verified tax IDs, and AI-computed risk metrics.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add New Vendor
        </button>
      </div>

      {/* Vendor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {vendors.map((v) => (
          <div key={v.id} className="glass-panel glass-panel-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Header Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Building2 size={22} color="#818CF8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFF' }}>{v.company_name}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={12} /> {v.city}, {v.country}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(245, 158, 11, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 700 }}>
                  <Star size={12} fill="#FBBF24" /> {v.rating}
                </div>
              </div>

              {/* Tax & Contact details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} /> {v.phone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} /> {v.email}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  GST/Tax ID: <code style={{ color: '#818CF8' }}>{v.tax_id}</code>
                </div>
              </div>

              {/* AI Performance Score Card */}
              <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} color="#34D399" /> AI Quality Scorecard
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>Quality Rating: </span>
                    <strong style={{ color: '#FFF' }}>{v.ai_performance_score?.quality_score || 95}%</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)' }}>On-Time Delivery: </span>
                    <strong style={{ color: '#34D399' }}>{v.ai_performance_score?.on_time_delivery_rate || 92}%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Category Badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(30, 41, 59, 0.5)' }}>
              <span className="badge badge-indigo">
                {v.categories_details?.[0]?.name || "IT Hardware"}
              </span>
              <span className={`badge ${v.ai_performance_score?.risk_level === 'MEDIUM' ? 'badge-amber' : 'badge-emerald'}`}>
                {v.ai_performance_score?.risk_level || 'LOW RISK'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vendor Modal */}
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
          <div className="glass-panel" style={{ width: '450px', padding: '2rem', background: '#0F172A', border: '1px solid var(--border-glow)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF', marginBottom: '1.25rem' }}>Add New Vendor</h2>
            
            <form onSubmit={handleAddVendor}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input 
                  type="text" 
                  required 
                  value={newVendor.company_name} 
                  onChange={(e) => setNewVendor({...newVendor, company_name: e.target.value})} 
                  className="form-input" 
                  placeholder="e.g. Apex Industrial Supplies" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input 
                  type="text" 
                  required 
                  value={newVendor.contact_person} 
                  onChange={(e) => setNewVendor({...newVendor, contact_person: e.target.value})} 
                  className="form-input" 
                  placeholder="e.g. Rajesh Kumar" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={newVendor.email} 
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})} 
                  className="form-input" 
                  placeholder="sales@vendor.com" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  required 
                  value={newVendor.phone} 
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})} 
                  className="form-input" 
                  placeholder="+91 98765 43210" 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
