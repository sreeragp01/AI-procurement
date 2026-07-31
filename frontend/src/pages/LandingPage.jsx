import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Scale, 
  ShieldAlert, 
  Bot, 
  FileText, 
  Building2, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  DollarSign,
  ShieldCheck,
  Users,
  Award
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#090D16', color: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Marketing Navigation Bar */}
      <header style={{
        height: '80px',
        borderBottom: '1px solid #1E293B',
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={24} color="#FFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>ProcureAI</span>
            <span style={{ fontSize: '0.72rem', color: '#818CF8', fontWeight: 700, display: 'block' }}>COPILOT PLATFORM</span>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600, color: '#94A3B8' }}>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
          <a href="#capabilities" style={{ color: 'inherit', textDecoration: 'none' }}>AI Engine</a>
          <a href="#industries" style={{ color: 'inherit', textDecoration: 'none' }}>Industries</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ padding: '0.55rem 1.1rem' }}>
            Log In
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ padding: '0.55rem 1.25rem' }}>
            <span>Launch App Demo</span> <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '5rem 4rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}></div>

        <span className="badge badge-indigo" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          <Sparkles size={14} /> Next-Gen AI Procurement SaaS
        </span>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          fontFamily: 'Outfit, sans-serif',
          color: '#FFF',
          lineHeight: 1.15,
          maxWidth: '900px',
          margin: '0 auto 1.25rem'
        }}>
          The AI-Native Procurement OS for Enterprise Buying
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#94A3B8',
          maxWidth: '720px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Automate requisitions, dispatch RFQs, extract vendor PDF quotes, compare multi-criteria matrices, and audit contract risk in seconds.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/')}>
            <span>Explore Live Dashboard Demo</span> <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/ai-quote-comparison')}>
            <Scale size={18} /> View AI Quote Matrix
          </button>
        </div>

        {/* Hero Interactive App Mockup Card */}
        <div className="glass-panel" style={{
          maxWidth: '1050px',
          margin: '0 auto',
          padding: '2rem',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #1E293B', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></span>
              <span style={{ fontSize: '0.85rem', color: '#64748B', marginLeft: '0.5rem' }}>ProcureAI Matrix Engine v1.0</span>
            </div>
            <span className="badge badge-emerald"><CheckCircle2 size={14} /> AI Recommendation Evaluated</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase' }}>🏆 Recommended Winner</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', margin: '0.3rem 0' }}>TechCorp Hardware Ltd</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34D399' }}>₹3,600,000</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.4rem' }}>24-Month Warranty • Net 30 Terms</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '12px', border: '1px solid #1E293B' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase' }}>⚡ Fastest Execution</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', margin: '0.3rem 0' }}>Nexus Digital Solutions</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>₹3,850,000</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.4rem' }}>3-Day Lead Time • 100% Advance Demanded</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase' }}>🛡️ Contract Risk Score</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', margin: '0.3rem 0' }}>SLA Contract #1024</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FBBF24' }}>68 / 100 Index</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.4rem' }}>Delay Penalty Clause Missing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Section */}
      <section style={{ borderTop: '1px solid #1E293B', borderBottom: '1px solid #1E293B', background: '#0F172A', padding: '3rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#6366F1', fontFamily: 'Outfit, sans-serif' }}>90%</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.3rem' }}>Faster Quote Evaluation Time</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10B981', fontFamily: 'Outfit, sans-serif' }}>12.4%</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.3rem' }}>Average Cost Savings Achieved</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'Outfit, sans-serif' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.3rem' }}>Automated PDF & OCR Extraction</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#EC4899', fontFamily: 'Outfit, sans-serif' }}>0</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.3rem' }}>Manual Spreadsheet Errors</div>
          </div>
        </div>
      </section>

      {/* Features Showcase Grid */}
      <section id="features" style={{ padding: '5rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>Core Capabilities</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit, sans-serif' }}>
              Built for Enterprise Procurement Teams
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', marginTop: '0.4rem' }}>
              Everything you need to streamline purchasing, evaluate bids, and reduce legal liability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Scale size={24} color="#818CF8" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '0.5rem' }}>AI Multi-Criteria Comparison</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Parses 50-page PDF vendor quotes into a side-by-side decision matrix comparing cost, lead time, warranty, and payment terms.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldAlert size={24} color="#34D399" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '0.5rem' }}>Contract Risk Audit Studio</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Scans contract PDFs to detect missing liquidated damages penalty clauses, unclear IP transfer terms, and force majeure windows.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Bot size={24} color="#FBBF24" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '0.5rem' }}>Natural Language RAG Assistant</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Ask plain-English questions like *"Which vendor has the lowest average unit cost?"* or *"Which contracts expire next month?"*.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Industries */}
      <section id="industries" style={{ background: '#0F172A', padding: '5rem 4rem', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>Industry Solutions</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit, sans-serif', marginBottom: '3rem' }}>
            Tailored for High-Volume Buyers
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>🏭 Manufacturing</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5 }}>Raw steel, fasteners, components, and machinery quote evaluations.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>🏗️ Construction</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5 }}>Heavy equipment rentals, cement, cables, and subcontractor bidding.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>🏥 Healthcare</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5 }}>Medical devices, diagnostic equipment, and pharmaceutical supply chains.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>🎓 Universities</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5 }}>IT hardware, campus furniture, and laboratory equipment procurement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" style={{ padding: '5rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>Flexible Pricing</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit, sans-serif', marginBottom: '3.5rem' }}>
            Choose the Right Plan for Your Team
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem', textAlign: 'left' }}>
            {/* Starter */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>Starter</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFF', margin: '1rem 0' }}>$99 <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>/mo</span></div>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.8 }}>
                  <li>Up to 15 Purchase Requests</li>
                  <li>5 AI Quote Comparisons / mo</li>
                  <li>Vendor Directory & Ratings</li>
                  <li>Standard Support</li>
                </ul>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
                Get Started
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="glass-panel" style={{ padding: '2rem', border: '2px solid #6366F1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#6366F1', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.75rem', borderRadius: '12px' }}>
                MOST POPULAR
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>Pro SaaS</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#818CF8', margin: '1rem 0' }}>$299 <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>/mo</span></div>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#F8FAFC', lineHeight: 1.8 }}>
                  <li>Unlimited Purchase Requests</li>
                  <li>Unlimited AI Quote Matrices</li>
                  <li>Contract Risk Audit Studio</li>
                  <li>AI Copilot Chat Assistant</li>
                  <li>5 Team User Seats</li>
                </ul>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>Enterprise</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFF', margin: '1rem 0' }}>$799 <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>/mo</span></div>
                <ul style={{ paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.8 }}>
                  <li>Custom SAP / ERP Integrations</li>
                  <li>Multi-Tenant Workspaces</li>
                  <li>Dedicated Account Manager</li>
                  <li>Custom SLA & 99.9% Uptime</li>
                </ul>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1E293B', padding: '3rem 4rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: '0 auto' }}>
          <div>© 2026 AI Procurement Copilot Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Launch App Demo</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/ai-quote-comparison')}>AI Matrix</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
