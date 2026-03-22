import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, Lock, X } from 'lucide-react';
import VoltLogo from '../../components/VoltLogo';
const ADMIN_ACCOUNTS = [
  { email: 'jawadadmin1@login.com', password: 'jawad123' },
  { email: 'basheeradmin2@login.com', password: 'basheer123' },
];
const LOCKOUT_AFTER = 3;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .al-root {
    min-height: 100dvh; background: #000;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif; padding: 24px;
    position: relative; overflow: hidden;
  }
  .al-card {
    width: 100%; max-width: 400px;
    background: #111827; border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px; padding: 40px 36px;
    position: relative; z-index: 2;
    animation: slideUp 0.3s ease both;
  }
  .al-input {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;
    color: #fff; padding: 12px 16px;
    font: 500 14px 'Inter', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .al-input:focus { border-color: rgba(239,68,68,0.55); box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
  .al-input::placeholder { color: #4b5563; }
  .al-label { font-size: 11px; font-weight: 700; color: #6b7280; margin-bottom: 7px; display: block; text-transform: uppercase; letter-spacing: 0.05em; }
  .al-btn {
    width: 100%; padding: 13px 20px; border-radius: 12px; border: none;
    font: 700 14px 'Inter', sans-serif; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s; letter-spacing: 0.1px;
  }
  .al-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .al-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .al-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 10px 14px; color: #f87171; font-size: 13px; display: flex; align-items: flex-start; gap: 8px; }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
  @keyframes boltGlow { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const locked = attempts >= LOCKOUT_AFTER;

  const handleLogin = async () => {
    if (locked) return;
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const valid = ADMIN_ACCOUNTS.find(a => a.email === email.trim().toLowerCase() && a.password === password);
    if (valid) {
      sessionStorage.setItem('vc_admin_auth', '1');
      sessionStorage.setItem('vc_admin_email', email.trim().toLowerCase());
      navigate('/admin/overview');
    } else {
      const n = attempts + 1;
      setAttempts(n);
      setError(n >= LOCKOUT_AFTER
        ? 'Too many failed attempts. Contact system administrator.'
        : `Access denied. Invalid credentials. (${n}/${LOCKOUT_AFTER} attempts)`
      );
    }
    setLoading(false);
  };

  return (
    <div className="al-root">
      <style>{CSS}</style>
      {/* Glow orb */}
      <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'rgba(239,68,68,0.06)', filter: 'blur(100px)', top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

      <div className="al-card">
        {/* Back */}
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af' }}>
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <VoltLogo size={42} textSize={22} />
          <div style={{ marginTop: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Admin Access</h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: '4px 12px', color: '#EF4444', fontSize: 11, fontWeight: 700 }}>
              <Lock size={10} /> RESTRICTED
            </div>
          </div>
        </div>

        {/* Warning banner */}
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.16)', borderRadius: 10, padding: '10px 14px', marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={14} color="#EF4444" />
          <span style={{ color: '#f87171', fontSize: 12 }}>Unauthorized access is strictly prohibited and logged.</span>
        </div>

        {error && <div className="al-error" style={{ marginBottom: 20 }}><AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label className="al-label">Admin Email</label>
          <input className="al-input" type="email" placeholder="admin@voltconnect.in"
            value={email} onChange={e => setEmail(e.target.value)} disabled={locked} />
        </div>

        <div style={{ marginBottom: 28, position: 'relative' }}>
          <label className="al-label">Password</label>
          <input className="al-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !locked && handleLogin()}
            disabled={locked} style={{ paddingRight: 44 }} />
          <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: 34, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button className="al-btn" onClick={handleLogin} disabled={loading || locked}
          style={{ background: locked ? '#374151' : '#EF4444', color: '#fff' }}>
          {loading ? 'Verifying...' : locked ? 'Account Locked' : 'Login as Admin'}
        </button>
      </div>
    </div>
  );
}
