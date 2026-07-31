import React, { useEffect, useState } from 'react';
import { fetchDashboardMetrics } from '../services/api';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  FileText, 
  AlertTriangle, 
  ArrowUpRight,
  PlusCircle,
  Scale,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardMetrics().then(data => {
      if (data) setMetrics(data);
    });
  }, []);

  const chartData = metrics?.monthly_spend_trend || [
    { month: "Jan", spend: 1200000, savings: 140000 },
    { month: "Feb", spend: 1850000, savings: 210000 },
    { month: "Mar", spend: 1400000, savings: 190000 },
    { month: "Apr", spend: 2100000, savings: 280000 },
    { month: "May", spend: 2600000, savings: 350000 },
    { month: "Jun", spend: 3100000, savings: 420000 },
  ];

  const categoryData = metrics?.category_distribution || [
    { name: "IT & Hardware", value: 42, color: "#6366F1" },
    { name: "Office Supplies", value: 18, color: "#10B981" },
    { name: "Raw Materials", value: 25, color: "#F59E0B" },
    { name: "Services", value: 15, color: "#EC4899" },
  ];

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EC4899"];

  return (
    <div>
      {/* Page Title & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>Procurement Intelligence Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Real-time analytics, AI quote evaluations, and spend optimization insights.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/purchase-requests')}>
            <PlusCircle size={16} /> New Request
          </button>
          <button className="btn btn-emerald" onClick={() => navigate('/ai-quote-comparison')}>
            <Scale size={16} /> AI Quote Matrix
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Total YTD Spend</span>
            <DollarSign size={20} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)' }}>₹12,250,000</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#059669', marginTop: '0.5rem' }}>
            <TrendingUp size={14} /> +12.4% vs last quarter
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>AI Savings Achieved</span>
            <ArrowUpRight size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#059669' }}>₹1,590,000</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            10.2% cost reduction via AI quotes
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Vendors</span>
            <Building2 size={20} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)' }}>8 Verified</div>
          <div style={{ fontSize: '0.78rem', color: '#B45309', marginTop: '0.5rem' }}>
            4.75 Avg Quality Rating
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Approvals</span>
            <FileText size={20} color="#E11D48" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-main)' }}>3 Requests</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            2 RFQs open for bidding
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Monthly Spend & Savings Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Monthly Spend vs AI Savings (2026)
          </h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip 
                  contentStyle={{ background: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                  formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="spend" name="Monthly Spend" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Cost Savings" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend by Category Pie Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Spend by Category
          </h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
            {categoryData.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i] }}></span>
                {cat.name} ({cat.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Risk & Alert Highlights */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#D97706" /> Recent AI Procurement Copilot Insights
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/contract-audit')}>
            View Audit Studio →
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0.9rem', borderRadius: 'var(--radius-sm)', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#B45309', fontSize: '0.9rem' }}>
                Quotation Evaluated: RFQ-2026-0001 (Developer Laptops)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                AI detected TechCorp offers 10% lower cost with 24-month warranty vs Nexus Digital demanding 100% advance.
              </div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => navigate('/ai-quote-comparison')}>
              Review Matrix
            </button>
          </div>

          <div style={{ padding: '0.9rem', borderRadius: 'var(--radius-sm)', background: 'rgba(225, 29, 72, 0.08)', border: '1px solid rgba(225, 29, 72, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#BE123C', fontSize: '0.9rem' }}>
                Contract Renewal Warning: CNT-2026-0001
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                SLA contract with Global Steel & Infra expires in 28 days. Missing delay penalty clause flagged.
              </div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => navigate('/contract-audit')}>
              Run Clause Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
