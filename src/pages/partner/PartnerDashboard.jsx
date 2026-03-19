import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
  REVENUE_CHART_DATA, 
  CONNECTOR_DONUT_DATA, 
  HEATMAP_DATA, 
  STATIONS as MOCK_STATIONS 
} from '../../data/seedData';
import { subscribeToCollection } from '../../services/firestoreService';

const KPI = ({ label, value, sub, color }) => (
  <div className="p-card">
    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: color || '#1a1a2e', marginBottom: 4 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: '#9ca3af' }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.name === 'revenue' ? '₹' : ''}{p.value.toLocaleString()}</div>
      ))}
    </div>
  );
};

export default function PartnerDashboard() {
  const [stations, setStations] = useState(MOCK_STATIONS);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubStations = subscribeToCollection('stations', setStations);
    const unsubTrans = subscribeToCollection('transactions', setTransactions);
    return () => {
      unsubStations();
      unsubTrans();
    };
  }, []);

  const totalRevenue = transactions.reduce((s, d) => s + (d.amount || 0), 0);
  const totalSessions = stations.reduce((s, st) => s + (st.sessionsToday || 0), 0);
  
  const last7Transactions = transactions.slice(-7);
  const revChange = 12.5; // Simplified for now

  const { days, data } = HEATMAP_DATA;
  const hours = Array.from({length:24},(_,i)=>i);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Welcome back · Ather Energy</p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginBottom: 24 }}>
        <KPI label="Revenue (Live)" value={`₹${(totalRevenue/1000).toFixed(1)}K`} sub={`+${revChange}% vs last week`} color="#00C853" />
        <KPI label="Active Stations" value={`${stations.length} / ${stations.length}`} sub="All online" />
        <KPI label="Sessions Today" value={String(totalSessions)} sub="Across all stations" />
        <KPI label="Avg Session Duration" value="47 min" sub="↑ 3 min vs yesterday" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 24 }}>
        {/* Revenue line chart */}
        <div className="p-card">
          <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Revenue – Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={REVENUE_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#00C853" strokeWidth={2} dot={false} name="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="p-card">
          <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Sessions by Connector</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CONNECTOR_DONUT_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {CONNECTOR_DONUT_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v,n) => [`${v}%`, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="p-card">
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Peak Usage Heatmap</h3>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ width: 40, flexShrink: 0 }} />
          {hours.filter(h=>h%4===0).map(h=>(
            <div key={h} style={{ flex: 1, fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>{h}:00</div>
          ))}
        </div>
        {days.map(day => (
          <div key={day} style={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
            <div style={{ width: 38, fontSize: 11, color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>{day}</div>
            {hours.map(h => {
              const cell = data.find(d => d.day === day && d.hour === h);
              const intensity = cell?.intensity || 0;
              return (
                <div key={h} title={`${day} ${h}:00 – ${Math.round(intensity*100)}% usage`}
                  style={{ flex: 1, height: 18, borderRadius: 3, cursor: 'pointer',
                    background: intensity > 0.7 ? '#00C853' : intensity > 0.4 ? '#4ade80' : intensity > 0.2 ? '#bbf7d0' : '#f0fdf4',
                    opacity: intensity > 0.05 ? 1 : 0.3,
                  }} />
              );
            })}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, justifyContent: 'flex-end' }}>
          {[['Low','#bbf7d0'],['Medium','#4ade80'],['High','#00C853']].map(([l,c])=>(
            <div key={l} style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 11, color: '#6b7280' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: c }} /> {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
