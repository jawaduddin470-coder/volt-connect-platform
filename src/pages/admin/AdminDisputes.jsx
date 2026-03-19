import { useState } from 'react';
import { MOCK_DISPUTES } from '../../data/seedData';

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);

  const updateStatus = (id, status) => setDisputes(d => d.map(x => x.id === id ? { ...x, status } : x));

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Disputes</h1>
      {disputes.map(d => (
        <div key={d.id} className="p-card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#1565C0', fontWeight: 700, fontSize: 13 }}>{d.id}</span>
            <span className={`status-${d.status === 'open' ? 'inactive' : d.status === 'under_review' ? 'pending' : 'completed'}`} style={{ fontSize: 12 }}>
              {d.status.replace('_', ' ')}
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>{d.reason}</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
            User: {d.userName} · Partner: {d.partnerName} · Amount: ₹{d.amount} · {d.createdAt}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {d.status === 'open' && (
              <button onClick={() => updateStatus(d.id, 'under_review')} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, background: 'none', border: '1px solid #1565C0', color: '#1565C0', cursor: 'pointer', fontFamily: 'inherit' }}>
                Mark Under Review
              </button>
            )}
            {d.status !== 'resolved' && (
              <>
                <button onClick={() => updateStatus(d.id, 'resolved')} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, background: 'none', border: '1px solid #6ee7b7', color: '#047857', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Resolve
                </button>
                <button style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, background: 'none', border: '1px solid #fca5a5', color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Issue Refund (Mock)
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
