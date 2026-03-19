import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { subscribeToDocument } from './services/firestoreService';

import AuthPage from './pages/AuthPage';
import PortalHome from './pages/PortalHome';
import ConsumerApp from './pages/ConsumerApp';

// Partner
import PartnerLogin from './pages/partner/PartnerLogin';
import PartnerLayout from './layouts/PartnerLayout';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerStations from './pages/partner/PartnerStations';
import PartnerBookings from './pages/partner/PartnerBookings';
import PartnerRevenue from './pages/partner/PartnerRevenue';
import PartnerAnalytics from './pages/partner/PartnerAnalytics';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPartners from './pages/admin/AdminPartners';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminDisputes from './pages/admin/AdminDisputes';
import AdminPayouts from './pages/admin/AdminPayouts';
import AdminSettings from './pages/admin/AdminSettings';

import { Zap } from 'lucide-react';

// Splash Screen
function SplashScreen() {
  return (
    <div style={{
      minHeight: '100dvh', background: '#0A0A0A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24,
        background: 'linear-gradient(135deg,#007B33,#00C853)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'pulse 1.5s ease-in-out infinite',
        boxShadow: '0 0 40px rgba(0,200,83,0.4)',
      }}>
        <Zap size={40} color="#fff" fill="#fff" />
      </div>
      <p style={{ color: '#fff', fontWeight: 800, fontSize: 24, letterSpacing: '-0.5px', fontFamily: 'Inter, system-ui, sans-serif' }}>VoltConnect</p>
      <p style={{ color: '#4b5563', fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif' }}>Loading...</p>
      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }`}</style>
    </div>
  );
}

function PartnerRoute({ element }) {
  return <PartnerLayout>{element}</PartnerLayout>;
}
function AdminRoute({ element }) {
  return <AdminLayout>{element}</AdminLayout>;
}

export default function App() {
  const [authState, setAuthState] = useState('loading'); // loading | guest | user
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    // Show splash for at least 2s
    const splashTimeout = setTimeout(() => {
      if (authState === 'loading') setAuthState('guest');
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(splashTimeout);
      if (user) {
        setFirebaseUser(user);
        setTimeout(() => setAuthState('user'), 300);
      } else {
        setFirebaseUser(null);
        setTimeout(() => setAuthState('guest'), 300);
      }
    });

    return () => {
      clearTimeout(splashTimeout);
      unsubscribe();
    };
  }, []);

  if (authState === 'loading') return <SplashScreen />;

  // Guest: show Consumer Auth OR allow direct /admin and /partner routes
  // If unauthenticated and not going to admin/partner, show the Consumer Auth
  if (authState === 'guest') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="*" element={<AuthPage onLogin={() => {
            onAuthStateChanged(auth, (u) => {
              if (u) { setFirebaseUser(u); setAuthState('user'); }
            });
          }} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* HUB — default home */}
        <Route path="/" element={<PortalHome user={firebaseUser} />} />

        {/* Consumer surface */}
        <Route path="/consumer" element={<ConsumerApp user={firebaseUser} />} />
        <Route path="/book/:stationId" element={<ConsumerApp user={firebaseUser} />} />
        <Route path="/routes" element={<ConsumerApp user={firebaseUser} />} />
        <Route path="/wallet" element={<ConsumerApp user={firebaseUser} />} />
        <Route path="/profile" element={<ConsumerApp user={firebaseUser} />} />

        {/* Partner Portal */}
        <Route path="/partner" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="/partner/login" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="/partner/dashboard" element={<PartnerRoute element={<PartnerDashboard />} />} />
        <Route path="/partner/stations"  element={<PartnerRoute element={<PartnerStations />} />} />
        <Route path="/partner/bookings"  element={<PartnerRoute element={<PartnerBookings />} />} />
        <Route path="/partner/revenue"   element={<PartnerRoute element={<PartnerRevenue />} />} />
        <Route path="/partner/analytics" element={<PartnerRoute element={<PartnerAnalytics />} />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/login" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/overview"     element={<AdminRoute element={<AdminOverview />} />} />
        <Route path="/admin/users"        element={<AdminRoute element={<AdminUsers />} />} />
        <Route path="/admin/partners"     element={<AdminRoute element={<AdminPartners />} />} />
        <Route path="/admin/transactions" element={<AdminRoute element={<AdminTransactions />} />} />
        <Route path="/admin/disputes"     element={<AdminRoute element={<AdminDisputes />} />} />
        <Route path="/admin/payouts"      element={<AdminRoute element={<AdminPayouts />} />} />
        <Route path="/admin/settings"     element={<AdminRoute element={<AdminSettings />} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
