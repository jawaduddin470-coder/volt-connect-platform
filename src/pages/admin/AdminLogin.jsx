import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const ADMIN_EMAIL = 'vcbashmeraj@admin.in';
const ADMIN_PASS = 'Jawadbash12';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Ensure they use the correct admin email for this specific entry
      if (email !== ADMIN_EMAIL) {
        throw new Error('This login is restricted to authorized admin accounts.');
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/overview');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#F5F7FA', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Shield size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Admin Access</h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>VoltConnect Internal Team Only</p>
        </div>

        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={16} color="#dc2626" />
          <span style={{ color: '#dc2626', fontSize: 13, fontWeight: 500 }}>Unauthorized access is strictly prohibited and logged.</span>
        </div>

        <div className="p-card">
          {error && <div style={{ background: '#fee2e2', borderRadius: 6, padding: '8px 12px', marginBottom: 14, color: '#dc2626', fontSize: 13 }}>{error}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#374151', marginBottom: 5, display: 'block', fontWeight: 500 }}>Admin Email</label>
            <input className="input-light" placeholder="admin@voltconnect.in" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#374151', marginBottom: 5, display: 'block', fontWeight: 500 }}>Password</label>
            <input className="input-light" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', background: '#1565C0' }} onClick={handleLogin}>
            Access Admin Panel
          </button>
          <div style={{ textAlign: 'center', marginTop: 12, color: '#9ca3af', fontSize: 12 }}>
            Demo: admin@voltconnect.in / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
