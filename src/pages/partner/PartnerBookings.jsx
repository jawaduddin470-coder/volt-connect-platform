import { useState } from 'react';
import { MOCK_BOOKINGS } from '../../data/seedData';
import { Download } from 'lucide-react';

const TABS = ['upcoming', 'active', 'completed', 'cancelled'];

export default function PartnerBookings() {
  const [tab, setTab] = useState('upcoming');
  const filtered = MOCK_BOOKINGS.filter(b => b.status === tab);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Bookings</h1>
        <button className="btn-secondary"><Download size={14} /> Export CSV</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? '#1a1a2e' : '#6b7280',
            fontWeight: tab === t ? 600 : 400, fontSize: 14, fontFamily: 'inherit',
            boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            textTransform: 'capitalize',
          }}>
            {t} <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>
              ({MOCK_BOOKINGS.filter(b => b.status === t).length})
            </span>
          </button>
        ))}
      </div>

      <div className="p-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Station</th>
                <th>Connector</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>VC Fee (8%)</th>
                <th>Net Payout</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>No {tab} bookings</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600, color: '#1565C0', fontSize: 13 }}>{b.id}</td>
                  <td style={{ color: '#6b7280', fontSize: 13 }}>{b.userName}</td>
                  <td style={{ fontWeight: 500, fontSize: 13, color: '#1a1a2e' }}>{b.stationName.split(' - ')[0]}</td>
                  <td>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: '#f3f4f6', color: '#374151', fontWeight: 600 }}>
                      {b.connectorType}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{b.scheduledAt}</td>
                  <td style={{ fontSize: 13 }}>{b.duration} min</td>
                  <td style={{ fontWeight: 700 }}>₹{b.estimatedCost}</td>
                  <td style={{ color: '#FF1744', fontWeight: 600 }}>₹{b.commissionAmount.toFixed(1)}</td>
                  <td style={{ fontWeight: 700, color: '#00C853' }}>₹{b.netPartnerAmount.toFixed(1)}</td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{b.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
