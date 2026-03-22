import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

import LandingPage from './pages/LandingPage';
import VoltLogo from './components/VoltLogo';

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
      minHeight: '100dvh', background: '#000000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <VoltLogo size={56} textSize={28} />
      <p style={{ color: '#4b5563', fontSize: 13, marginTop: 8 }}>Loading...</p>
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Show splash briefly while things initialize
    const splashTimeout = setTimeout(() => setReady(true), 1200);

    const unsubscribe = onAuthStateChanged(auth, () => {
      setReady(true);
    });

    return () => {
      clearTimeout(splashTimeout);
      unsubscribe();
    };
  }, []);

  if (!ready) return <SplashScreen />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing — no auth required */}
        <Route path="/" element={<LandingPage />} />

        {/* Partner Portal */}
        <Route path="/partner"              element={<Navigate to="/partner/login" replace />} />
        <Route path="/partner/login"        element={<PartnerLogin />} />
        <Route path="/partner/dashboard"    element={<PartnerRoute element={<PartnerDashboard />} />} />
        <Route path="/partner/stations"     element={<PartnerRoute element={<PartnerStations />} />} />
        <Route path="/partner/bookings"     element={<PartnerRoute element={<PartnerBookings />} />} />
        <Route path="/partner/revenue"      element={<PartnerRoute element={<PartnerRevenue />} />} />
        <Route path="/partner/analytics"    element={<PartnerRoute element={<PartnerAnalytics />} />} />

        {/* Admin Panel */}
        <Route path="/admin"                element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login"          element={<AdminLogin />} />
        <Route path="/admin/overview"       element={<AdminRoute element={<AdminOverview />} />} />
        <Route path="/admin/users"          element={<AdminRoute element={<AdminUsers />} />} />
        <Route path="/admin/partners"       element={<AdminRoute element={<AdminPartners />} />} />
        <Route path="/admin/transactions"   element={<AdminRoute element={<AdminTransactions />} />} />
        <Route path="/admin/disputes"       element={<AdminRoute element={<AdminDisputes />} />} />
        <Route path="/admin/payouts"        element={<AdminRoute element={<AdminPayouts />} />} />
        <Route path="/admin/settings"       element={<AdminRoute element={<AdminSettings />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
