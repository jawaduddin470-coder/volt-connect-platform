import { MOCK_TRANSACTIONS } from '../../data/seedData';

export default function PartnerRevenue() {
  const total = MOCK_TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
  const commission = MOCK_TRANSACTIONS.reduce((s, t) => s + t.commission, 0);
  const net = MOCK_TRANSACTIONS.reduce((s, t) => s + t.netPayout, 0);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 24 }}>Revenue</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
        <div className="p-card">
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Total Earned</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e' }}>₹{total.toFixed(0)}</div>
        </div>
        <div className="p-card">
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>VoltConnect Commission</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#FF1744' }}>−₹{commission.toFixed(0)}</div>
        </div>
        <div className="p-card">
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Net Payout</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#00C853' }}>₹{net.toFixed(0)}</div>
        </div>
      </div>

      <div className="p-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Payout Schedule</h3>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Payouts processed every Monday to registered bank account.</p>
        <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Account Holder','Ather Energy Pvt Ltd'],['Bank','HDFC Bank'],['IFSC','HDFC0001234'],['Account','••••••7890']].map(([l,v])=>(
              <div key={l}>
                <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>{l}</div>
                <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontWeight: 700, color: '#1a1a2e' }}>Transaction Ledger</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Txn ID</th><th>Booking</th><th>Amount</th><th>Commission</th><th>Net Payout</th><th>Method</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map(t => (
                <tr key={t.id}>
                  <td style={{ color: '#1565C0', fontWeight: 600, fontSize: 13 }}>{t.id}</td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{t.bookingId}</td>
                  <td style={{ fontWeight: 700 }}>₹{t.amount}</td>
                  <td style={{ color: '#FF1744', fontWeight: 600 }}>₹{t.commission.toFixed(1)}</td>
                  <td style={{ color: '#00C853', fontWeight: 700 }}>₹{t.netPayout.toFixed(1)}</td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{t.method}</td>
                  <td><span className={`status-${t.status === 'completed' ? 'completed' : 'pending'}`}>{t.status}</span></td>
                  <td style={{ fontSize: 13, color: '#6b7280' }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
