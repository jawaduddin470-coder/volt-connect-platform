import { useState } from 'react';
import { Zap, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PartnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,#007B33,#00C853)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Zap size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e' }}>Partner Portal</h1>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>VoltConnect for Charging Operators</p>
        </div>

        <div className="p-card">
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#374151', marginBottom: 6, display: 'block', fontWeight: 500 }}>Work Email</label>
            <input className="input-light" placeholder="ops@yourcompany.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: '#374151', marginBottom: 6, display: 'block', fontWeight: 500 }}>Password</label>
            <input className="input-light" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }} onClick={() => navigate('/partner/dashboard')}>
            Sign In to Partner Portal
          </button>
          <div style={{ textAlign: 'center', marginTop: 14, color: '#9ca3af', fontSize: 13 }}>
            Not a partner yet?{' '}
            <span style={{ color: '#00C853', cursor: 'pointer', fontWeight: 600 }}>Request Access →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
