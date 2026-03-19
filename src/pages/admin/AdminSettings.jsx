import { useState } from 'react';

export default function AdminSettings() {
  const [commission, setCommission] = useState(8);
  const [maintenance, setMaintenance] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 20 }}>Platform Settings</h1>

      <div className="p-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Global Commission Rate</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input type="range" min="5" max="15" value={commission} onChange={e => setCommission(e.target.value)}
            style={{ flex: 1, accentColor: '#00C853' }} />
          <span style={{ fontWeight: 800, fontSize: 22, color: '#00C853', minWidth: 50 }}>{commission}%</span>
        </div>
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>Applied to all new bookings. Affects partners without custom override.</p>
      </div>

      <div className="p-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 2 }}>Maintenance Mode</h3>
            <p style={{ color: '#9ca3af', fontSize: 13 }}>Consumer app shows "Under Maintenance" banner</p>
          </div>
          <button onClick={() => setMaintenance(!maintenance)} style={{
            width: 48, height: 26, borderRadius: 24, border: 'none', cursor: 'pointer', padding: 2,
            background: maintenance ? '#FF1744' : '#d1d5db', position: 'relative', flexShrink: 0,
          }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: maintenance ? 24 : 2, transition: 'left 0.2s' }} />
          </button>
        </div>
      </div>

      <div className="p-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>Announcement Banner</h3>
        <input className="input-light" placeholder="e.g. Server maintenance on Sunday 2–4 AM" value={announcement} onChange={e => setAnnouncement(e.target.value)} style={{ marginBottom: 10 }} />
        <button className="btn-primary">Publish Banner</button>
      </div>
    </div>
  );
}
