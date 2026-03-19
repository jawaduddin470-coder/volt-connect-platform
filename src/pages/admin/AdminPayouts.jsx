import { useState } from 'react';
import { MOCK_TRANSACTIONS, MOCK_PARTNERS } from '../../data/seedData';

const pendingPartners = [
  { id: 'partner_001', name: 'Ather Energy', pending: 14320 },
  { id: 'partner_002', name: 'Tata Power EV', pending: 38640 },
  { id: 'partner_003', name: 'Statiq', pending: 9012 },
];

export default function AdminPayouts() {
  const [paid, setPaid] = useState([]);

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Payouts</h1>
      <div className="p-card" style={{ marginBottom: 16, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <p style={{ color: '#065f46', fontSize: 13, fontWeight: 500 }}>💰 Payouts are processed every Monday. Commission is deducted before transfer.</p>
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>Pending Payouts</h3>
      {pendingPartners.map(p => (
        <div key={p.id} className="p-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{p.name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#00C853' }}>₹{p.pending.toLocaleString()}</div>
          </div>
          {paid.includes(p.id) ? (
            <span className="status-completed">Paid ✓</span>
          ) : (
            <button className="btn-primary" onClick={() => setPaid([...paid, p.id])}>Mark as Paid</button>
          )}
        </div>
      ))}
    </div>
  );
}
