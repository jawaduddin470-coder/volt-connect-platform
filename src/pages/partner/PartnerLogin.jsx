import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import { loginPartner } from '../../services/partnerAuth';

// ── Glowing Bolt Logo ──
function VoltLogo({ size = 36, textSize = 20 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <div style={{ position: 'absolute', inset: -size * 0.5, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)' }} />
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 1 }}>
          <polygon points="13,2 4,14 11,14 11,22 20,10 13,10" fill="#7C3AED" />
        </svg>
      </div>
      <span style={{ fontWeight: 900, fontSize: textSize, letterSpacing: '-0.4px' }}>
        <span style={{ color: '#fff' }}>Volt</span>
        <span style={{ color: '#00FFB2' }}>Connect</span>
      </span>
    </div>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .pl-root {
    min-height: 100dvh; background: #000;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif; padding: 24px;
    position: relative; overflow: hidden;
  }
  .pl-card {
    width: 100%; max-width: 400px;
    background: #111827; border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px; padding: 40px 36px;
    position: relative; z-index: 2;
    animation: slideUp 0.3s ease both;
  }
  .pl-input {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;
    color: #fff; padding: 12px 16px;
    font: 500 14px 'Inter', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .pl-input:focus { border-color: rgba(124,58,237,0.55); box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
  .pl-input::placeholder { color: #4b5563; }
  .pl-label { font-size: 11px; font-weight: 700; color: #6b7280; margin-bottom: 7px; display: block; text-transform: uppercase; letter-spacing: 0.05em; }
  .pl-btn {
    width: 100%; padding: 13px 20px; border-radius: 12px; border: none;
    font: 700 14px 'Inter', sans-serif; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }
  .pl-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .pl-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .pl-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 10px 14px; color: #f87171; font-size: 13px; display: flex; align-items: flex-start; gap: 8px; }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
`;

export default function PartnerLogin() {
  const navigate = useNavigate();
  const [partnerId, setPartnerId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(''); setLoading(true);
    const id = partnerId.trim().toUpperCase();
    if (!id || pin.length < 4) {
      setError('Please enter a valid Partner ID and PIN.'); setLoading(false); return;
    }
    try {
      const partner = await loginPartner(id, pin);
      sessionStorage.setItem('vc_partner_auth', '1');
      sessionStorage.setItem('vc_partner_id', id);
      sessionStorage.setItem('vc_partner_name', partner.companyName || id);
      navigate('/partner/dashboard');
    } catch (err) {
      if (err.message === 'suspended') {
        setError('Your account has been suspended. Contact admin.');
      } else {
        setError('Access denied. Invalid Partner ID or PIN.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="pl-root">
      <style>{CSS}</style>
      {/* Purple glow */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'rgba(124,58,237,0.06)', filter: 'blur(100px)', top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

      <div className="pl-card">
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af' }}>
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <VoltLogo size={42} textSize={22} />
          <div style={{ marginTop: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Station Partner Login</h1>
            <p style={{ color: '#6b7280', fontSize: 13 }}>Enter your Partner ID and PIN to continue</p>
          </div>
        </div>

        {error && <div className="pl-error" style={{ marginBottom: 20 }}><AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label className="pl-label">Partner ID</label>
          <input className="pl-input" placeholder="e.g. VOLT-HYD-001"
            value={partnerId} onChange={e => setPartnerId(e.target.value.toUpperCase())} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label className="pl-label">PIN (6-digit)</label>
          <input className="pl-input" type="password" inputMode="numeric" maxLength={6}
            placeholder="••••••" value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <button className="pl-btn" onClick={handleLogin} disabled={loading}
          style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff' }}>
          {loading ? 'Verifying...' : 'Login as Partner'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 18, color: '#4b5563', fontSize: 12 }}>
          No account yet? Contact{' '}
          <a href="mailto:partner@voltconnect.in" style={{ color: '#7C3AED', textDecoration: 'underline' }}>
            partner@voltconnect.in
          </a>
        </p>
      </div>
    </div>
  );
}
