import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Building2, ShieldCheck, Zap, MapPin, Map, Calendar, CreditCard, BarChart2, Layers, DollarSign, Scale, Users, X } from 'lucide-react';
import { subscribeToDocument, subscribeToCollection } from '../services/firestoreService';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

// ────────── Bottom Sheet Modal ──────────
function BottomSheet({ visible, onClose, title, subtitle, icon, iconColor, cta, ctaUrl }) {
  if (!visible) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        zIndex: 100, backdropFilter: 'blur(4px)'
      }} />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#141414',
        borderRadius: '24px 24px 0 0', padding: '32px 24px 48px',
        zIndex: 101, border: '1px solid #2a2a2a',
        animation: 'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#2a2a2a', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={16} color="#9ca3af" />
        </button>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          {icon}
        </div>
        <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>{subtitle}</p>
        {cta && (
          <button onClick={() => { ctaUrl ? window.open(ctaUrl, '_blank') : onClose(); }}
            style={{ width: '100%', padding: '14px', borderRadius: 12, background: iconColor, color: '#fff', border: 'none', font: '600 15px Inter,system-ui,sans-serif', cursor: 'pointer' }}>
            {cta}
          </button>
        )}
        <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: 12, background: '#1e1e1e', color: '#9ca3af', border: 'none', font: '500 14px Inter,system-ui,sans-serif', cursor: 'pointer', marginTop: 10 }}>
          Cancel
        </button>
      </div>
    </>
  );
}

// ────────── Tag Pill ──────────
function Pill({ emoji, label, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 20,
      background: `${color}15`, color, fontSize: 12, fontWeight: 600,
      border: `1px solid ${color}30`
    }}>
      {emoji} {label}
    </span>
  );
}

// ────────── Hub Card ──────────
function HubCard({ title, subtitle, icon: Icon, iconColor, borderColor, badge, badgeColor, pills, ctaLabel, ctaColor, delay, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onClick(); }}
      style={{
        background: '#141414',
        border: `1px solid ${borderColor}`,
        borderRadius: 20,
        padding: 20,
        cursor: 'pointer',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1)',
        animation: `slideUp ${0.35 + delay}s cubic-bezier(0.4,0,0.2,1) both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow bg */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `${iconColor}08`, pointerEvents: 'none' }} />

      {/* Badge */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: `${badgeColor}20`, color: badgeColor,
        padding: '3px 10px', borderRadius: 20,
        fontSize: 11, fontWeight: 700, border: `1px solid ${badgeColor}30`
      }}>
        {badge}
      </div>

      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={26} color={iconColor} />
        </div>
        <div>
          <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 3 }}>{title}</h3>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.4 }}>{subtitle}</p>
        </div>
      </div>

      {/* Pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {pills.map(p => <Pill key={p.label} {...p} color={iconColor} />)}
      </div>

      {/* CTA Button */}
      <button style={{
        width: '100%', padding: '12px', borderRadius: 12,
        background: ctaColor, color: '#fff', border: 'none',
        font: '600 14px Inter,system-ui,sans-serif', cursor: 'pointer',
        textAlign: 'center', transition: 'opacity 0.2s'
      }}>
        {ctaLabel}
      </button>
    </div>
  );
}

// ────────── Main Hub ──────────
export default function PortalHome({ user }) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [stations, setStations] = useState([]);
  const [sheet, setSheet] = useState(null); // 'partner' | 'admin'
  const [greeting, setGreeting] = useState('Hello');

  // Time-based greeting
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Subscribe to user profile for role
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToDocument('users', user.uid, setUserProfile);
    return () => unsub();
  }, [user?.uid]);

  // Live station stats
  useEffect(() => {
    const unsub = subscribeToCollection('stations', setStations);
    return () => unsub();
  }, []);

  const role = userProfile?.role || 'consumer';
  const displayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'there';
  const stationsCount = stations.length > 0 ? `${stations.length}+` : '1,500+';
  const activeSessions = stations.reduce((s, st) => s + (st.sessionsToday || 0), 0) || 847;

  const handleConsumer = () => navigate('/consumer');

  const handlePartner = () => {
    if (role === 'partner' || role === 'admin') {
      navigate('/partner/dashboard');
    } else {
      setSheet('partner');
    }
  };

  const handleAdmin = () => {
    if (role === 'admin') {
      navigate('/admin/overview');
    } else {
      setSheet('admin');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0A0A0A',
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: 480, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: '52px 20px 20px', animation: 'fadeIn 0.6s ease' }}>
        {/* Logo pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,200,83,0.10)', padding: '7px 14px', borderRadius: 30, border: '1px solid rgba(0,200,83,0.2)', marginBottom: 24 }}>
          <Zap size={16} color="#00C853" fill="#00C853" />
          <span style={{ color: '#00C853', fontWeight: 700, fontSize: 13 }}>VoltConnect Hub</span>
        </div>

        {/* Greeting */}
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
          {greeting}, {displayName} 👋
        </h1>
        <p style={{ color: '#888', fontSize: 15, marginBottom: 0 }}>What are you here for today?</p>
      </div>

      {/* ── Cards ── */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        <HubCard
          title="Find & Book Chargers"
          subtitle="Discover stations, book slots, manage your EV wallet"
          icon={Smartphone}
          iconColor="#00C853"
          borderColor="#00C85325"
          badge="🟢 LIVE"
          badgeColor="#00C853"
          pills={[
            { emoji: '🗺️', label: 'Map' },
            { emoji: '📅', label: 'Book' },
            { emoji: '💳', label: 'Wallet' },
          ]}
          ctaLabel="Open Consumer App →"
          ctaColor="#00C853"
          delay={0.05}
          onClick={handleConsumer}
        />

        <HubCard
          title="Partner Dashboard"
          subtitle="Manage stations, track revenue and bookings"
          icon={Building2}
          iconColor="#1565C0"
          borderColor="#1565C025"
          badge="🔒 B2B Access"
          badgeColor="#60A5FA"
          pills={[
            { emoji: '📊', label: 'Analytics' },
            { emoji: '🗺️', label: 'Stations' },
            { emoji: '💰', label: 'Revenue' },
          ]}
          ctaLabel="Open Partner Portal →"
          ctaColor="#1565C0"
          delay={0.1}
          onClick={handlePartner}
        />

        <HubCard
          title="Admin Panel"
          subtitle="Internal operations, commissions, disputes & payouts"
          icon={ShieldCheck}
          iconColor="#EF4444"
          borderColor="#EF444425"
          badge="🔐 Internal Only"
          badgeColor="#F87171"
          pills={[
            { emoji: '⚖️', label: 'Disputes' },
            { emoji: '💸', label: 'Payouts' },
            { emoji: '👤', label: 'Users' },
          ]}
          ctaLabel="Open Admin Panel →"
          ctaColor="#B91C1C"
          delay={0.15}
          onClick={handleAdmin}
        />
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ padding: '24px 16px 4px' }}>
        <div style={{ overflowX: 'auto', display: 'flex', gap: 10, paddingBottom: 4 }}>
          {[
            { icon: '⚡', label: `${stationsCount} Stations` },
            { icon: '🌆', label: '12 Cities' },
            { icon: '🔋', label: `Active Now: ${activeSessions}` },
          ].map(stat => (
            <div key={stat.label} style={{
              display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              background: '#141414', border: '1px solid #2a2a2a', borderRadius: 30,
              padding: '8px 14px', fontSize: 13, color: '#9ca3af', fontWeight: 500, flexShrink: 0
            }}>
              <span>{stat.icon}</span> {stat.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '20px 20px 32px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: '#3f3f3f', fontSize: 12 }}>© 2026 VoltConnect · All rights reserved</p>
        <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
          Sign Out
        </button>
      </div>

      {/* ── Partner Bottom Sheet ── */}
      <BottomSheet
        visible={sheet === 'partner'}
        onClose={() => setSheet(null)}
        title="Partner Access Required"
        subtitle="You need a partner account to access this area. Apply below and our team will review your application within 2 business days."
        icon={<Building2 size={24} color="#1565C0" />}
        iconColor="#1565C0"
        cta="Apply for Partner Access"
        ctaUrl="https://forms.google.com"
      />

      {/* ── Admin Bottom Sheet ── */}
      <BottomSheet
        visible={sheet === 'admin'}
        onClose={() => setSheet(null)}
        title="🔒 Restricted Access"
        subtitle="This area is for VoltConnect staff only. If you're part of the ops team, your account needs to have admin privileges set in Firestore."
        icon={<ShieldCheck size={24} color="#EF4444" />}
        iconColor="#EF4444"
        cta="OK, Got It"
      />
    </div>
  );
}
