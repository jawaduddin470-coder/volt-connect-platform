import { useState } from 'react';
import { MOCK_PARTNERS } from '../../data/seedData';

export default function AdminPartners() {
  const [commissionEditing, setCommissionEditing] = useState(null);
  const [partners, setPartners] = useState(MOCK_PARTNERS);

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Partners</h1>
      <div className="p-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: 13 }}>
            <thead>
              <tr><th>Company</th><th>Contact</th><th>Stations</th><th>Monthly Revenue</th><th>Commission %</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.companyName}</td>
                  <td style={{ color: '#6b7280' }}>{p.contactEmail}</td>
                  <td style={{ fontWeight: 600 }}>{p.stations}</td>
                  <td style={{ fontWeight: 700, color: '#00C853' }}>₹{p.monthlyRevenue.toLocaleString()}</td>
                  <td>
                    {commissionEditing === p.id ? (
                      <input type="number" min="5" max="15" defaultValue={p.commissionRate}
                        style={{ width: 60, padding: '2px 6px', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 13 }}
                        onBlur={e => {
                          setPartners(prev => prev.map(x => x.id === p.id ? { ...x, commissionRate: Number(e.target.value) } : x));
                          setCommissionEditing(null);
                        }} autoFocus />
                    ) : (
                      <span onClick={() => setCommissionEditing(p.id)}
                        style={{ cursor: 'pointer', fontWeight: 700, color: '#1565C0', textDecoration: 'underline dotted' }}>
                        {p.commissionRate}%
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={p.status === 'active' ? 'status-active' : 'status-pending'}>{p.status}</span>
                  </td>
                  <td style={{ color: '#6b7280' }}>{p.joined}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {p.status === 'pending' && <button style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'none', border: '1px solid #6ee7b7', color: '#047857', cursor: 'pointer', fontFamily: 'inherit' }}>Approve</button>}
                      <button style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'none', border: '1px solid #fca5a5', color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}>Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
