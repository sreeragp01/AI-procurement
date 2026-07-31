import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import { Bot, Send, Sparkles, User, HelpCircle } from 'lucide-react';

export const AICopilotChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Procurement Copilot. Ask me anything about your spend analytics, vendor scores, delayed orders, or expiring contracts."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Create an RFQ for 50 Dell laptops under ₹4,000,000.",
    "Can I award this contract with only two quotations?",
    "Which vendor has the lowest average price?",
    "Which contracts expire next month?"
  ];

  const handleSend = async (textToSend = null) => {
    const activeQuery = textToSend || query;
    if (!activeQuery.trim()) return;

    const userMsg = { sender: 'user', text: activeQuery };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    try {
      const res = await aiAPI.copilotChat(activeQuery);
      const aiMsg = { 
        sender: 'ai', 
        text: res?.data?.reply || res?.data?.query || "No response received.",
        action_executed: res?.data?.action_executed,
        action_data: res?.data?.action_data
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Copilot Chat error:", err);
      setMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to AI Copilot engine." }]);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px var(--primary-glow)',
          marginBottom: '0.75rem'
        }}>
          <Bot size={28} color="#FFF" />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>AI Procurement Copilot Assistant</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
          Query your relational database, vendor ratings, and contract terms in plain English.
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        {/* Messages List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: '450px', paddingRight: '0.5rem' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                gap: '0.85rem',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%'
              }}
            >
              {m.sender === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Sparkles size={16} color="#FFF" />
                </div>
              )}

              <div style={{
                padding: '0.9rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: m.sender === 'user' ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'rgba(30, 41, 59, 0.8)',
                color: '#FFF',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-line',
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-color)'
              }}>
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}>
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              <Sparkles size={16} className="animate-spin" /> Copilot scanning procurement records...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="form-input" 
              placeholder="Ask Copilot a question (e.g. 'Which vendor has the lowest average price?')" 
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={() => handleSend()} disabled={loading}>
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <HelpCircle size={14} /> Try asking these sample queries:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {samplePrompts.map((prompt, i) => (
            <button 
              key={i} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', borderRadius: '20px' }}
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
