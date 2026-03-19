import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Calendar, Navigation, Wallet, User, Zap, MessageCircle } from 'lucide-react';
import DiscoverTab from './consumer/DiscoverTab';
import BookTab from './consumer/BookTab';
import RoutesTab from './consumer/RoutesTab';
import WalletTab from './consumer/WalletTab';
import ProfileTab from './consumer/ProfileTab';
import VoltAIChat from '../components/VoltAIChat';

const TABS = [
  { id: 'discover', icon: Compass, label: 'Discover' },
  { id: 'book',     icon: Calendar, label: 'Book' },
  { id: 'routes',   icon: Navigation, label: 'Routes' },
  { id: 'wallet',   icon: Wallet, label: 'Wallet' },
  { id: 'profile',  icon: User, label: 'Profile' },
];

export default function ConsumerApp({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [showAI, setShowAI] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const handleBook = (station) => {
    setSelectedStation(station);
    setActiveTab('book');
  };

  return (
    <div className="consumer-surface" style={{ maxWidth: 430, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid #1e1e1e', position: 'sticky', top: 0, background: '#0A0A0A', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* ⚡ Hub back button */}
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.2)',
            borderRadius: 16, padding: '5px 10px', cursor: 'pointer',
            color: '#00C853', fontWeight: 600, fontSize: 12, fontFamily: 'inherit',
          }}>
            <Zap size={12} fill="#00C853" /> Hub
          </button>
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.5px' }}>VoltConnect</span>
        <button
          onClick={() => setShowAI(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#007B33,#00C853)', border: 'none', borderRadius: 20, padding: '6px 12px', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Zap size={12} /> Volt AI
        </button>
      </div>

      {/* Tab content */}
      <div style={{ overflowY: 'auto', height: 'calc(100dvh - 120px)' }}>
        {activeTab === 'discover' && <DiscoverTab onBook={handleBook} />}
        {activeTab === 'book'     && <BookTab selectedStation={selectedStation} />}
        {activeTab === 'routes'   && <RoutesTab />}
        {activeTab === 'wallet'   && <WalletTab />}
        {activeTab === 'profile'  && <ProfileTab onLogout={() => navigate('/')} />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: '#0A0A0A', borderTop: '1px solid #1e1e1e',
        display: 'flex', padding: '8px 0 max(env(safe-area-inset-bottom),8px)',
        zIndex: 100,
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: active ? '#00C853' : '#6b7280', transition: 'color 0.15s',
              fontFamily: 'inherit',
            }}>
              <Icon size={22} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{tab.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00C853' }} />}
            </button>
          );
        })}
      </div>

      {/* Volt AI chat overlay */}
      {showAI && <VoltAIChat onClose={() => setShowAI(false)} />}
    </div>
  );
}
