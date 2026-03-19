import { useState } from 'react';
import { User, Car, Calendar, Gift, Bell, Moon, LogOut, Plus, ChevronRight } from 'lucide-react';
import { MOCK_BOOKINGS } from '../../data/seedData';

const MOCK_USER = {
  name: 'Rahul Sharma',
  email: 'rahul.s@gmail.com',
  avatar: 'RS',
  vehicles: [
    { id: 'v1', brand: 'Tata', model: 'Nexon EV Max', connector: 'CCS2', range: 437 },
  ],
};

function VehicleCard({ vehicle }) {
  return (
    <div className="c-card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,200,83,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Car size={20} color="#00C853" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{vehicle.brand} {vehicle.model}</div>
        <div style={{ color: '#9ca3af', fontSize: 12 }}>{vehicle.connector} · Range: {vehicle.range} km</div>
      </div>
    </div>
  );
}

export default function ProfileTab({ onLogout }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const upcoming = MOCK_BOOKINGS.filter(b => b.status === 'upcoming');
  const past = MOCK_BOOKINGS.filter(b => b.status === 'completed');

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      {/* User card */}
      <div className="c-card" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, background: 'linear-gradient(135deg,rgba(0,200,83,0.06),#141414)' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#00C853,#007B33)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {MOCK_USER.avatar}
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{MOCK_USER.name}</div>
          <div style={{ color: '#9ca3af', fontSize: 13 }}>{MOCK_USER.email}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            <span style={{ color: '#6b7280', fontSize: 12 }}><span style={{ color: '#00C853', fontWeight: 700 }}>{past.length}</span> sessions</span>
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 10 }}>My Vehicles</h3>
      {MOCK_USER.vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
      <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141414', border: '1.5px dashed #2d2d2d', borderRadius: 10, padding: '10px 14px', color: '#6b7280', cursor: 'pointer', marginBottom: 20, width: '100%', fontFamily: 'inherit', fontSize: 14 }}>
        <Plus size={16} /> Add Vehicle
      </button>

      {/* Bookings */}
      <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 10 }}>My Bookings</h3>
      <div style={{ marginBottom: 8 }}>
        <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming</div>
        {upcoming.length === 0 ? <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }}>No upcoming bookings</div> : upcoming.map(b => (
          <div key={b.id} className="c-card" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{b.stationName}</span>
              <span className="status-pending" style={{ fontSize: 11 }}>Upcoming</span>
            </div>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>{b.scheduledAt} · {b.duration} min · ₹{b.estimatedCost}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Past</div>
        {past.map(b => (
          <div key={b.id} className="c-card" style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{b.stationName}</span>
              <span className="status-completed" style={{ fontSize: 11 }}>Done</span>
            </div>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>{b.scheduledAt} · ₹{b.estimatedCost}</div>
          </div>
        ))}
      </div>

      {/* Refer card */}
      <div style={{ background: 'linear-gradient(135deg,#007B33,#00C853)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Gift size={32} color="rgba(255,255,255,0.9)" />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Refer & Earn ₹200</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Invite friends to VoltConnect. Both of you get ₹100 VoltWallet credit.</div>
            <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 13, padding: '6px 16px', marginTop: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
              Share Invite Link
            </button>
          </div>
        </div>
      </div>

      {/* Settings */}
      <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Settings</h3>
      <div className="c-card" style={{ marginBottom: 16 }}>
        {[
          { icon: <Bell size={18} />, label: 'Notifications', toggle: notifications, onToggle: setNotifications },
          { icon: <Moon size={18} />, label: 'Dark Mode', toggle: darkMode, onToggle: setDarkMode },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i === 0 ? '1px solid #1e1e1e' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#d1d5db' }}>
              {item.icon} {item.label}
            </div>
            <button onClick={() => item.onToggle(!item.toggle)} style={{
              width: 44, height: 24, borderRadius: 24, border: 'none', cursor: 'pointer', padding: '2px',
              background: item.toggle ? '#00C853' : '#374151',
              transition: 'background 0.2s',
              position: 'relative',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 2, left: item.toggle ? 22 : 2,
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.2)', borderRadius: 10, padding: '12px 16px', color: '#FF1744', cursor: 'pointer', width: '100%', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
