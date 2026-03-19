import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Home, Users, Handshake, CreditCard, Scale, DollarSign, Settings, LogOut, Menu, X, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin/overview',     icon: Home,       label: 'Overview' },
  { path: '/admin/users',        icon: Users,      label: 'Users' },
  { path: '/admin/partners',     icon: Handshake,  label: 'Partners' },
  { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
  { path: '/admin/disputes',     icon: Scale,      label: 'Disputes' },
  { path: '/admin/payouts',      icon: DollarSign, label: 'Payouts' },
  { path: '/admin/settings',     icon: Settings,   label: 'Platform Settings' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1a1a2e' }}>VoltConnect</div>
            <div style={{ fontSize: 10, color: '#FF1744', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '10px 10px' }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`sidebar-link ${active ? 'active' : ''}`}
              style={{ marginBottom: 1, fontSize: 13 }} onClick={() => setSidebarOpen(false)}>
              <Icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '10px 10px', borderTop: '1px solid #e5e7eb' }}>
        <button onClick={() => navigate('/')} className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#00C853', fontWeight: 700 }}>
          <Zap size={14} /> ⚡ Back to Hub
        </button>
        <button onClick={() => navigate('/')} className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-surface" style={{ display: 'flex', minHeight: '100dvh' }}>
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />
      )}
      {/* Desktop sidebar */}
      <aside style={{ width: 220, minHeight: '100dvh', background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <SidebarContent />
      </aside>
      {/* Mobile sidebar */}
      <aside style={{
        position: 'fixed', left: sidebarOpen ? 0 : -230, top: 0, width: 220, height: '100dvh',
        background: '#fff', borderRight: '1px solid #e5e7eb', zIndex: 50,
        display: 'flex', flexDirection: 'column', transition: 'left 0.25s',
      }}>
        <SidebarContent />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <Menu size={20} />
          </button>
          <div style={{ fontSize: 13, color: '#6b7280', flex: 1 }}>
            <span style={{ color: '#FF1744', fontWeight: 700 }}>ADMIN</span> ·{' '}
            {NAV_ITEMS.find(n => n.path === location.pathname)?.label || 'Admin Panel'}
          </div>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.2)',
            borderRadius: 14, padding: '5px 10px', cursor: 'pointer',
            color: '#00C853', fontWeight: 600, fontSize: 12, fontFamily: 'inherit'
          }}>
            <Zap size={11} fill="#00C853" /> Hub
          </button>
        </div>
        <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
