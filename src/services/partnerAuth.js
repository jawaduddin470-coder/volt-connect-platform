// Partner Auth Service — Firestore-backed Partner ID + PIN auth
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

const COLLECTION = 'voltconnect_partners';

const CITY_CODES = {
  'Hyderabad': 'HYD', 'Mumbai': 'MUM', 'Delhi': 'DEL', 'Bangalore': 'BLR',
  'Chennai': 'CHN', 'Kolkata': 'KOL', 'Pune': 'PUN', 'Ahmedabad': 'AMD',
  'Jaipur': 'JAI', 'Surat': 'SUR', 'Lucknow': 'LKO', 'Kochi': 'COK',
};

/** SHA-256 hash a string */
async function hashPin(rawPin) {
  const enc = new TextEncoder().encode(rawPin);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Generate a random 6-digit PIN */
function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Generate next Partner ID for a city, e.g. VOLT-HYD-007 */
async function generatePartnerId(city) {
  const code = CITY_CODES[city] || city.toUpperCase().slice(0, 3);
  const prefix = `VOLT-${code}-`;
  const q = query(collection(db, COLLECTION), where('city', '==', city));
  const snap = await getDocs(q);
  const count = snap.size + 1;
  return `${prefix}${String(count).padStart(3, '0')}`;
}

/** Create a new partner — returns { partnerId, pin } */
export async function createPartner(companyName, city, contactEmail = '') {
  const partnerId = await generatePartnerId(city);
  const pin = generatePin();
  const pinHash = await hashPin(pin);
  const docId = partnerId.replace(/-/g, '_');
  await setDoc(doc(db, COLLECTION, docId), {
    partnerId,
    companyName,
    city,
    contactEmail,
    pinHash,
    status: 'active',
    createdAt: new Date().toISOString(),
  });
  return { partnerId, pin };
}

/** Validate Partner ID + PIN. Returns partner data or throws. */
export async function loginPartner(partnerId, rawPin) {
  const pinHash = await hashPin(rawPin);
  const q = query(
    collection(db, COLLECTION),
    where('partnerId', '==', partnerId.trim().toUpperCase()),
    where('pinHash', '==', pinHash)
  );
  const snap = await getDocs(q);
  if (snap.empty) throw new Error('invalid_credentials');
  const data = snap.docs[0].data();
  if (data.status !== 'active') throw new Error('suspended');
  return data;
}

/** Get all partners */
export async function getAllPartners() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Deactivate a partner */
export async function deactivatePartner(docId) {
  await updateDoc(doc(db, COLLECTION, docId), { status: 'inactive' });
}

/** Reactivate a partner */
export async function reactivatePartner(docId) {
  await updateDoc(doc(db, COLLECTION, docId), { status: 'active' });
}

/** Reset a partner's PIN — returns the new plain PIN */
export async function resetPartnerPin(docId) {
  const pin = generatePin();
  const pinHash = await hashPin(pin);
  await updateDoc(doc(db, COLLECTION, docId), { pinHash });
  return pin;
}

export { CITY_CODES };
