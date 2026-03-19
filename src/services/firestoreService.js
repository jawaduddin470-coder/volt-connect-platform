import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  getDocs,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

// Generic real-time listener
export const subscribeToCollection = (collectionName, callback, queryConstraints = []) => {
  try {
    const q = query(collection(db, collectionName), ...queryConstraints);
    return onSnapshot(
      q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      },
      (error) => {
        console.warn(`Firestore subscription error for ${collectionName}:`, error.message);
      }
    );
  } catch (err) {
    console.warn(`Failed to subscribe to ${collectionName}:`, err.message);
    return () => {};
  }
};

// Stations
export const updateStationStatus = async (stationId, status) => {
  const stationRef = doc(db, 'stations', stationId);
  await updateDoc(stationRef, { status, updatedAt: serverTimestamp() });
};

export const addStation = async (stationData) => {
  return await addDoc(collection(db, 'stations'), {
    ...stationData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

// Bookings
export const createBooking = async (bookingData) => {
  return await addDoc(collection(db, 'bookings'), {
    ...bookingData,
    status: 'upcoming',
    createdAt: serverTimestamp()
  });
};

// Users
export const updateUserBalance = async (userId, newBalance) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { walletBalance: newBalance, updatedAt: serverTimestamp() });
};

export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    role: 'consumer',
    walletBalance: 0,
    createdAt: serverTimestamp()
  }, { merge: true });
};

export const getUserProfile = async (uid) => {
  const { getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const subscribeToDocument = (collectionName, docId, callback) => {
  try {
    return onSnapshot(
      doc(db, collectionName, docId),
      (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (err) => console.warn(`Doc subscription error:`, err.message)
    );
  } catch (err) {
    console.warn(`Failed to subscribe to doc:`, err.message);
    return () => {};
  }
};

// Seeding helper (one-time)
export const seedFirestore = async (data) => {
  const { stations, bookings, users, partners, transactions } = data;
  
  // Seed stations
  for (const s of stations) {
    await setDoc(doc(db, 'stations', s.id), s);
  }
  // Seed bookings
  for (const b of bookings) {
    await setDoc(doc(db, 'bookings', b.id), b);
  }
  // Seed users
  for (const u of users) {
    await setDoc(doc(db, 'users', u.id), u);
  }
  // Seed partners
  for (const p of partners) {
    await setDoc(doc(db, 'partners', p.id), p);
  }
  // Seed transactions
  for (const t of transactions) {
    await setDoc(doc(db, 'transactions', t.id), t);
  }
};
