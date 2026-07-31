import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  FileText, 
  AlertTriangle, 
  PlusCircle, 
  Scale, 
  ArrowUpRight, 
  Clock, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const res = await dashboardAPI.getMetrics();
      setMetrics(res.data);
    } catch (err) {
      console.error("Error loading dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { month: 'Jan', spend: 2100000, savings: 240000 },
    { month: 'Feb', spend: 2800000, savings: 310000 },
    { month: 'Mar', spend: 3600000, savings: 420000 },
    { month: 'Apr', spend: 3750000, savings: 620000 },
  ];

  const categoryData = [
    { name: 'IT Hardware', value: 45 },
    { name: 'Raw Steel', value: 30 },
    { name: 'Medical Devices', value: 25 },
  ];

  const COLORS = ['#6366F1', '#10B981', '#F59E0B'];

  return (
    <div className="page-body">
      {/* Page Title & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-indigo">Version 2.5 Active</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Multi-Tenant Decision-Support System</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>Procurement Executive Analytics</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/purchase-requests')}>
            <PlusCircle size={16} /> New Requisition
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
            <DollarSign size={20} color="#6366F1" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FFF' }}>₹12,250,000</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#34D399', marginTop: '0.5rem' }}>
            <TrendingUp size={14} /> +12.4% vs last quarter
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Procurement Cycle Time</span>
            <Clock size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#34D399' }}>4.2 Days</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            PR creation ➔ Goods delivery average
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>AI Savings Achieved</span>
            <ArrowUpRight size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#34D399' }}>₹1,590,000</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            10.2% cost reduction rate
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Vendors</span>
            <Building2 size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FFF' }}>8 Verified</div>
          <div style={{ fontSize: '0.78rem', color: '#FBBF24', marginTop: '0.5rem' }}>
            98.2% On-Time Delivery Rate
          </div>
        </div>
      </div>

      {/* Analytics Row: Spend Trend & Category Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '1.25rem' }}>
            Monthly Spend vs AI Negotiated Savings
          </h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip 
                  contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#FFF' }} 
                  formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="spend" name="Monthly Spend" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Cost Savings" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '1.25rem' }}>
            Spend Distribution
          </h3>
          <div style={{ height: '190px' }}>
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
                <Tooltip contentStyle={{ background: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.4rem' }}>
            {categoryData.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i] }}></span>
                {cat.name} ({cat.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* v2.5 Executive Analytics: Approval Bottlenecks & Contract Expiration Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Approval Bottleneck Tracker */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#818CF8" /> Approval Response Time by Role
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#0F172A', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFF' }}>Department Head Review</span>
              <strong style={{ fontSize: '0.85rem', color: '#10B981' }}>0.8 Hours (Fast)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#0F172A', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFF' }}>Procurement Manager Review</span>
              <strong style={{ fontSize: '0.85rem', color: '#10B981' }}>1.4 Hours (Normal)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#0F172A', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#FFF' }}>Finance Director Review</span>
              <strong style={{ fontSize: '0.85rem', color: '#FBBF24' }}>4.6 Hours (Review Delay)</strong>
            </div>
          </div>
        </div>

        {/* Contract Expiration Calendar */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="#FBBF24" /> Contract Expiration Calendar (30/60/90 Days)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#FBBF24', fontSize: '0.85rem' }}>CNT-2026-0001 (Global Steel & Infra)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expires in 35 days • Value: ₹15,000,000</div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }} onClick={() => navigate('/contract-audit')}>
                Run Audit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
