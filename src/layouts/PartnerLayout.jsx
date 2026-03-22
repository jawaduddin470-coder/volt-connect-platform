import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LayoutDashboard, MapPin, Calendar, DollarSign, BarChart2, Settings, LogOut, Menu, X } from 'lucide-react';
import VoltLogo from '../components/VoltLogo';

const NAV_ITEMS = [
  { path: '/partner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/partner/stations',  icon: MapPin, label: 'My Stations' },
  { path: '/partner/bookings',  icon: Calendar, label: 'Bookings' },
  { path: '/partner/revenue',   icon: DollarSign, label: 'Revenue' },
  { path: '/partner/analytics', icon: BarChart2, label: 'Analytics' },
  { path: '/partner/settings',  icon: Settings, label: 'Settings' },
];

export default function PartnerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ marginBottom: 4 }}>
          <VoltLogo size={26} textSize={14} />
        </div>
        <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, paddingLeft: 2, marginTop: 4 }}>Partner Portal</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px' }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`sidebar-link ${active ? 'active' : ''}`}
              style={{ marginBottom: 2 }} onClick={() => setSidebarOpen(false)}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Return to Hub */}
      <div style={{ padding: '12px 12px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={() => navigate('/')} className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#00C853', fontWeight: 700 }}>
          <Zap size={16} /> ⚡ Back to Home
        </button>
        <button onClick={() => navigate('/')} className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="partner-surface" style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="sidebar" style={{ display: 'none', flexDirection: 'column' }}
        ref={el => { if (el) el.style.display = window.innerWidth >= 768 ? 'flex' : 'none'; }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <aside style={{
        position: 'fixed', left: sidebarOpen ? 0 : -260, top: 0, width: 240, height: '100dvh',
        background: '#fff', borderRight: '1px solid #e5e7eb', zIndex: 50,
        display: 'flex', flexDirection: 'column', transition: 'left 0.25s ease-in-out',
      }}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12, background: '#fff' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', flex: 1 }}>
            {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'Partner Portal'}
          </span>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.2)',
            borderRadius: 14, padding: '5px 10px', cursor: 'pointer',
            color: '#00C853', fontWeight: 600, fontSize: 12, fontFamily: 'inherit'
          }}>
            <Zap size={11} fill="#00C853" /> Home
          </button>
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
