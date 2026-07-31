import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, UserCheck, Bot, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, switchRole, switchOrganization } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(9, 13, 22, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
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
            value={user.organization} 
            onChange={(e) => switchOrganization(e.target.value)}
            className="form-select"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', height: '36px', borderColor: 'rgba(99, 102, 241, 0.4)' }}
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
            value={user.role} 
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

        {/* Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '0.45rem', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.5)' }}>
          <Bell size={18} color="var(--text-muted)" />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-emerald)'
          }}></span>
        </div>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.85rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#FFF',
            fontSize: '0.85rem'
          }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFF' }}>{user.name}</div>
            <div style={{ fontSize: '0.68rem', color: '#818CF8', fontWeight: 600 }}>{user.organization}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
