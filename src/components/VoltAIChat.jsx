import { useState, useRef, useEffect, useCallback } from 'react';
import { sendVoltAIMessage, isRateLimited, getRateLimitCooldown } from '../services/voltAI';
import { Zap, Send, X, MessageCircle } from 'lucide-react';

const SUGGESTIONS = [
  'Find CCS2 chargers near me',
  'How long to charge Nexon EV?',
  'What is VoltConnect Pro plan?',
];

export default function VoltAIChat({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m Volt AI ⚡ How can I help you today? Ask me about chargers, EVs, or your trip plans!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const debounceRef = useRef(null);
  const endRef = useRef(null);
  const history = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content }));

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // FIX 2: Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => {
        if (c <= 1) { setRateLimited(false); clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const send = useCallback(async (message) => {
    if (!message.trim() || loading) return;

    // FIX 2: Check rate limit
    if (isRateLimited()) {
      const cd = getRateLimitCooldown();
      setRateLimited(true);
      setCooldown(cd);
      return;
    }

    setMessages(m => [...m, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    const result = await sendVoltAIMessage(message, history);

    if (result.error === 'rate_limited') {
      setRateLimited(true);
      setCooldown(result.cooldown);
      setMessages(m => [...m, { role: 'assistant', content: `⏳ Volt AI is cooling down. Try again in ${result.cooldown}s.` }]);
    } else {
      setMessages(m => [...m, { role: 'assistant', content: result.response }]);
    }
    setLoading(false);
  }, [loading, history]);

  // FIX 1: Only send on button click or Enter key
  const handleSend = () => send(input);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1e1e1e', background: '#0A0A0A' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#007B33,#00C853)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Zap size={18} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Volt AI</div>
          <div style={{ color: '#00C853', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="dot-available" style={{ width: 6, height: 6 }} />
            EV Charging Assistant
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
          <X size={22} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#007B33,#00C853)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0 }}>
                <Zap size={14} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? '#00C853' : '#141414',
              color: msg.role === 'user' ? '#000' : '#fff',
              fontSize: 14, lineHeight: 1.5,
              border: msg.role === 'assistant' ? '1px solid #1e1e1e' : 'none',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* FIX 6: Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#007B33,#00C853)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="#fff" />
            </div>
            <div style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '16px 16px 16px 4px', padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ color: '#00C853', fontSize: 14, animation: 'pulse-green 1.5s infinite' }}>Volt AI is thinking</span>
              {[0,1,2].map(d => (
                <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C853', display: 'inline-block', animation: 'pulse-green 1.5s infinite', animationDelay: `${d * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Rate limit warning */}
        {rateLimited && (
          <div style={{ background: 'rgba(255,214,0,0.1)', border: '1px solid rgba(255,214,0,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, color: '#FFD600', fontSize: 13, textAlign: 'center' }}>
            ⚡ Volt AI is cooling down. Try again in {cooldown}s.
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, paddingLeft: 36 }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{
                background: '#141414', border: '1px solid #2d2d2d', borderRadius: 20, padding: '8px 14px',
                color: '#9ca3af', fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                alignSelf: 'flex-start', transition: 'all 0.15s',
              }}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 24px', borderTop: '1px solid #1e1e1e', background: '#0A0A0A', display: 'flex', gap: 10 }}>
        <input
          className="input-dark"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Volt AI anything..."
          disabled={loading || rateLimited}
          style={{ flex: 1 }}
        />
        {/* FIX 6: Disable button while loading */}
        <button className="btn-primary" onClick={handleSend} disabled={loading || !input.trim() || rateLimited}
          style={{ padding: '10px 16px', flexShrink: 0 }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
