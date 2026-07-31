import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Building2, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@apexprocure.com',
    password: 'admin123',
    first_name: 'Sreerag',
    last_name: 'Manager',
    role: 'ADMIN',
    organization_name: 'Apex Global Procurement'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#090D16',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      <div className="glass-panel" style={{
        width: '440px',
        padding: '2.5rem',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={24} color="#FFF" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>
            {isRegister ? 'Create Startup Account' : 'Log In to ProcureAI'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {isRegister ? 'Start your 14-day free trial' : 'Access your enterprise procurement copilot'}
          </p>
        </div>

        {/* Quick Credentials Helper Card */}
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          marginBottom: '1.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontWeight: 700, color: '#818CF8', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <UserCheck size={14} /> Demo Credentials (Pre-filled):
          </div>
          <div>Email: <strong style={{ color: '#FFF' }}>admin@apexprocure.com</strong></div>
          <div>Password: <strong style={{ color: '#FFF' }}>admin123</strong></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="form-input" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company Organization</label>
                <input 
                  type="text" 
                  required 
                  value={formData.organization_name}
                  onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                  className="form-input" 
                  placeholder="e.g. Apex Global Procurement"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="form-input" 
              placeholder="name@company.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="form-input" 
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Workspace Role</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="form-select"
            >
              <option value="ADMIN">System Administrator</option>
              <option value="PROCUREMENT_MANAGER">Procurement Manager</option>
              <option value="VENDOR">Vendor Portal Account</option>
              <option value="FINANCE">Finance Approver</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}>
            <span>{isRegister ? 'Create Account & Enter' : 'Log In to Dashboard'}</span> <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {isRegister ? 'Already have an account? ' : 'New to ProcureAI? '}
          <span 
            style={{ color: '#818CF8', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Log In' : 'Register Company'}
          </span>
        </div>
      </div>
    </div>
  );
};
