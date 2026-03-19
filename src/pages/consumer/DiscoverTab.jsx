import { useState, useEffect, useRef, useCallback } from 'react';
import { STATIONS as MOCK_STATIONS } from '../../data/seedData';
import { Zap, MapPin, Search, Filter, Clock, Navigation, Star, ChevronRight } from 'lucide-react';
import { subscribeToCollection } from '../../services/firestoreService';

const FILTER_CHIPS = [
  { id: 'ac', label: 'AC Slow', icon: '⚡' },
  { id: 'dc', label: 'DC Fast', icon: '🔋' },
  { id: 'ultra', label: 'Ultra Fast', icon: '⚡⚡' },
  { id: 'available', label: 'Available Now', icon: '🟢' },
  { id: 'open24', label: 'Open 24/7', icon: '🌙' },
];

function ConnectorChip({ type }) {
  const cls = type === 'CCS2' ? 'chip-ccs2' : type === 'Type2' ? 'chip-type2' : 'chip-chademo';
  return <span className={cls}>{type}</span>;
}

function StationCard({ station, onBook }) {
  const available = station.connectors.filter(c => c.status === 'available').length;
  const total = station.connectors.length;
  const minPrice = Math.min(...station.connectors.map(c => c.pricePerUnit));
  const connectorTypes = [...new Set(station.connectors.map(c => c.type))];
  const dotClass = available > 0 ? 'dot-available' : 'dot-occupied';

  return (
    <div className="c-card" style={{ marginBottom: 12, cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className={dotClass}></span>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{station.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#9ca3af', fontSize: 13, marginBottom: 10 }}>
            <MapPin size={12} />
            <span>{station.distance}</span>
            <span>·</span>
            <Clock size={12} />
            <span>{station.operatingHours}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {connectorTypes.map(t => <ConnectorChip key={t} type={t} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>
              <span style={{ color: available > 0 ? '#00C853' : '#FF1744', fontWeight: 600 }}>
                {available}/{total}
              </span> connectors free · from <span style={{ color: '#fff', fontWeight: 700 }}>₹{minPrice}/kWh</span>
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 14px', marginLeft: 12, whiteSpace: 'nowrap' }} onClick={() => onBook(station)}>
          Book Slot
        </button>
      </div>
    </div>
  );
}

export default function DiscoverTab({ onBook }) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [stations, setStations] = useState(MOCK_STATIONS);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('stations', (liveStations) => {
      if (liveStations.length > 0) setStations(liveStations);
    });
    return () => unsubscribe();
  }, []);

  const filtered = stations.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilters.includes('available') && !s.connectors.some(c => c.status === 'available')) return false;
    if (activeFilters.includes('open24') && s.operatingHours !== '24/7') return false;
    if (activeFilters.includes('ac') && !s.connectors.some(c => c.type === 'Type2')) return false;
    if (activeFilters.includes('dc') && !s.connectors.some(c => c.type === 'CCS2' || c.type === 'CHAdeMO')) return false;
    return true;
  });

  const toggleFilter = (id) => {
    setActiveFilters(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Search bar */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input
            className="input-dark"
            style={{ paddingLeft: 36, fontSize: 15 }}
            placeholder="Find chargers near you..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {FILTER_CHIPS.map(chip => (
          <button
            key={chip.id}
            onClick={() => toggleFilter(chip.id)}
            style={{
              whiteSpace: 'nowrap',
              padding: '6px 14px',
              borderRadius: 24,
              border: activeFilters.includes(chip.id) ? '1.5px solid #00C853' : '1.5px solid #2d2d2d',
              background: activeFilters.includes(chip.id) ? 'rgba(0,200,83,0.12)' : 'transparent',
              color: activeFilters.includes(chip.id) ? '#00C853' : '#9ca3af',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {chip.icon} {chip.label}
          </button>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{ margin: '0 16px 16px', borderRadius: 12, background: '#141414', border: '1px solid #1e1e1e', height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', overflow: 'hidden' }}>
        {/* Grid pattern */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.08 }} width="100%" height="100%">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#00C853" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Station dots */}
        {stations.map((s, i) => (
          <div key={s.id} style={{
            position: 'absolute',
            width: 8, height: 8, borderRadius: '50%',
            background: '#00C853',
            boxShadow: '0 0 8px #00C853',
            left: `${15 + i * 17}%`,
            top: `${30 + (i % 3) * 20}%`,
          }} />
        ))}
        <MapPin size={28} color="#00C853" />
        <span style={{ color: '#6b7280', fontSize: 13 }}>Map loads here · {stations.length} stations nearby</span>
        <span style={{ color: '#4b5563', fontSize: 11 }}>Enable location for live map view</span>
      </div>

      {/* Station list */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: '#9ca3af', fontSize: 13 }}>{filtered.length} stations found</span>
          <button style={{ background: 'none', border: 'none', color: '#00C853', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Filter size={14} /> Sort
          </button>
        </div>
        {filtered.map(s => <StationCard key={s.id} station={s} onBook={onBook} />)}
      </div>
    </div>
  );
}
