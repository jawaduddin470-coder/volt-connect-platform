import { MOCK_TRANSACTIONS } from '../../data/seedData';
import { Download } from 'lucide-react';

export default function AdminTransactions() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>Transactions</h1>
        <button className="btn-secondary"><Download size={14} /> Export</button>
      </div>
      <div className="p-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: 13 }}>
            <thead>
              <tr><th>Txn ID</th><th>Booking</th><th>Partner</th><th>Amount</th><th>Commission</th><th>Net Payout</th><th>Method</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map(t => (
                <tr key={t.id}>
                  <td style={{ color: '#1565C0', fontWeight: 600 }}>{t.id}</td>
                  <td style={{ color: '#6b7280' }}>{t.bookingId}</td>
                  <td style={{ fontWeight: 500 }}>{t.partnerName}</td>
                  <td style={{ fontWeight: 700 }}>₹{t.amount}</td>
                  <td style={{ color: '#FF1744', fontWeight: 600 }}>₹{t.commission.toFixed(1)}</td>
                  <td style={{ color: '#00C853', fontWeight: 700 }}>₹{t.netPayout.toFixed(1)}</td>
                  <td style={{ color: '#6b7280' }}>{t.method}</td>
                  <td><span className={`status-${t.status === 'completed' ? 'completed' : 'pending'}`}>{t.status}</span></td>
                  <td style={{ color: '#6b7280' }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
