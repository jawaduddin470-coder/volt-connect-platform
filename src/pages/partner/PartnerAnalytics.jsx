import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { STATIONS, HEATMAP_DATA } from '../../data/seedData';

const TOP_STATIONS = STATIONS.map(s => ({ name: s.name.split(' - ')[0], revenue: s.revenueToday, sessions: s.sessionsToday }));

export default function PartnerAnalytics() {
  const { days, data } = HEATMAP_DATA;
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 24 }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="p-card">
          <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>User Return Rate</h3>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#00C853' }}>68%</div>
          <div style={{ color: '#9ca3af', fontSize: 13 }}>Users who charged more than once</div>
        </div>
        <div className="p-card">
          <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Avg kWh Dispensed</h3>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#1565C0' }}>18.4 kWh</div>
          <div style={{ color: '#9ca3af', fontSize: 13 }}>Per session average</div>
        </div>
      </div>

      <div className="p-card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Top Performing Stations (Today)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={TOP_STATIONS} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} tickFormatter={v => `₹${v}`} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#374151' }} tickLine={false} width={120} />
            <Tooltip formatter={v => `₹${v}`} />
            <Bar dataKey="revenue" fill="#00C853" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="p-card">
        <h3 style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Demand Heatmap (7×24)</h3>
        {days.map(day => (
          <div key={day} style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <div style={{ width: 38, fontSize: 11, color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>{day}</div>
            {hours.map(h => {
              const cell = data.find(d => d.day === day && d.hour === h);
              const intensity = cell?.intensity || 0;
              return <div key={h} style={{ flex: 1, height: 16, borderRadius: 2,
                background: intensity > 0.7 ? '#00C853' : intensity > 0.4 ? '#4ade80' : intensity > 0.2 ? '#bbf7d0' : '#f0fdf4',
                opacity: intensity > 0.05 ? 1 : 0.3 }} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
