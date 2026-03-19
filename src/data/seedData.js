// Seed data for VoltConnect platform

export const STATIONS = [
  {
    id: 'stn_001',
    partnerId: 'partner_001',
    name: 'Ather Grid - Hitech City',
    operator: 'Ather',
    address: 'Plot 12, Hitec City Rd, HITEC City',
    city: 'Hyderabad',
    lat: 17.4486,
    lng: 78.3908,
    distance: '0.8 km',
    operatingHours: '24/7',
    amenities: ['Parking', 'WiFi', 'Security'],
    isActive: true,
    sessionsToday: 24,
    revenueToday: 3360,
    connectors: [
      { id: 'c1', type: 'CCS2', powerKW: 50, pricePerUnit: 14, status: 'available', maxDuration: 120 },
      { id: 'c2', type: 'CCS2', powerKW: 50, pricePerUnit: 14, status: 'occupied', maxDuration: 120 },
      { id: 'c3', type: 'Type2', powerKW: 7, pricePerUnit: 9, status: 'available', maxDuration: 240 },
      { id: 'c4', type: 'Type2', powerKW: 7, pricePerUnit: 9, status: 'available', maxDuration: 240 },
    ],
  },
  {
    id: 'stn_002',
    partnerId: 'partner_002',
    name: 'Tata Power EZ - Banjara Hills',
    operator: 'Tata Power',
    address: '23-A, Road No. 10, Banjara Hills',
    city: 'Hyderabad',
    lat: 17.4156,
    lng: 78.4347,
    distance: '2.1 km',
    operatingHours: '6:00 AM – 11:00 PM',
    amenities: ['Parking', 'Restroom', 'Cafe'],
    isActive: true,
    sessionsToday: 31,
    revenueToday: 4650,
    connectors: [
      { id: 'c1', type: 'CCS2', powerKW: 60, pricePerUnit: 15, status: 'available', maxDuration: 90 },
      { id: 'c2', type: 'CCS2', powerKW: 60, pricePerUnit: 15, status: 'occupied', maxDuration: 90 },
      { id: 'c3', type: 'CCS2', powerKW: 60, pricePerUnit: 15, status: 'available', maxDuration: 90 },
      { id: 'c4', type: 'CCS2', powerKW: 60, pricePerUnit: 15, status: 'occupied', maxDuration: 90 },
    ],
  },
  {
    id: 'stn_003',
    partnerId: 'partner_003',
    name: 'Statiq - Gachibowli',
    operator: 'Statiq',
    address: 'DLF Cyber City, Gachibowli',
    city: 'Hyderabad',
    lat: 17.4401,
    lng: 78.3489,
    distance: '3.4 km',
    operatingHours: '24/7',
    amenities: ['Parking', 'Security', 'WiFi'],
    isActive: true,
    sessionsToday: 18,
    revenueToday: 2340,
    connectors: [
      { id: 'c1', type: 'CHAdeMO', powerKW: 50, pricePerUnit: 13, status: 'available', maxDuration: 60 },
      { id: 'c2', type: 'CHAdeMO', powerKW: 50, pricePerUnit: 13, status: 'available', maxDuration: 60 },
      { id: 'c3', type: 'CCS2', powerKW: 150, pricePerUnit: 18, status: 'occupied', maxDuration: 45 },
    ],
  },
  {
    id: 'stn_004',
    partnerId: 'partner_004',
    name: 'ChargeZone - Jubilee Hills',
    operator: 'ChargeZone',
    address: 'Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    lat: 17.4239,
    lng: 78.4073,
    distance: '4.2 km',
    operatingHours: '7:00 AM – 10:00 PM',
    amenities: ['Parking', 'Cafe', 'Restroom'],
    isActive: true,
    sessionsToday: 12,
    revenueToday: 1200,
    connectors: [
      { id: 'c1', type: 'Type2', powerKW: 22, pricePerUnit: 10, status: 'available', maxDuration: 180 },
      { id: 'c2', type: 'Type2', powerKW: 22, pricePerUnit: 10, status: 'available', maxDuration: 180 },
      { id: 'c3', type: 'Type2', powerKW: 22, pricePerUnit: 10, status: 'occupied', maxDuration: 180 },
    ],
  },
  {
    id: 'stn_005',
    partnerId: 'partner_005',
    name: 'HPCL EV Point - Madhapur',
    operator: 'HPCL',
    address: 'HPCL Petrol Pump, Madhapur',
    city: 'Hyderabad',
    lat: 17.4504,
    lng: 78.3803,
    distance: '1.5 km',
    operatingHours: '24/7',
    amenities: ['Parking'],
    isActive: true,
    sessionsToday: 8,
    revenueToday: 960,
    connectors: [
      { id: 'c1', type: 'CCS2', powerKW: 30, pricePerUnit: 12, status: 'available', maxDuration: 90 },
      { id: 'c2', type: 'CCS2', powerKW: 30, pricePerUnit: 12, status: 'available', maxDuration: 90 },
    ],
  },
];

export const MOCK_BOOKINGS = [
  { id: 'bk_001', userId: 'usr_001', userName: 'R***a S***h', stationId: 'stn_001', stationName: 'Ather Grid - Hitech City', connectorType: 'CCS2', scheduledAt: '2026-03-20 09:00', duration: 60, estimatedCost: 700, commissionAmount: 56, netPartnerAmount: 644, status: 'upcoming', paymentMethod: 'UPI' },
  { id: 'bk_002', userId: 'usr_002', userName: 'P***h K***r', stationId: 'stn_002', stationName: 'Tata Power EZ - Banjara Hills', connectorType: 'CCS2', scheduledAt: '2026-03-20 11:30', duration: 30, estimatedCost: 450, commissionAmount: 36, netPartnerAmount: 414, status: 'active', paymentMethod: 'VoltWallet' },
  { id: 'bk_003', userId: 'usr_003', userName: 'A***n M***a', stationId: 'stn_003', stationName: 'Statiq - Gachibowli', connectorType: 'CHAdeMO', scheduledAt: '2026-03-19 16:00', duration: 60, estimatedCost: 650, commissionAmount: 52, netPartnerAmount: 598, status: 'completed', paymentMethod: 'Card' },
  { id: 'bk_004', userId: 'usr_004', userName: 'S***i R***o', stationId: 'stn_004', stationName: 'ChargeZone - Jubilee Hills', connectorType: 'Type2', scheduledAt: '2026-03-19 14:00', duration: 120, estimatedCost: 440, commissionAmount: 35.2, netPartnerAmount: 404.8, status: 'completed', paymentMethod: 'UPI' },
  { id: 'bk_005', userId: 'usr_005', userName: 'V***k T***i', stationId: 'stn_005', stationName: 'HPCL EV Point - Madhapur', connectorType: 'CCS2', scheduledAt: '2026-03-20 13:00', duration: 60, estimatedCost: 360, commissionAmount: 28.8, netPartnerAmount: 331.2, status: 'upcoming', paymentMethod: 'UPI' },
  { id: 'bk_006', userId: 'usr_001', userName: 'R***a S***h', stationId: 'stn_002', stationName: 'Tata Power EZ - Banjara Hills', connectorType: 'CCS2', scheduledAt: '2026-03-18 17:30', duration: 45, estimatedCost: 562.5, commissionAmount: 45, netPartnerAmount: 517.5, status: 'cancelled', paymentMethod: 'VoltWallet' },
];

export const MOCK_USERS = [
  { id: 'usr_admin', name: 'Merajuddin Ash', email: 'vcbashmeraj@admin.in', phone: '+91 00000 00000', joined: '2026-03-20', totalSessions: 0, totalSpent: 0, status: 'active', role: 'admin' },
  { id: 'usr_001', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', phone: '+91 98765 43210', joined: '2025-11-12', totalSessions: 28, totalSpent: 14200, status: 'active', role: 'consumer' },
  { id: 'usr_002', name: 'Priya Krishnan', email: 'priya.k@outlook.com', phone: '+91 87654 32109', joined: '2025-12-03', totalSessions: 15, totalSpent: 7800, status: 'active' },
  { id: 'usr_003', name: 'Arjun Mehta', email: 'arjun.m@icloud.com', phone: '+91 76543 21098', joined: '2026-01-15', totalSessions: 42, totalSpent: 22100, status: 'active' },
  { id: 'usr_004', name: 'Sneha Reddy', email: 'sneha.r@gmail.com', phone: '+91 65432 10987', joined: '2026-02-08', totalSessions: 9, totalSpent: 4100, status: 'active' },
  { id: 'usr_005', name: 'Vikram Tiwari', email: 'vikram.t@yahoo.com', phone: '+91 54321 09876', joined: '2025-10-22', totalSessions: 61, totalSpent: 31500, status: 'active' },
  { id: 'usr_006', name: 'Kavya Nair', email: 'kavya.n@gmail.com', phone: '+91 43210 98765', joined: '2026-01-30', totalSessions: 3, totalSpent: 1200, status: 'suspended' },
];

export const MOCK_PARTNERS = [
  { id: 'partner_001', companyName: 'Ather Energy', contactEmail: 'ops@ather.in', contactPhone: '+91 80 4121 0456', stations: 24, monthlyRevenue: 186000, commissionRate: 8, status: 'active', joined: '2025-09-01' },
  { id: 'partner_002', companyName: 'Tata Power EV', contactEmail: 'ev@tatapower.com', contactPhone: '+91 22 6665 8282', stations: 67, monthlyRevenue: 542000, commissionRate: 7, status: 'active', joined: '2025-08-15' },
  { id: 'partner_003', companyName: 'Statiq', contactEmail: 'partner@statiq.in', contactPhone: '+91 11 4117 9999', stations: 18, monthlyRevenue: 98000, commissionRate: 8, status: 'active', joined: '2025-11-20' },
  { id: 'partner_004', companyName: 'ChargeZone', contactEmail: 'biz@chargezone.in', contactPhone: '+91 79 6767 6767', stations: 35, monthlyRevenue: 234000, commissionRate: 8, status: 'active', joined: '2025-10-05' },
  { id: 'partner_005', companyName: 'HPCL Green R&D', contactEmail: 'ev@hpcl.in', contactPhone: '+91 22 2286 4607', stations: 12, monthlyRevenue: 67000, commissionRate: 9, status: 'pending', joined: '2026-02-14' },
];

export const MOCK_TRANSACTIONS = [
  { id: 'txn_001', bookingId: 'bk_003', userId: 'usr_003', partnerId: 'partner_003', partnerName: 'Statiq', amount: 650, commission: 52, netPayout: 598, method: 'Card', status: 'completed', date: '2026-03-19' },
  { id: 'txn_002', bookingId: 'bk_004', userId: 'usr_004', partnerId: 'partner_004', partnerName: 'ChargeZone', amount: 440, commission: 35.2, netPayout: 404.8, method: 'UPI', status: 'completed', date: '2026-03-19' },
  { id: 'txn_003', bookingId: 'bk_001', userId: 'usr_001', partnerId: 'partner_001', partnerName: 'Ather Energy', amount: 700, commission: 56, netPayout: 644, method: 'UPI', status: 'pending', date: '2026-03-20' },
  { id: 'txn_004', bookingId: 'bk_002', userId: 'usr_002', partnerId: 'partner_002', partnerName: 'Tata Power EV', amount: 450, commission: 36, netPayout: 414, method: 'VoltWallet', status: 'pending', date: '2026-03-20' },
  { id: 'txn_005', bookingId: 'bk_005', userId: 'usr_005', partnerId: 'partner_005', partnerName: 'HPCL', amount: 360, commission: 28.8, netPayout: 331.2, method: 'UPI', status: 'pending', date: '2026-03-20' },
];

export const MOCK_DISPUTES = [
  { id: 'dsp_001', bookingId: 'bk_006', userId: 'usr_001', userName: 'Rahul Sharma', partnerId: 'partner_002', partnerName: 'Tata Power EV', reason: 'Payment deducted but charger did not start', status: 'open', resolution: null, createdAt: '2026-03-19', amount: 562.5 },
  { id: 'dsp_002', bookingId: 'bk_007', userId: 'usr_006', userName: 'Kavya Nair', partnerId: 'partner_001', partnerName: 'Ather Energy', reason: 'Charged for 60 mins but session ended after 20 mins', status: 'under_review', resolution: null, createdAt: '2026-03-17', amount: 280 },
];

// Revenue chart data (last 30 days)
export const REVENUE_CHART_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2026-03-20');
  date.setDate(date.getDate() - (29 - i));
  const day = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  return {
    date: day,
    revenue: Math.round(8000 + Math.random() * 12000),
    sessions: Math.round(40 + Math.random() * 60),
  };
});

export const CONNECTOR_DONUT_DATA = [
  { name: 'CCS2 DC Fast', value: 48, color: '#00C853' },
  { name: 'Type2 AC', value: 28, color: '#1565C0' },
  { name: 'CHAdeMO', value: 14, color: '#FF6D00' },
  { name: 'Ultra Fast', value: 10, color: '#AA00FF' },
];

export const HEATMAP_DATA = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data = [];
  for (const day of days) {
    for (let h = 0; h < 24; h++) {
      const isPeak = (h >= 8 && h <= 10) || (h >= 17 && h <= 20);
      const isMid = (h >= 11 && h <= 16);
      const isWeekend = day === 'Sat' || day === 'Sun';
      let intensity = Math.random() * 0.2;
      if (isPeak) intensity += isWeekend ? 0.4 : 0.6;
      else if (isMid) intensity += 0.3;
      data.push({ day, hour: h, intensity: Math.min(intensity, 1) });
    }
  }
})();

export const SEED_ALL = {
  stations: STATIONS,
  bookings: MOCK_BOOKINGS,
  users: MOCK_USERS,
  partners: MOCK_PARTNERS,
  transactions: MOCK_TRANSACTIONS,
  disputes: MOCK_DISPUTES
};
