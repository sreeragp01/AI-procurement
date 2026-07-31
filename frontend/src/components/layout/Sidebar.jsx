import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  ShoppingBag, 
  FileCheck2, 
  Scale, 
  ShieldAlert, 
  Bot,
  Sparkles,
  Truck
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Vendor Directory', path: '/vendors', icon: Building2 },
    { label: 'Purchase Requests', path: '/purchase-requests', icon: ShoppingBag },
    { label: 'RFQs & Bidding', path: '/rfqs', icon: FileCheck2 },
    { label: 'AI Quote Comparison', path: '/ai-quote-comparison', icon: Scale, badge: 'AI Unique' },
    { label: 'Purchase Orders', path: '/purchase-orders', icon: Truck },
    { label: 'Contract Audit', path: '/contract-audit', icon: ShieldAlert, badge: 'Risk' },
    { label: 'AI Copilot Assistant', path: '/copilot-chat', icon: Bot, highlight: true },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--primary-glow)'
          }}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>ProcureAI</h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Copilot Platform</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? '#FFF' : 'var(--text-muted)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={item.highlight ? '#818CF8' : 'currentColor'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge ${item.badge === 'AI Unique' ? 'badge-indigo' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Pro Badge */}
      <div style={{ padding: '1.25rem', margin: '1rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Sparkles size={16} color="#34D399" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>AI Engine v1.0</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Automated Quote Extraction & PO Lifecycle Tracker enabled.
        </p>
      </div>
    </aside>
  );
};
