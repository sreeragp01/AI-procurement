import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Send, 
  Scale, 
  Truck, 
  ShieldAlert, 
  Bot, 
  Sparkles,
  CheckSquare,
  PackageCheck,
  FileCheck,
  CreditCard,
  Building2
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/approvals', label: 'Approval Engine', icon: CheckSquare, badge: 'v2.5' },
    { path: '/vendors', label: 'Vendor Directory', icon: Users },
    { path: '/vendor-portal', label: 'Supplier Portal', icon: Building2, badge: 'v4.0' },
    { path: '/purchase-requests', label: 'Purchase Requests', icon: FileText },
    { path: '/rfqs', label: 'RFQs & Bidding', icon: Send },
    { path: '/ai-quote-comparison', label: 'AI Quote Matrix', icon: Scale, badge: 'AI' },
    { path: '/purchase-orders', label: 'Purchase Orders', icon: Truck },
    { path: '/goods-receipts', label: 'Goods Receipt (GRN)', icon: PackageCheck },
    { path: '/invoices', label: '3-Way Invoices', icon: FileCheck },
    { path: '/payments', label: 'Disbursements', icon: CreditCard },
    { path: '/contract-audit', label: 'Contract Audit Studio', icon: ShieldAlert, badge: 'AI' },
    { path: '/copilot-chat', label: 'AI Copilot RAG Chat', icon: Bot, badge: 'AI' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Brand Logo Header */}
      <div style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0 1.5rem',
        borderBottom: '1px solid #1E293B'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles size={20} color="#FFF" />
        </div>
        <div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>ProcureAI</span>
          <span style={{ fontSize: '0.65rem', color: '#34D399', fontWeight: 700, display: 'block', letterSpacing: '0.05em' }}>COPILOT v4.0</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#FFF' : '#94A3B8',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0.15) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid #6366F1' : '3px solid transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color="#818CF8" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`badge ${item.badge === 'AI' ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
