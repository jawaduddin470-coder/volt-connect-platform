import { useState } from 'react';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, Zap } from 'lucide-react';

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

const MOCK_TXN = [
  { id: 't1', type: 'charge', label: 'Ather Grid - Hitech City', date: 'Mar 19', amount: -700 },
  { id: 't2', type: 'cashback', label: 'Cashback on session', date: 'Mar 19', amount: +14 },
  { id: 't3', type: 'charge', label: 'Statiq - Gachibowli', date: 'Mar 17', amount: -560 },
  { id: 't4', type: 'topup', label: 'Wallet Top-up via UPI', date: 'Mar 15', amount: +1000 },
  { id: 't5', type: 'charge', label: 'Tata Power EZ - Banjara Hills', date: 'Mar 14', amount: -420 },
];

export default function WalletTab() {
  const [balance, setBalance] = useState(334);
  const [transactions] = useState(MOCK_TXN);
  const [topping, setTopping] = useState(false);

  const handleTopUp = (amount) => {
    setBalance(b => b + amount);
    setTopping(false);
  };

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      {/* Balance card */}
      <div style={{ background: 'linear-gradient(135deg,#007B33,#00C853)', borderRadius: 16, padding: 24, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', right: 30, bottom: -30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Zap size={18} color="rgba(255,255,255,0.8)" />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 500 }}>VoltWallet Balance</span>
        </div>
        <div style={{ color: '#fff', fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
          ₹{balance.toFixed(2)}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 24, padding: '4px 12px' }}>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>🎉 Earn 2% cashback on every charge</span>
        </div>
      </div>

      {/* Quick add */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Quick Add</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {QUICK_AMOUNTS.map(amt => (
            <button key={amt} onClick={() => handleTopUp(amt)} style={{
              background: '#141414', border: '1px solid #2d2d2d', borderRadius: 8, padding: '12px 0',
              color: '#00C853', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.target.style.background = 'rgba(0,200,83,0.12)'; e.target.style.borderColor = '#00C853'; }}
              onMouseLeave={e => { e.target.style.background = '#141414'; e.target.style.borderColor = '#2d2d2d'; }}>
              +₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Recent Transactions</h3>
      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <Wallet size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div>No transactions yet</div>
        </div>
      ) : (
        transactions.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #1e1e1e' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: t.amount > 0 ? 'rgba(0,200,83,0.12)' : 'rgba(255,23,68,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {t.type === 'cashback' ? <Plus size={16} color="#00C853" /> :
               t.amount > 0 ? <ArrowDownLeft size={16} color="#00C853" /> : <Zap size={16} color="#FF1744" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{t.label}</div>
              <div style={{ color: '#6b7280', fontSize: 12 }}>{t.date}</div>
            </div>
            <div style={{ color: t.amount > 0 ? '#00C853' : '#FF1744', fontWeight: 700, fontSize: 15 }}>
              {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
