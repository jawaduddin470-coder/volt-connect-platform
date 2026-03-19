import { useState, useEffect } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { createUserProfile } from '../services/firestoreService';
import {
  getAuthAttempts, getLockoutRemaining, recordFailedAttempt,
  resetAuthAttempts, getCooldownSeconds, getFriendlyAuthError
} from '../utils/authLimiter';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const lockRemaining = getLockoutRemaining();
    if (lockRemaining > 0) setCountdown(lockRemaining);
    else {
      const attempts = getAuthAttempts();
      const cd = getCooldownSeconds(attempts.count);
      if (cd > 0) setCountdown(cd);
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(cred.user.uid, {
          name: name || email.split('@')[0],
          email,
          phone: '',
          joined: new Date().toISOString().split('T')[0],
          totalSessions: 0,
          totalSpent: 0,
          status: 'active',
          role: 'consumer'
        });
      }
      resetAuthAttempts();
      onLogin();
    } catch (err) {
      const msg = getFriendlyAuthError(err);
      setError(msg);
      const newCount = recordFailedAttempt();
      const cd = getCooldownSeconds(newCount);
      if (cd > 0) setCountdown(cd);
    } finally {
      setLoading(false);
    }
  };

  const attempts = getAuthAttempts();
  const isLocked = getLockoutRemaining() > 0 || (countdown > 0 && attempts.count >= 5);
  const isCooldown = countdown > 0 && attempts.count >= 3 && attempts.count < 5;

  return (
    <div className="consumer-surface" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: 24 }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#007B33,#00C853)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(0,200,83,0.3)' }}>
          <Zap size={36} color="#fff" fill="#fff" />
        </div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>VoltConnect</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>India's EV Charging Super App</p>
      </div>

      {/* Card */}
      <div className="c-card" style={{ width: '100%', maxWidth: 400, padding: 28 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#1e1e1e', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '8px 0', borderRadius: 8,
              background: mode === m ? '#00C853' : 'transparent',
              color: mode === m ? '#000' : '#9ca3af',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
              textTransform: 'capitalize', transition: 'all 0.2s'
            }}>
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Warnings */}
        {isCooldown && (
          <div style={{ background: 'rgba(255,214,0,0.1)', border: '1px solid rgba(255,214,0,0.3)', borderRadius: 8, padding: '10px 12px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertTriangle size={16} color="#FFD600" />
            <span style={{ color: '#FFD600', fontSize: 13 }}>Too many attempts. Wait {formatTime(countdown)}.</span>
          </div>
        )}
        {isLocked && (
          <div style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)', borderRadius: 8, padding: '10px 12px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertTriangle size={16} color="#FF1744" />
            <span style={{ color: '#FF1744', fontSize: 13 }}>Account locked. Unlock in {formatTime(countdown)}.</span>
          </div>
        )}
        {error && !isLocked && !isCooldown && (
          <div style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.25)', borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
            <span style={{ color: '#FF1744', fontSize: 13 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>Your Name</label>
              <input className="input-dark" type="text" placeholder="e.g. Rahul Sharma"
                value={name} onChange={e => setName(e.target.value)} disabled={isLocked || loading} />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
              <input className="input-dark" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: 36 }} required disabled={isLocked || loading} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
              <input className="input-dark" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: 36, paddingRight: 40 }} required disabled={isLocked || loading} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 15 }}
            disabled={loading || isLocked || countdown > 0}>
            {loading ? 'Verifying...' : countdown > 0 ? `Wait ${formatTime(countdown)}` : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', color: '#4b5563', fontSize: 12 }}>
          Demo: <span style={{ color: '#6b7280' }}>Any Firebase account or create new</span>
        </div>
      </div>
    </div>
  );
}
