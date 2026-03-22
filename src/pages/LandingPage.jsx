import { useState } from 'react';
import { X, Eye, EyeOff, AlertTriangle, Lock, Shield, Building2, Zap, ExternalLink } from 'lucide-react';
import DownloadModal from '../components/DownloadModal';
import VoltLogo from '../components/VoltLogo';
import { loginPartner } from '../services/partnerAuth';

// ─────────────────────────────────────────────────────────
//  Global CSS
// ─────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; }

  .lp-root {
    min-height: 100dvh;
    background: #000000;
    font-family: 'Inter', system-ui, sans-serif;
    color: #fff;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Navbar ── */
  .lp-nav {
    position: sticky; top: 0; z-index: 50;
    width: 100%; height: 64px;
    background: rgba(0,0,0,0.88);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    animation: fadeIn 0.4s ease;
  }
  @media(min-width:1024px){ .lp-nav { padding: 0 56px; } }

  /* ── Hero ── */
  .lp-hero { text-align: center; padding: 88px 24px 64px; position: relative; z-index: 1; }
  @media(min-width:1024px){ .lp-hero { padding: 110px 48px 72px; } }

  .lp-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(0,255,178,0.08);
    border: 1px solid rgba(0,255,178,0.25);
    border-radius: 40px; padding: 7px 18px;
    color: #00FFB2; font-size: 13px; font-weight: 600;
    margin-bottom: 32px;
    animation: slideUp 0.5s ease both;
    letter-spacing: 0.01em;
  }
  .lp-hero-h1 {
    font-size: clamp(38px, 6vw, 68px);
    font-weight: 900; letter-spacing: -2px; line-height: 1.06;
    margin-bottom: 22px;
    animation: slideUp 0.55s ease both;
  }
  .lp-hero-gradient {
    background: linear-gradient(135deg, #00FFB2 0%, #7C3AED 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .lp-hero-sub {
    color: #9CA3AF; font-size: clamp(15px, 2vw, 18px);
    margin-bottom: 40px; animation: slideUp 0.6s ease both;
    letter-spacing: 0.01em;
  }
  .lp-stats {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; flex-wrap: wrap;
    animation: slideUp 0.65s ease both;
  }
  .lp-stat-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: #111827; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 40px; padding: 9px 18px;
    font-size: 13px; color: #9CA3AF; font-weight: 600;
    white-space: nowrap;
  }

  /* ── Cards grid ── */
  .lp-cards {
    display: grid; grid-template-columns: 1fr;
    gap: 18px; padding: 0 16px;
    max-width: 1200px; margin: 0 auto;
    animation: slideUp 0.7s ease both;
  }
  @media(min-width:640px){ .lp-cards { padding: 0 24px; } }
  @media(min-width:768px){ .lp-cards { grid-template-columns: 1fr 1fr; } }
  @media(min-width:1024px){
    .lp-cards { grid-template-columns: 1fr 1fr 1fr; gap: 22px; padding: 0 48px; }
    .lp-card:hover { transform: translateY(-6px) scale(1.015) !important; }
  }

  /* ── Card ── */
  .lp-card {
    background: #111827;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 28px 24px 24px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s ease;
    display: flex; flex-direction: column;
  }
  .lp-card:hover { transform: translateY(-4px); box-shadow: 0 24px 60px rgba(0,0,0,0.6); }

  /* Left accent border */
  .lp-card-accent-left {
    position: absolute; top: 0; left: 0; bottom: 0; width: 3px;
    border-radius: 20px 0 0 20px;
  }

  /* ── Buttons ── */
  .lp-btn-primary {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%; padding: 13px 20px; border-radius: 12px;
    border: none; cursor: pointer;
    font: 700 14px 'Inter', system-ui, sans-serif; letter-spacing: 0.2px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .lp-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

  .lp-btn-secondary {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%; padding: 12px 20px; border-radius: 12px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: #9ca3af; cursor: pointer;
    font: 600 14px 'Inter', system-ui, sans-serif;
    transition: border-color 0.2s, color 0.2s, transform 0.15s;
    text-decoration: none;
  }
  .lp-btn-secondary:hover { border-color: rgba(255,255,255,0.22); color: #e5e7eb; transform: translateY(-1px); }

  /* ── Feature pills ── */
  .lp-feature-list { display: flex; flex-wrap: wrap; gap: 7px; margin: 14px 0 22px; }
  .lp-feat-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 24px;
    font-size: 12px; font-weight: 600; border: 1px solid;
  }

  /* ── Features section ── */
  .lp-features {
    display: grid; grid-template-columns: 1fr;
    gap: 16px; padding: 0 16px;
    max-width: 1200px; margin: 0 auto;
  }
  @media(min-width:640px){ .lp-features { padding: 0 24px; grid-template-columns: 1fr 1fr 1fr; } }
  @media(min-width:1024px){ .lp-features { padding: 0 48px; } }
  .lp-feature-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 26px 24px; text-align: center;
    transition: border-color 0.2s;
  }
  .lp-feature-card:hover { border-color: rgba(255,255,255,0.14); }

  /* ── Footer ── */
  .lp-footer {
    padding: 48px 24px 56px; text-align: center;
    border-top: 1px solid rgba(255,255,255,0.06);
    margin-top: 80px; color: #555; font-size: 13px; line-height: 2;
  }
  @media(min-width:1024px){ .lp-footer { padding: 48px 56px 56px; } }

  /* ── Modal backdrop ── */
  .lp-modal-backdrop {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.82); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeIn 0.2s ease;
  }
  .lp-modal {
    width: 100%; max-width: 400px;
    background: #111827;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 24px; padding: 36px 32px;
    position: relative;
    animation: slideUp 0.25s ease both;
  }
  .lp-modal-close {
    position: absolute; top: 16px; right: 16px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50%; width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #9ca3af;
    transition: background 0.15s, color 0.15s;
  }
  .lp-modal-close:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .lp-modal-input {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;
    color: #fff; padding: 12px 16px;
    font: 500 14px 'Inter', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .lp-modal-input:focus { border-color: rgba(0,255,178,0.5); box-shadow: 0 0 0 3px rgba(0,255,178,0.08); }
  .lp-modal-input::placeholder { color: #4b5563; }
  .lp-modal-label { font-size: 12px; font-weight: 600; color: #9ca3af; margin-bottom: 7px; display: block; letter-spacing: 0.04em; text-transform: uppercase; }
  .lp-modal-error {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px; padding: 10px 14px;
    color: #f87171; font-size: 13px; display: flex; align-items: center; gap: 8px;
  }
  .lp-modal-success {
    background: rgba(0,255,178,0.08); border: 1px solid rgba(0,255,178,0.2);
    border-radius: 10px; padding: 10px 14px;
    color: #00FFB2; font-size: 13px;
  }

  /* ── Animations ── */
  @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1);} 40%{transform:translate(50px,-70px) scale(1.1);} 70%{transform:translate(-30px,40px) scale(0.95);} }
  @keyframes floatB { 0%,100%{transform:translate(0,0) scale(1);} 35%{transform:translate(-60px,60px) scale(1.05);} 65%{transform:translate(40px,-50px) scale(0.9);} }
  @keyframes floatC { 0%,100%{transform:translate(0,0) scale(1);} 30%{transform:translate(70px,40px) scale(1.08);} 60%{transform:translate(-50px,-60px) scale(0.95);} }
  @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.45;transform:scale(1.6);} }
  @keyframes boltGlow {
    0%,100% { opacity: 0.85; } 50% { opacity: 1; }
  }
`;

// ─────────────────────────────────────────────────────────
//  Feature Pill
// ─────────────────────────────────────────────────────────
function FeatPill({ label, emoji, color }) {
  return (
    <span className="lp-feat-pill" style={{
      background: `${color}12`, color, borderColor: `${color}28`,
    }}>
      {emoji} {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
//  Portal Card
// ─────────────────────────────────────────────────────────
function PortalCard({ accentColor, icon: Icon, title, badge, features, primaryLabel, primaryAction, secondaryLabel, secondaryAction, footerNote, delay = 0 }) {
  return (
    <div className="lp-card" style={{ animation: `slideUp ${0.7 + delay}s ease both` }}>
      {/* Left accent */}
      <div className="lp-card-accent-left" style={{
        background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}44 100%)`,
      }} />

      {/* Badge */}
      {badge && (
        <div style={{
          position: 'absolute', top: 18, right: 18,
          background: `${accentColor}15`, color: accentColor,
          border: `1px solid ${accentColor}30`,
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, fontWeight: 700,
        }}>{badge}</div>
      )}

      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4, paddingLeft: 12 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 13,
          background: `${accentColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={24} color={accentColor} />
        </div>
        <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px' }}>{title}</h3>
      </div>

      {/* Feature pills */}
      <div className="lp-feature-list" style={{ paddingLeft: 12 }}>
        {features.map(f => <FeatPill key={f.label} {...f} color={accentColor} />)}
      </div>

      <div style={{ flex: 1 }} />

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <button className="lp-btn-primary" onClick={primaryAction}
          style={{ background: accentColor === '#00FFB2' ? 'linear-gradient(135deg,#00FFB2,#00C9A7)' : accentColor, color: accentColor === '#00FFB2' ? '#000' : '#fff' }}>
          {primaryLabel}
        </button>
        {secondaryLabel && secondaryAction && (
          <button className="lp-btn-secondary" onClick={secondaryAction}>{secondaryLabel}</button>
        )}
      </div>

      {/* Footer note */}
      {footerNote && (
        <div style={{ marginTop: 14, textAlign: 'center', color: '#4b5563', fontSize: 12, paddingLeft: 12 }}>
          {footerNote}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Feature Block
// ─────────────────────────────────────────────────────────
function FeatureBlock({ emoji, title, desc }) {
  return (
    <div className="lp-feature-card">
      <div style={{ fontSize: 34, marginBottom: 14 }}>{emoji}</div>
      <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h4>
      <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Admin Login Modal
// ─────────────────────────────────────────────────────────
const ADMIN_ACCOUNTS = [
  { email: 'jawadadmin1@login.com', password: 'jawad123' },
  { email: 'basheeradmin2@login.com', password: 'basheer123' },
];

function AdminLoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const LOCKOUT_AFTER = 3;

  const handleLogin = async () => {
    if (attempts >= LOCKOUT_AFTER) return;
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const valid = ADMIN_ACCOUNTS.find(a => a.email === email.trim().toLowerCase() && a.password === password);
    if (valid) {
      sessionStorage.setItem('vc_admin_auth', '1');
      sessionStorage.setItem('vc_admin_email', email.trim().toLowerCase());
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= LOCKOUT_AFTER) {
        setError('Too many failed attempts. Contact system administrator.');
      } else {
        setError(`Access denied. Invalid credentials. (${newAttempts}/${LOCKOUT_AFTER} attempts)`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="lp-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lp-modal">
        <button className="lp-modal-close" onClick={onClose}><X size={16} /></button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <VoltLogo size={40} textSize={22} />
          <div style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Admin Access</h2>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 20, padding: '4px 12px',
              color: '#EF4444', fontSize: 11, fontWeight: 700,
            }}>
              <Lock size={10} /> RESTRICTED
            </div>
          </div>
        </div>

        {/* Warning */}
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, padding: '10px 14px', marginBottom: 22, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={14} color="#EF4444" />
          <span style={{ color: '#f87171', fontSize: 12 }}>Unauthorized access is strictly prohibited and logged.</span>
        </div>

        {error && <div className="lp-modal-error" style={{ marginBottom: 18 }}><AlertTriangle size={14} />{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label className="lp-modal-label">Admin Email</label>
          <input className="lp-modal-input" type="email" placeholder="admin@voltconnect.in" value={email}
            onChange={e => setEmail(e.target.value)} disabled={attempts >= LOCKOUT_AFTER} />
        </div>
        <div style={{ marginBottom: 24, position: 'relative' }}>
          <label className="lp-modal-label">Password</label>
          <input className="lp-modal-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            disabled={attempts >= LOCKOUT_AFTER} style={{ paddingRight: 44 }} />
          <button onClick={() => setShowPass(p => !p)} style={{
            position: 'absolute', right: 14, top: 36, background: 'none', border: 'none',
            color: '#6b7280', cursor: 'pointer', padding: 0,
          }}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button onClick={handleLogin} disabled={loading || attempts >= LOCKOUT_AFTER}
          className="lp-btn-primary"
          style={{ background: attempts >= LOCKOUT_AFTER ? '#374151' : '#EF4444', color: '#fff', width: '100%', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Verifying...' : 'Login as Admin'}
        </button>
      </div>
    </div>
  );
}

function PartnerLoginModal({ onClose, onSuccess }) {
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
      const partnerDoc = await loginPartner(id, pin);
      sessionStorage.setItem('vc_partner_auth', '1');
      sessionStorage.setItem('vc_partner_id', id);
      sessionStorage.setItem('vc_partner_name', partnerDoc.companyName || id);
      onSuccess();
    } catch (err) {
      if (err.message === 'suspended') {
        setError('Your account has been suspended. Contact admin.');
      } else if (err.message === 'invalid_credentials') {
        setError('Access denied. Invalid Partner ID or PIN.');
      } else {
        setError('Connection error. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="lp-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="lp-modal">
        <button className="lp-modal-close" onClick={onClose}><X size={16} /></button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <VoltLogo size={40} textSize={22} />
          <div style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Station Partner Login</h2>
            <p style={{ color: '#6b7280', fontSize: 13 }}>Enter your Partner ID and PIN to continue</p>
          </div>
        </div>

        {error && <div className="lp-modal-error" style={{ marginBottom: 18 }}><AlertTriangle size={14} />{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label className="lp-modal-label">Partner ID</label>
          <input className="lp-modal-input" placeholder="e.g. VOLT-HYD-001" value={partnerId}
            onChange={e => setPartnerId(e.target.value.toUpperCase())} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label className="lp-modal-label">PIN (6-digit)</label>
          <input className="lp-modal-input" type="password" inputMode="numeric" maxLength={6}
            placeholder="••••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <button onClick={handleLogin} disabled={loading} className="lp-btn-primary"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', color: '#fff', width: '100%', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Verifying...' : 'Login as Partner'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, color: '#4b5563', fontSize: 12 }}>
          No account yet? Contact{' '}
          <a href="mailto:partner@voltconnect.in" style={{ color: '#7C3AED', textDecoration: 'underline' }}>
            partner@voltconnect.in
          </a>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Landing Page
// ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showDownload, setShowDownload] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  const handleAdminSuccess = () => {
    setShowAdminModal(false);
    window.location.href = '/admin/overview';
  };
  const handlePartnerSuccess = () => {
    setShowPartnerModal(false);
    window.location.href = '/partner/dashboard';
  };

  return (
    <div className="lp-root">
      <style>{GLOBAL_CSS}</style>

      {/* ── Background Effects ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'rgba(0,255,178,0.06)', filter: 'blur(100px)', top: '-15%', left: '-10%', animation: 'floatA 22s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(124,58,237,0.07)', filter: 'blur(100px)', top: '25%', right: '-12%', animation: 'floatB 28s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'rgba(239,68,68,0.05)', filter: 'blur(90px)', bottom: '5%', left: '15%', animation: 'floatC 24s ease-in-out infinite' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="lp-nav">
        <VoltLogo size={34} textSize={18} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 30, padding: '5px 14px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00FFB2', display: 'inline-block', animation: 'livePulse 2s ease-in-out infinite' }} />
          <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 500 }}>All Systems Online</span>
        </div>
      </nav>

      {/* ── Main ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-badge">
            <Zap size={13} /> India's EV Charging Super App
          </div>
          <h1 className="lp-hero-h1">
            The Smarter Way to<br />
            <span className="lp-hero-gradient">Charge Your EV</span>
          </h1>
          <p className="lp-hero-sub">Find stations · Book slots · Save money · Drive further</p>
          <div className="lp-stats">
            <span className="lp-stat-pill">⚡ 1,766+ Stations</span>
            <span style={{ color: '#333', fontSize: 18 }}>·</span>
            <span className="lp-stat-pill">🌆 12 Cities</span>
            <span style={{ color: '#333', fontSize: 18 }}>·</span>
            <span className="lp-stat-pill">🔋 847 Active Now</span>
          </div>
        </section>

        {/* ── PORTAL CARDS ── */}
        <div className="lp-cards" style={{ marginBottom: 88 }}>
          {/* EV Driver */}
          <PortalCard
            accentColor="#00FFB2"
            icon={Zap}
            title="EV Driver"
            features={[
              { emoji: '🗺️', label: 'Find Stations' },
              { emoji: '📅', label: 'Book Slots' },
              { emoji: '🤖', label: 'Volt AI' },
              { emoji: '💎', label: 'Membership' },
            ]}
            primaryLabel="📱 Download the App"
            primaryAction={() => setShowDownload(true)}
            secondaryLabel={<><ExternalLink size={13} /> Open Web Version</>}
            secondaryAction={() => window.open('https://volt-connect-6nja.vercel.app', '_blank', 'noopener,noreferrer')}
            delay={0}
          />

          {/* Station Partner */}
          <PortalCard
            accentColor="#7C3AED"
            icon={Building2}
            title="Station Partner"
            badge="For Business"
            features={[
              { emoji: '📊', label: 'Analytics' },
              { emoji: '🗺️', label: 'Stations' },
              { emoji: '💰', label: 'Revenue' },
              { emoji: '📋', label: 'Bookings' },
            ]}
            primaryLabel="Access Partner Portal →"
            primaryAction={() => setShowPartnerModal(true)}
            footerNote={<span>Apply for access → <a href="mailto:partner@voltconnect.in" style={{ color: '#7C3AED', textDecoration: 'underline' }}>partner@voltconnect.in</a></span>}
            delay={0.08}
          />

          {/* Admin */}
          <PortalCard
            accentColor="#EF4444"
            icon={Shield}
            title="Admin"
            features={[
              { emoji: '⚖️', label: 'Disputes' },
              { emoji: '💸', label: 'Payouts' },
              { emoji: '👤', label: 'Users' },
              { emoji: '⚙️', label: 'Settings' },
            ]}
            primaryLabel="Access Admin Panel →"
            primaryAction={() => setShowAdminModal(true)}
            footerNote="🔐 Restricted — Internal use only"
            delay={0.16}
          />
        </div>

        {/* ── FEATURES ── */}
        <section style={{ padding: '0 0 88px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44, padding: '0 24px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
              Built for the EV generation
            </h2>
            <p style={{ color: '#6b7280', fontSize: 15 }}>Everything you need, from finding a plug to running a network.</p>
          </div>
          <div className="lp-features">
            <FeatureBlock emoji="🗺️" title="Real-Time Station Map" desc="Live availability, connector types, queue depth, and precise navigation — all in one tap." />
            <FeatureBlock emoji="🤖" title="Volt AI Assistant" desc="Ask anything about charging costs, route planning, or station compatibility in plain language." />
            <FeatureBlock emoji="💳" title="Membership Plans" desc="Subscribe to save up to 30% on every session, unlock priority booking, and earn rewards." />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
              <VoltLogo size={26} textSize={16} />
            </div>
            <p style={{ color: '#333', fontSize: 12 }}>Smart EV Charging · India</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 8 }}>Built by</p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { name: 'Mohammed Meraj Uddin', url: 'https://linkedin.com' },
                { name: 'Mohd Basheer Ahmed', url: 'https://linkedin.com' },
              ].map(p => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00FFB2'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                  {p.name} ↗
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginBottom: 18 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <span key={l} style={{ color: '#444', cursor: 'pointer', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00FFB2'}
                onMouseLeave={e => e.currentTarget.style.color = '#444'}>{l}</span>
            ))}
          </div>
          <p style={{ color: '#2a2a2a', fontSize: 12 }}>© 2026 VoltConnect. All rights reserved.</p>
        </footer>
      </div>

      {/* ── Modals ── */}
      {showDownload && <DownloadModal onClose={() => setShowDownload(false)} />}
      {showAdminModal && <AdminLoginModal onClose={() => setShowAdminModal(false)} onSuccess={handleAdminSuccess} />}
      {showPartnerModal && <PartnerLoginModal onClose={() => setShowPartnerModal(false)} onSuccess={handlePartnerSuccess} />}
    </div>
  );
}
