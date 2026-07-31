import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, UserCheck, Bot, Building2, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { procurementAPI } from '../../services/api';

export const Header = () => {
  const { user, switchRole, switchOrganization } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await procurementAPI.getNotifications();
      if (res && Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => n && !n.is_read).length;

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Search Input */}
      <div style={{ position: 'relative', width: '300px' }}>
        <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search RFQs, Vendors, Contracts..." 
          className="form-input"
          style={{ width: '100%', paddingLeft: '38px', height: '38px', fontSize: '0.82rem' }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Company Organization Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Building2 size={16} color="#818CF8" />
          <select 
            value={user?.organization || 'Apex Global Procurement'} 
            onChange={(e) => switchOrganization(e.target.value)}
            className="form-select"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', height: '36px' }}
          >
            <option value="Apex Global Procurement">Org: Apex Global</option>
            <option value="BioMed Health Corp">Org: BioMed Health</option>
            <option value="BuildCon Infra Ltd">Org: BuildCon Infra</option>
          </select>
        </div>

        {/* Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <UserCheck size={16} color="var(--text-muted)" />
          <select 
            value={user?.role || 'ADMIN'} 
            onChange={(e) => switchRole(e.target.value)}
            className="form-select"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', height: '36px' }}
          >
            <option value="ADMIN">Role: Admin</option>
            <option value="PROCUREMENT_MANAGER">Role: Manager</option>
            <option value="VENDOR">Role: Vendor</option>
            <option value="FINANCE">Role: Finance</option>
          </select>
        </div>

        {/* Ask AI Button */}
        <button 
          onClick={() => navigate('/copilot-chat')}
          className="btn btn-primary"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
        >
          <Bot size={16} />
          <span>Ask Copilot</span>
        </button>

        {/* Notification Center Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ position: 'relative', cursor: 'pointer', padding: '0.45rem', borderRadius: '8px', background: '#0F172A', border: '1px solid #1E293B' }}
          >
            <Bell size={18} color="#818CF8" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--accent-rose)'
              }}></span>
            )}
          </div>

          {/* Notification Popup Dropdown */}
          {showDropdown && (
            <div className="glass-panel" style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '340px',
              padding: '1rem',
              zIndex: 100,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #1E293B', paddingBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFF' }}>Notification Center</span>
                <span className="badge badge-indigo">{unreadCount} New</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' }}>
                {safeNotifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => { setShowDropdown(false); navigate(n.link || '/'); }}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '6px',
                      background: n.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid #1E293B',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>{n.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.85rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#FFF',
            fontSize: '0.85rem'
          }}>
            {user?.name ? user.name.charAt(0) : 'S'}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'Sreerag Manager'}</div>
            <div style={{ fontSize: '0.68rem', color: '#818CF8', fontWeight: 600 }}>{user?.organization || 'Apex Global Procurement'}</div>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginLeft: '0.5rem' }}
            onClick={() => navigate('/login')}
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};
