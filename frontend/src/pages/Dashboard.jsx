import React, { useState, useEffect } from 'react';
import { dashboardAPI, aiAPI } from '../services/api';
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
  Sparkles,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchAIForecast();
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

  const fetchAIForecast = async () => {
    try {
      const res = await aiAPI.getSpendForecasting();
      if (res && res.data) {
        setForecast(res.data);
      }
    } catch (err) {
      console.error("Error fetching AI spend forecast:", err);
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
            <span className="badge badge-emerald">Version 3.0 Active</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>AI Intelligence & Predictive Analytics Engine</span>
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

      {/* Executive Procurement Health Scorecard (v5.0 OS Feature) */}
      <div className="glass-panel" style={{ 
        padding: '1.5rem', 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)', 
        border: '1px solid rgba(99, 102, 241, 0.35)', 
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Score Radial Badge */}
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              border: '3px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>84</span>
              <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 700 }}>/ 100</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>Organization Procurement Health Score</h2>
                <span className="badge badge-emerald">EXCELLENT</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Single executive control dashboard analyzing supplier risk, policy compliance, and approval throughput.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', background: '#0F172A', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <div style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--text-dim)' }}>Supplier Risk</div>
              <strong style={{ color: '#34D399', fontSize: '0.9rem' }}>🟢 Low Risk</strong>
            </div>
            <div style={{ width: '1px', background: '#1E293B' }}></div>
            <div style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--text-dim)' }}>Compliance</div>
              <strong style={{ color: '#FBBF24', fontSize: '0.9rem' }}>🟡 1 Expiring</strong>
            </div>
            <div style={{ width: '1px', background: '#1E293B' }}></div>
            <div style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--text-dim)' }}>Budget Control</div>
              <strong style={{ color: '#34D399', fontSize: '0.9rem' }}>🟢 Optimal</strong>
            </div>
          </div>
        </div>

        {/* Indicator Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#0F172A', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Supplier Risk Profile</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>🟢 7/8 Suppliers Qualified</div>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#0F172A', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Contract Compliance</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>🟡 IT Agreement Expires Soon</div>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#0F172A', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Approval Speed</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>🟢 4.2 Days Avg Cycle</div>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#0F172A', borderRadius: '8px', borderLeft: '4px solid #F87171' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Policy Compliance</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>🟠 1 RFQ Needs 3+ Quotes</div>
          </div>
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

      {/* v3.0 Feature: AI Spend Forecasting & Duplicate Anomaly Detector */}
      {forecast && (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Sparkles size={22} color="#818CF8" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>AI Predictive Spend Forecasting & Anomaly Alerts</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.85rem', background: '#0F172A', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Projected Q3 2026 Spend</div>
              <strong style={{ fontSize: '1.2rem', color: '#818CF8' }}>₹{(forecast?.forecast_q3_2026 || 4850000).toLocaleString()}</strong>
            </div>

            <div style={{ padding: '0.85rem', background: '#0F172A', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Projected Q4 2026 Spend</div>
              <strong style={{ fontSize: '1.2rem', color: '#34D399' }}>₹{(forecast?.forecast_q4_2026 || 5200000).toLocaleString()}</strong>
            </div>

            <div style={{ padding: '0.85rem', background: '#0F172A', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Anomalies Flagged</div>
              <strong style={{ fontSize: '1.2rem', color: '#F87171' }}>{forecast?.anomalies_detected_count || 2} High-Priority Alerts</strong>
            </div>
          </div>

          {forecast.anomalies && forecast.anomalies.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {forecast.anomalies.map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldAlert size={20} color="#F87171" />
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#FFF' }}>{item.title}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.details}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
    </div>
  );
};
