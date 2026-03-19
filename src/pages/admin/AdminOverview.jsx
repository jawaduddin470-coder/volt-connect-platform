import { useState, useEffect } from 'react';
import { 
  MOCK_USERS, 
  MOCK_PARTNERS, 
  MOCK_BOOKINGS as MOCK_BOOKINGS_DATA, 
  MOCK_TRANSACTIONS as MOCK_TRANSACTIONS_DATA, 
  STATIONS as MOCK_STATIONS,
  SEED_ALL
} from '../../data/seedData';
import { subscribeToCollection, seedFirestore } from '../../services/firestoreService';
import { Database, RefreshCw, CheckCircle } from 'lucide-react';

const KPI = ({ label, value, color, sub }) => (
  <div className="p-card">
    <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 800, color: color || '#1a1a2e' }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
  </div>
);

export default function AdminOverview() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [partners, setPartners] = useState(MOCK_PARTNERS);
  const [stations, setStations] = useState(MOCK_STATIONS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS_DATA);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS_DATA);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const unsubUsers = subscribeToCollection('users', setUsers);
    const unsubPartners = subscribeToCollection('partners', setPartners);
    const unsubStations = subscribeToCollection('stations', setStations);
    const unsubBookings = subscribeToCollection('bookings', (data) => setBookings(data.sort((a,b) => b.createdAt?.seconds - a.createdAt?.seconds)));
    const unsubTransactions = subscribeToCollection('transactions', setTransactions);

    return () => {
      unsubUsers();
      unsubPartners();
      unsubStations();
      unsubBookings();
      unsubTransactions();
    };
  }, []);

  const handleSeed = async () => {
    if (!window.confirm("Seed Firestore with initial data? This will overwrite existing IDs.")) return;
    setSeeding(true);
    try {
      await seedFirestore(SEED_ALL);
      setSeeded(true);
      setTimeout(() => setSeeded(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Seeding failed. Check console.");
    } finally {
      setSeeding(false);
    }
  };

  const totalRevenue = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const totalSessions = stations.reduce((s, st) => s + (st.sessionsToday || 0), 0);
  const pendingPayouts = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + (t.netPayout || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 2 }}>Platform Overview</h1>
          <p style={{ color: '#6b7280', fontSize: 13 }}>Real-time platform health dashboard</p>
        </div>
        <button 
          onClick={handleSeed}
          disabled={seeding}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, 
            background: seeded ? '#00C853' : '#1a1a2e', color: '#fff', border: 'none', 
            fontSize: 13, fontWeight: 600, cursor: 'pointer' 
          }}
        >
          {seeding ? <RefreshCw size={14} className="spin" /> : seeded ? <CheckCircle size={14} /> : <Database size={14} />}
          {seeding ? 'Seeding...' : seeded ? 'Database Seeded' : 'Seed Database'}
        </button>
      </div>

      {/* Warning banner */}
      <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ color: '#dc2626', fontSize: 13, fontWeight: 600 }}>⚠ ADMIN ACCESS ONLY</span>
        <span style={{ color: '#6b7280', fontSize: 13 }}>Internal use – VoltConnect operations team</span>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
        <KPI label="Total Users" value={users.length} color="#1565C0" />
        <KPI label="Total Partners" value={partners.length} color="#1565C0" />
        <KPI label="Total Stations" value={stations.length} color="#1565C0" />
        <KPI label="All-time Revenue" value={`₹${(totalRevenue/1000).toFixed(1)}K`} color="#00C853" />
        <KPI label="Sessions Today" value={totalSessions} sub="Across all stations" />
        <KPI label="Pending Payouts" value={`₹${pendingPayouts.toFixed(0)}`} color="#FF1744" />
      </div>

      {/* Recent activity */}
      <div className="p-card" style={{ marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 12, fontSize: 14 }}>Recent Activity (Last 10 Bookings)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ fontSize: 12 }}>
            <thead>
              <tr><th>Booking ID</th><th>User</th><th>Station</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {bookings.slice(0, 10).map(b => (
                <tr key={b.id || b.bookingId}>
                  <td style={{ color: '#1565C0', fontWeight: 600 }}>{b.bookingId || b.id}</td>
                  <td>{b.userName || b.userEmail?.split('@')[0]}</td>
                  <td>{b.stationName?.split(' - ')[0]}</td>
                  <td style={{ fontWeight: 700 }}>₹{b.estimatedCost || b.cost}</td>
                  <td><span className={`status-${b.status === 'completed' ? 'completed' : b.status === 'cancelled' ? 'inactive' : b.status === 'active' ? 'active' : 'pending'}`}>{b.status}</span></td>
                  <td style={{ color: '#6b7280' }}>{b.scheduledAt?.split(' ')[0] || b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System health */}
      <div className="p-card">
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 12, fontSize: 14 }}>System Health</h3>
        {[['Firebase Auth','Operational'],['Cloud Firestore','Operational'],['Razorpay API','Operational'],['OpenRouter AI','Degraded – 429 errors detected']].map(([s,v])=>(
          <div key={s} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid #f3f4f6' }}>
            <span style={{ fontSize:13, color:'#374151' }}>{s}</span>
            <span style={{ fontSize:12, fontWeight:600, color: v.startsWith('Operational') ? '#00C853' : '#FFD600' }}>
              {v.startsWith('Operational') ? '● ' : '◐ '}{v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
