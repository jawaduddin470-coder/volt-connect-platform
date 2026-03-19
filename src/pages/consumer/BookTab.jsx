import { useState, useEffect } from 'react';
import { STATIONS as MOCK_STATIONS } from '../../data/seedData';
import { MapPin, Clock, Zap, QrCode, CheckCircle, ChevronLeft } from 'lucide-react';
import { createBooking } from '../../services/firestoreService';

function ConnectorCard({ conn }) {
  const color = conn.status === 'available' ? '#00C853' : conn.status === 'occupied' ? '#FF1744' : '#6b7280';
  return (
    <div className="c-card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{conn.type}</span>
        <span style={{ color, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{conn.status}</span>
      </div>
      <div style={{ color: '#9ca3af', fontSize: 12 }}>
        {conn.powerKW}kW · ₹{conn.pricePerUnit}/kWh
      </div>
    </div>
  );
}

function BookingConfirmation({ booking, onDone }) {
  return (
    <div style={{ padding: 24, textAlign: 'center', paddingBottom: 80 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,200,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <CheckCircle size={32} color="#00C853" />
      </div>
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Booking Confirmed!</h2>
      <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>Your slot has been reserved successfully.</p>

      {/* QR Code Placeholder */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, display: 'inline-block', marginBottom: 24 }}>
        <div style={{ width: 140, height: 140, background: '#0A0A0A', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <QrCode size={48} color="#00C853" />
          <span style={{ color: '#6b7280', fontSize: 10 }}>Scan at charger</span>
        </div>
      </div>

      <div className="c-card" style={{ textAlign: 'left', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Booking ID</span>
          <span style={{ color: '#00C853', fontWeight: 700, fontSize: 13 }}>{booking.id}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Station</span>
          <span style={{ color: '#fff', fontSize: 13 }}>{booking.station}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Time</span>
          <span style={{ color: '#fff', fontSize: 13 }}>{booking.time}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Est. Cost</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>₹{booking.cost}</span>
        </div>
      </div>
      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onDone}>Done</button>
    </div>
  );
}

export default function BookTab({ selectedStation, onBack }) {
  const station = selectedStation || MOCK_STATIONS[0];
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [selectedConnector, setSelectedConnector] = useState(
    station.connectors.find(c => c.status === 'available') || station.connectors[0]
  );
  const [confirmed, setConfirmed] = useState(null);

  const estimatedCost = Math.round((selectedConnector.powerKW * (duration / 60) * selectedConnector.pricePerUnit));

  const handleBook = async () => {
    const bookingId = 'VC' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const bookingData = {
      bookingId,
      stationId: station.id,
      stationName: station.name,
      connectorId: selectedConnector.id,
      connectorType: selectedConnector.type,
      date,
      time,
      duration,
      cost: estimatedCost,
      userEmail: 'test@voltconnect.in' // Mock user for now
    };

    try {
      await createBooking(bookingData);
      setConfirmed({ id: bookingId, station: station.name, time: `${date} ${time}`, cost: estimatedCost });
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please check your connection.");
    }
  };

  if (confirmed) return <BookingConfirmation booking={confirmed} onDone={() => setConfirmed(null)} />;

  return (
    <div style={{ padding: '0 16px 80px' }}>
      {/* Station header */}
      <div style={{ background: 'linear-gradient(135deg,#141414,#1a1a1a)', borderRadius: 12, marginBottom: 16, overflow: 'hidden', border: '1px solid #1e1e1e' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(0,200,83,0.08),transparent)', padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Zap size={20} color="#00C853" />
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>{station.name}</h2>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>
            <MapPin size={12} />
            <span>{station.address}</span>
          </div>
          <a href={`https://maps.google.com/?q=${station.lat},${station.lng}`} target="_blank" rel="noopener noreferrer"
            style={{ color: '#00C853', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            Open in Maps →
          </a>
        </div>
      </div>

      {/* Connector grid */}
      <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Select Connector</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {station.connectors.map(conn => (
          <div
            key={conn.id}
            onClick={() => conn.status === 'available' && setSelectedConnector(conn)}
            style={{
              cursor: conn.status === 'available' ? 'pointer' : 'not-allowed',
              opacity: conn.status === 'occupied' ? 0.5 : 1,
              border: selectedConnector.id === conn.id ? '1.5px solid #00C853' : '1.5px solid transparent',
              borderRadius: 12,
            }}
          >
            <ConnectorCard conn={conn} />
          </div>
        ))}
      </div>

      {/* Booking form */}
      <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Schedule Slot</h3>
      <div className="c-card" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>Date</label>
          <input className="input-dark" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>Time</label>
          <input className="input-dark" type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        <div>
          <label style={{ color: '#9ca3af', fontSize: 12, marginBottom: 6, display: 'block' }}>Duration</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[30, 60, 90, 120].map(d => (
              <button key={d} onClick={() => setDuration(d)} style={{
                flex: 1, padding: '8px 0', borderRadius: 8,
                background: duration === d ? '#00C853' : '#1e1e1e',
                color: duration === d ? '#000' : '#9ca3af',
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
              }}>
                {d < 60 ? `${d}m` : `${d / 60}h`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cost calculator */}
      <div className="c-card" style={{ marginBottom: 20, background: 'linear-gradient(135deg,rgba(0,200,83,0.08),#141414)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Connector</span>
          <span style={{ color: '#fff', fontSize: 13 }}>{selectedConnector.type} · {selectedConnector.powerKW}kW</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Rate</span>
          <span style={{ color: '#fff', fontSize: 13 }}>₹{selectedConnector.pricePerUnit}/kWh</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>Duration</span>
          <span style={{ color: '#fff', fontSize: 13 }}>{duration} min</span>
        </div>
        <div style={{ borderTop: '1px solid #2d2d2d', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>Estimated Cost</span>
          <span style={{ color: '#00C853', fontWeight: 800, fontSize: 22 }}>₹{estimatedCost}</span>
        </div>
      </div>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: 15 }}
        onClick={handleBook} disabled={!date || !time}>
        Confirm Booking via Razorpay
      </button>
    </div>
  );
}
