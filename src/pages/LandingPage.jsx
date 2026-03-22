import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, MapPin, Bot, CreditCard, BarChart3, Building2, Wallet, ShieldCheck, Users } from 'lucide-react';
import DownloadModal from '../components/DownloadModal';

// ──────────────────────────────────────────────
//  Global CSS
// ──────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 0; }

  .lp-root {
    min-height: 100dvh;
    background: #0A0A0A;
    font-family: 'Inter', system-ui, sans-serif;
    color: #fff;
    position: relative;
    overflow-x: hidden;
  }

  /* Navbar */
  .lp-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    height: 60px;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    animation: fadeIn 0.4s ease;
  }

  /* Hero */
  .lp-hero { text-align: center; padding: 80px 24px 56px; }
  .lp-hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(0,201,167,0.1); border: 1px solid rgba(0,201,167,0.22);
    border-radius: 30px; padding: 6px 16px;
    color: #00C9A7; font-size: 13px; font-weight: 600;
    margin-bottom: 28px;
    animation: slideUp 0.5s ease both;
  }
  .lp-hero-h1 {
    font-size: clamp(36px, 6vw, 66px);
    font-weight: 900;
    letter-spacing: -1.5px;
    line-height: 1.08;
    margin-bottom: 22px;
    animation: slideUp 0.55s ease both;
  }
  .lp-hero-gradient {
    background: linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .lp-hero-sub {
    color: #888;
    font-size: clamp(15px, 2vw, 18px);
    margin-bottom: 36px;
    animation: slideUp 0.6s ease both;
  }
  .lp-stats {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; flex-wrap: wrap;
    animation: slideUp 0.65s ease both;
  }
  .lp-stat-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: #111; border: 1px solid #1e1e1e;
    border-radius: 30px; padding: 8px 16px;
    font-size: 13px; color: #9ca3af; font-weight: 500;
    white-space: nowrap;
  }
  .lp-stat-divider { color: #333; font-size: 18px; }

  /* Cards grid */
  .lp-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
    max-width: 1200px;
    margin: 0 auto;
    animation: slideUp 0.7s ease both;
  }
  @media (min-width: 640px) {
    .lp-cards { padding: 0 24px; }
  }
  @media (min-width: 768px) {
    .lp-cards {
      grid-template-columns: 1fr 1fr;
    }
    .lp-card-admin { grid-column: 1 / -1; max-width: 50%; margin: 0 auto; width: 100%; }
  }
  @media (min-width: 1024px) {
    .lp-nav { padding: 0 56px; }
    .lp-hero { padding: 100px 48px 64px; }
    .lp-cards {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      padding: 0 48px;
    }
    .lp-card-admin { grid-column: unset; max-width: unset; margin: 0; }
    .lp-card:hover {
      transform: translateY(-6px) scale(1.02) !important;
    }
  }

  /* Individual card */
  .lp-card {
    background: #111111;
    border: 1px solid #1e1e1e;
    border-radius: 20px;
    padding: 28px 24px 22px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.22s ease;
    display: flex;
    flex-direction: column;
  }
  .lp-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  /* Featured card */
  .lp-card-featured {
    border-color: rgba(124,58,237,0.3);
    background: linear-gradient(160deg, #13111A 0%, #111111 60%);
  }

  /* Buttons */
  .lp-btn-primary {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%;
    padding: 13px 20px; border-radius: 12px;
    border: none; cursor: pointer;
    font: 700 14px 'Inter', system-ui, sans-serif;
    letter-spacing: 0.2px;
    transition: opacity 0.2s, transform 0.15s;
    text-decoration: none;
    text-align: center;
  }
  .lp-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

  .lp-btn-secondary {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%;
    padding: 12px 20px; border-radius: 12px;
    background: #1a1a1a; border: 1px solid #2a2a2a;
    color: #9ca3af; cursor: pointer;
    font: 600 14px 'Inter', system-ui, sans-serif;
    transition: border-color 0.2s, color 0.2s, transform 0.15s;
    text-decoration: none;
    text-align: center;
  }
  .lp-btn-secondary:hover {
    border-color: #444; color: #e5e7eb;
    transform: translateY(-1px);
  }

  /* Features */
  .lp-features {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 0 16px;
    max-width: 1200px;
    margin: 0 auto;
  }
  @media (min-width: 640px) {
    .lp-features { padding: 0 24px; grid-template-columns: 1fr 1fr 1fr; }
  }
  @media (min-width: 1024px) {
    .lp-features { padding: 0 48px; }
  }
  .lp-feature-card {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    transition: border-color 0.2s;
  }
  .lp-feature-card:hover { border-color: #2a2a2a; }

  /* Footer */
  .lp-footer {
    padding: 48px 24px 56px;
    text-align: center;
    border-top: 1px solid #1a1a1a;
    margin-top: 80px;
    color: #555;
    font-size: 13px;
    line-height: 2;
  }
  @media (min-width: 1024px) {
    .lp-footer { padding: 48px 56px 56px; }
  }

  /* Feature pill list */
  .lp-feature-list {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-bottom: 20px;
    margin-top: 12px;
  }
  .lp-feat-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 20px;
    font-size: 12px; font-weight: 600;
    border: 1px solid;
  }

  /* Animations */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes floatA {
    0%, 100% { transform: translate(0,0) scale(1); }
    40% { transform: translate(50px,-70px) scale(1.1); }
    70% { transform: translate(-30px,40px) scale(0.95); }
  }
  @keyframes floatB {
    0%, 100% { transform: translate(0,0) scale(1); }
    35% { transform: translate(-60px,60px) scale(1.05); }
    65% { transform: translate(40px,-50px) scale(0.9); }
  }
  @keyframes floatC {
    0%, 100% { transform: translate(0,0) scale(1); }
    30% { transform: translate(70px,40px) scale(1.08); }
    60% { transform: translate(-50px,-60px) scale(0.95); }
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.5); }
  }
`;

// ──────────────────────────────────────────────
//  Feature Pill
// ──────────────────────────────────────────────
function FeatPill({ label, emoji, color }) {
  return (
    <span className="lp-feat-pill" style={{
      background: `${color}12`,
      color,
      borderColor: `${color}28`,
    }}>
      {emoji} {label}
    </span>
  );
}

// ──────────────────────────────────────────────
//  Entry Card
// ──────────────────────────────────────────────
function EntryCard({ accentColor, icon: Icon, title, badge, features, primaryLabel, primaryAction, secondaryLabel, secondaryAction, footerNote, featured, delay = 0 }) {
  return (
    <div
      className={`lp-card${featured ? ' lp-card-featured' : ''}${title === 'Admin' ? ' lp-card-admin' : ''}`}
      style={{
        borderTopColor: `${accentColor}40`,
        animation: `slideUp ${0.7 + delay}s ease both`,
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accentColor} 0%, transparent 80%)`,
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Badge */}
      {badge && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: `${accentColor}18`,
          color: accentColor,
          border: `1px solid ${accentColor}30`,
          borderRadius: 20, padding: '3px 11px',
          fontSize: 11, fontWeight: 700,
        }}>
          {badge}
        </div>
      )}

      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 13,
          background: `${accentColor}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={24} color={accentColor} />
        </div>
        <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px' }}>
          {title}
        </h3>
      </div>

      {/* Feature pills */}
      <div className="lp-feature-list">
        {features.map(f => (
          <FeatPill key={f.label} {...f} color={accentColor} />
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          className="lp-btn-primary"
          onClick={primaryAction}
          style={{ background: accentColor, color: '#fff' }}
        >
          {primaryLabel}
        </button>
        {secondaryLabel && secondaryAction && (
          <button
            className="lp-btn-secondary"
            onClick={secondaryAction}
          >
            {secondaryLabel}
          </button>
        )}
      </div>

      {/* Footer note */}
      {footerNote && (
        <div style={{ marginTop: 14, textAlign: 'center', color: '#4b5563', fontSize: 12 }}>
          {footerNote}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
//  Feature Block
// ──────────────────────────────────────────────
function FeatureBlock({ emoji, title, desc, color }) {
  return (
    <div className="lp-feature-card">
      <div style={{ fontSize: 32, marginBottom: 12 }}>{emoji}</div>
      <h4 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h4>
      <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ──────────────────────────────────────────────
//  Landing Page
// ──────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="lp-root">
      <style>{GLOBAL_CSS}</style>

      {/* ── Floating Orbs ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'rgba(0,201,167,0.07)', filter: 'blur(90px)',
          top: '-15%', left: '-10%',
          animation: 'floatA 22s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(124,58,237,0.07)', filter: 'blur(90px)',
          top: '25%', right: '-12%',
          animation: 'floatB 28s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(220,38,38,0.05)', filter: 'blur(80px)',
          bottom: '5%', left: '15%',
          animation: 'floatC 24s ease-in-out infinite',
        }} />
        {/* Faint grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="lp-nav" style={{ position: 'relative', zIndex: 10 }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #007B55, #00C9A7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0,201,167,0.3)',
          }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.3px' }}>
            <span style={{ color: '#fff' }}>Volt</span>
            <span style={{ color: '#00C9A7' }}>Connect</span>
          </span>
        </div>
        {/* Status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: '1px solid #2a2a2a',
          borderRadius: 30, padding: '5px 13px',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#00C9A7', display: 'inline-block',
            animation: 'livePulse 2s ease-in-out infinite',
          }} />
          <span style={{ color: '#9ca3af', fontSize: 12, fontWeight: 500 }}>All Systems Online</span>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-badge">
            <Zap size={13} /> India's EV Charging Super App
          </div>

          <h1 className="lp-hero-h1">
            The Smarter Way to
            <br />
            <span className="lp-hero-gradient">Charge Your EV</span>
          </h1>

          <p className="lp-hero-sub">
            Find stations · Book slots · Save money · Drive further
          </p>

          <div className="lp-stats">
            <span className="lp-stat-pill">⚡ 1,766+ Stations</span>
            <span className="lp-stat-divider">·</span>
            <span className="lp-stat-pill">🌆 12 Cities</span>
            <span className="lp-stat-divider">·</span>
            <span className="lp-stat-pill">🔋 847 Active Now</span>
          </div>
        </section>

        {/* ── Entry CARDS ── */}
        <div className="lp-cards" style={{ marginBottom: 80 }}>
          {/* EV Driver */}
          <EntryCard
            accentColor="#00C9A7"
            icon={Zap}
            title="EV Driver"
            features={[
              { emoji: '🗺️', label: 'Find Stations' },
              { emoji: '📅', label: 'Book Slots' },
              { emoji: '🤖', label: 'Volt AI' },
              { emoji: '💎', label: 'Membership' },
            ]}
            primaryLabel="📱 Download the App"
            primaryAction={() => setShowModal(true)}
            secondaryLabel="🌐 Open Web Version"
            secondaryAction={() => navigate('/consumer')}
            delay={0}
          />

          {/* Station Partner */}
          <EntryCard
            accentColor="#7C3AED"
            icon={Building2}
            title="Station Partner"
            badge="For Business"
            featured={true}
            features={[
              { emoji: '📊', label: 'Analytics' },
              { emoji: '🗺️', label: 'Stations' },
              { emoji: '💰', label: 'Revenue' },
              { emoji: '📋', label: 'Bookings' },
            ]}
            primaryLabel="Access Partner Portal →"
            primaryAction={() => navigate('/partner/login')}
            footerNote={
              <span>
                Apply for access →{' '}
                <a href="mailto:partner@voltconnect.in" style={{ color: '#7C3AED', textDecoration: 'underline' }}>
                  partner@voltconnect.in
                </a>
              </span>
            }
            delay={0.08}
          />

          {/* Admin */}
          <EntryCard
            accentColor="#DC2626"
            icon={ShieldCheck}
            title="Admin"
            features={[
              { emoji: '⚖️', label: 'Disputes' },
              { emoji: '💸', label: 'Payouts' },
              { emoji: '👤', label: 'Users' },
              { emoji: '⚙️', label: 'Settings' },
            ]}
            primaryLabel="Access Admin Panel →"
            primaryAction={() => navigate('/admin/login')}
            footerNote="🔐 Restricted — Internal use only"
            delay={0.16}
          />
        </div>

        {/* ── FEATURES ── */}
        <section style={{ padding: '0 0 80px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40, padding: '0 24px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 10 }}>
              Built for the EV generation
            </h2>
            <p style={{ color: '#666', fontSize: 15 }}>
              Everything you need, from finding a plug to running a network.
            </p>
          </div>
          <div className="lp-features">
            <FeatureBlock
              emoji="🗺️"
              title="Real-Time Station Map"
              desc="Live availability, connector types, queue depth, and precise navigation — all in one tap."
              color="#00C9A7"
            />
            <FeatureBlock
              emoji="🤖"
              title="Volt AI Assistant"
              desc="Ask anything about charging costs, route planning, or station compatibility in plain language."
              color="#7C3AED"
            />
            <FeatureBlock
              emoji="💳"
              title="Membership Plans"
              desc="Subscribe to save up to 30% on every session, unlock priority booking, and earn rewards."
              color="#F59E0B"
            />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #007B55, #00C9A7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={14} color="#fff" fill="#fff" />
              </div>
              <span style={{ color: '#aaa', fontWeight: 700, fontSize: 15 }}>
                Volt<span style={{ color: '#00C9A7' }}>Connect</span>
              </span>
            </div>
            <p style={{ color: '#444', fontSize: 12 }}>Smart EV Charging · India</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 6 }}>Built by</p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: 13 }}
                onMouseEnter={e => e.currentTarget.style.color = '#00C9A7'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                Mohammed Meraj Uddin ↗
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: 13 }}
                onMouseEnter={e => e.currentTarget.style.color = '#00C9A7'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                Mohd Basheer Ahmed ↗
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <span
                key={l}
                style={{ color: '#444', cursor: 'pointer', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00C9A7'}
                onMouseLeave={e => e.currentTarget.style.color = '#444'}
              >
                {l}
              </span>
            ))}
          </div>

          <p style={{ color: '#333', fontSize: 12 }}>© 2026 VoltConnect. All rights reserved.</p>
        </footer>
      </div>

      {/* ── Download Modal ── */}
      {showModal && <DownloadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
