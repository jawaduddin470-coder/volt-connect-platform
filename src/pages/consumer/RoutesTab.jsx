import { useState } from 'react';
import { Navigation, Zap, Battery, RotateCcw } from 'lucide-react';

const MOCK_STOPS = [
  { id: 1, name: 'Ather Grid - Hitech City', distance: '45 km from origin', chargeTime: '~35 min', chargeNeeded: '18%', connectorType: 'CCS2 50kW' },
  { id: 2, name: 'Tata Power EZ - Banjara Hills', distance: '112 km from origin', chargeTime: '~25 min', chargeNeeded: '12%', connectorType: 'CCS2 60kW' },
];

export default function RoutesTab() {
  const [origin, setOrigin] = useState('');
  const [dest, setDest] = useState('');
  const [battery, setBattery] = useState(60);
  const [range, setRange] = useState(300);
  const [planned, setPlanned] = useState(false);

  const batteryColor = battery > 60 ? '#00C853' : battery > 30 ? '#FFD600' : '#FF1744';

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Smart Route Planner
        </h2>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Plan your trip with optimal charging stops</p>
      </div>

      <div className="c-card" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>📍 Origin</label>
          <input className="input-dark" placeholder="e.g., Hyderabad" value={origin} onChange={e => setOrigin(e.target.value)} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>🏁 Destination</label>
          <input className="input-dark" placeholder="e.g., Vijayawada" value={dest} onChange={e => setDest(e.target.value)} />
        </div>

        {/* Battery slider */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ color: '#9ca3af', fontSize: 12 }}>🔋 Current Battery</label>
            <span style={{ color: batteryColor, fontWeight: 700, fontSize: 14 }}>{battery}%</span>
          </div>
          <input type="range" min="0" max="100" value={battery}
            onChange={e => setBattery(Number(e.target.value))}
            style={{ width: '100%', accentColor: batteryColor }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>🚗 Vehicle Range (km)</label>
          <input className="input-dark" type="number" value={range} onChange={e => setRange(Number(e.target.value))} placeholder="300" />
        </div>

        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}
          onClick={() => setPlanned(true)} disabled={!origin || !dest}>
          <Navigation size={16} /> Plan Route
        </button>
      </div>

      {planned && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ color: '#9ca3af', fontSize: 13 }}>{origin} → {dest}</span>
            <button style={{ background: 'none', border: 'none', color: '#00C853', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: 'inherit' }}
              onClick={() => setPlanned(false)}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Route summary card */}
          <div className="c-card" style={{ marginBottom: 16, background: 'linear-gradient(135deg,rgba(0,200,83,0.06),#141414)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>~178 km</div>
                <div style={{ color: '#9ca3af', fontSize: 11 }}>Total Distance</div>
              </div>
              <div>
                <div style={{ color: '#00C853', fontWeight: 700, fontSize: 20 }}>2</div>
                <div style={{ color: '#9ca3af', fontSize: 11 }}>Charging Stops</div>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>~3h 40m</div>
                <div style={{ color: '#9ca3af', fontSize: 11 }}>Total ETA</div>
              </div>
            </div>
          </div>

          {/* Stops */}
          <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Suggested Charging Stops</h3>
          {MOCK_STOPS.map((stop, i) => (
            <div key={stop.id} className="c-card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,200,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#00C853', fontWeight: 700, fontSize: 14 }}>{i + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{stop.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6 }}>{stop.distance}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}><Zap size={11} style={{ display: 'inline' }} /> {stop.connectorType}</span>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>⏱ {stop.chargeTime}</span>
                    <span style={{ color: '#FFD600', fontSize: 12 }}>+{stop.chargeNeeded} charge</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
