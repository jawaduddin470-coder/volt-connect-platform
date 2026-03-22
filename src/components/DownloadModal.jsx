import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Smartphone, ArrowRight, Star } from 'lucide-react';

export default function DownloadModal({ onClose }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  const handleContinueWeb = () => {
    // Since /consumer was deleted, show a premium toast
    setToast('Web version coming soon!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Modal Container */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw', maxWidth: 440,
        background: '#0D0D0D',
        borderRadius: 28,
        border: '1px solid rgba(255,255,255,0.08)',
        zIndex: 201,
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        animation: 'modalEntrance 0.25s ease-out forwards',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10, transition: 'background 0.2s',
            fontSize: 16,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          ×
        </button>

        {/* TOP HERO SECTION */}
        <div style={{
          padding: '32px 32px 24px',
          background: 'linear-gradient(135deg, #0A2A1A 0%, #0A1628 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          {/* App Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #00C9A7, #00875A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(0,201,167,0.4)',
          }}>
            <Zap size={32} color="#fff" fill="#fff" />
          </div>
          
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginTop: 12, marginBottom: 4 }}>
            VoltConnect
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            India's EV Charging Super App
          </p>

          {/* Rating Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FFB800" color="#FFB800" />)}
            </div>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>4.8</span>
            <span style={{ color: '#6b7280', fontSize: 12 }}>· 10K+ downloads</span>
          </div>
        </div>

        {/* QR CODE SECTION */}
        <div style={{ padding: '24px 32px', background: '#0D0D0D', textAlign: 'center' }}>
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10,
          }}>
            Scan to download
          </p>
          
          <div style={{
            background: 'white', padding: 12, borderRadius: 16,
            width: 148, height: 148, margin: '0 auto 10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=148x148&data=https://voltconnect.app&bgcolor=ffffff&color=000000&margin=0"
              alt="QR Code" width={148} height={148} style={{ display: 'block' }}
            />
            {/* Platform Icons in white box bottom area */}
            <div style={{ display: 'flex', gap: 8, marginTop: -20, background: 'white', padding: '4px 8px', borderRadius: 8 }}>
              <div style={{ width: 14, height: 14, background: '#3DDC84', borderRadius: 2 }} /> {/* Android proxy */}
              <div style={{ width: 14, height: 14, background: '#8e8e93', borderRadius: 2 }} /> {/* Apple proxy */}
              <div style={{ width: 14, height: 14, background: '#007AFF', borderRadius: 2 }} /> {/* Web proxy */}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 32px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{
            background: '#0D0D0D', padding: '0 12px',
            color: 'rgba(255,255,255,0.3)', fontSize: 11,
          }}>
            or download directly
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* DOWNLOAD BUTTONS SECTION */}
        <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Android Button */}
          <button
            onClick={() => window.open('#', '_blank')}
            style={{
              height: 56, borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #00C9A7 0%, #00A083 100%)',
              display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px',
              cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,201,167,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Simple Android Head SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <path d="M17.523 15.3414C17.0676 15.3414 16.6974 15.7115 16.6974 16.1669C16.6974 16.6222 17.0676 16.9924 17.523 16.9924C17.9784 16.9924 18.3486 16.6222 18.3486 16.1669C18.3486 15.7115 17.9784 15.3414 17.523 15.3414ZM6.47702 15.3414C6.02164 15.3414 5.65146 15.7115 5.65146 16.1669C5.65146 16.6222 6.02164 16.9924 6.47702 16.9924C6.93239 16.9924 7.30257 16.6222 7.30257 16.1669C7.30257 15.7115 6.93239 15.3414 6.47702 15.3414ZM17.9366 11.2349L19.4627 8.59169C19.5755 8.39622 19.5085 8.1462 19.3131 8.03333C19.1176 7.92053 18.8676 7.98751 18.7548 8.18298L17.2089 10.8601C15.7834 10.2104 14.1951 9.84619 12.523 9.84619C10.8509 9.84619 9.26258 10.2104 7.83707 10.8601L6.29124 8.18298C6.17838 7.98751 5.92842 7.92047 5.73289 8.03333C5.53748 8.1462 5.4705 8.39622 5.5833 8.59169L7.10943 11.2349C4.19232 12.723 2.19325 15.7208 2.05609 19.2307H22.99C21.8527 15.7208 1.85368 12.723 17.9366 11.2349Z" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'rgba(0,0,0,0.85)', fontSize: 14, fontWeight: 700 }}>Download for Android</span>
              <span style={{ color: 'rgba(0,0,0,0.55)', fontSize: 11 }}>Free · APK Direct Download</span>
            </div>
            <span style={{ color: 'rgba(0,0,0,0.4)', marginLeft: 'auto' }}>→</span>
          </button>

          {/* App Store Button */}
          <button
            onClick={() => {}}
            style={{
              height: 56, borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)',
              background: '#1A1A1A',
              display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px',
              cursor: 'pointer', textAlign: 'left', color: '#fff',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#222222';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#1A1A1A';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            {/* Simple Apple Icon proxy */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.31-.79-1.55 0-2.02.76-3.3.82-1.31.07-2.31-1.33-3.14-2.53-1.7-2.45-3-6.92-1.24-9.98.88-1.51 2.44-2.47 4.14-2.5 1.29-.02 2.51.87 3.3.87.79 0 2.26-1.07 3.82-.91 1.63.07 2.87.66 3.53 1.63-1.34.81-2.22 2.33-2.22 4.13 0 2.22 1.83 3.3 1.83 3.3-.1.2-.23.41-.35.61-.41.6-1.07 1.29-1.85 1.54zM13 3.5c.74-.88 1.23-2.11 1.09-3.33-1.05.04-2.32.71-3.07 1.59-.67.77-1.26 2.02-1.11 3.22 1.17.09 2.35-.6 3.09-1.48z" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Download on App Store</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>iOS · Coming Soon</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>→</span>
          </button>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ padding: '0 24px 24px', textAlign: 'center' }}>
          <button
            onClick={handleContinueWeb}
            style={{
              background: 'none', border: 'none',
              color: '#00C9A7', fontSize: 13, cursor: 'pointer',
              transition: 'text-decoration 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            Continue on web browser →
          </button>
        </div>

        {/* Premium Toast Overlay */}
        {toast && (
          <div style={{
            position: 'absolute', bottom: 20, left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,201,167,0.95)', color: '#000',
            padding: '8px 16px', borderRadius: 12,
            fontSize: 13, fontWeight: 700,
            boxShadow: '0 8px 32px rgba(0,201,167,0.3)',
            animation: 'fadeInOut 3s ease-in-out forwards',
            zIndex: 100,
          }}>
            ⚡ {toast}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modalEntrance {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          10%, 90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }
      `}</style>
    </>
  );
}
