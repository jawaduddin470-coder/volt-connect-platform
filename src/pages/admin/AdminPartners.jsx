import { useState, useEffect, useCallback } from 'react';
import { Plus, Copy, Check, RefreshCw, ToggleLeft, ToggleRight, X, AlertTriangle } from 'lucide-react';
import { createPartner, getAllPartners, deactivatePartner, reactivatePartner, resetPartnerPin, CITY_CODES } from '../../services/partnerAuth';

const CITIES = Object.keys(CITY_CODES);

// ─── Helper: copy to clipboard ───
function useCopySuccess() {
  const [copied, setCopied] = useState(null);
  const copy = useCallback((text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);
  return [copied, copy];
}

// ─── Create Partner Modal ───
function CreatePartnerModal({ onClose, onCreate }) {
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState(CITIES[0]);
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, copy] = useCopySuccess();

  const handleCreate = async () => {
    if (!companyName.trim()) return;
    setLoading(true);
    try {
      const { partnerId, pin } = await createPartner(companyName.trim(), city, contactEmail.trim());
      setResult({ partnerId, pin });
      onCreate();
    } catch (e) {
      alert('Error creating partner: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 24px 60px rgba(0,0,0,0.15)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' }}>
          <X size={16} />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 24 }}>Create New Partner</h2>

        {!result ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Company Name *</label>
              <input style={inputStyle} placeholder="e.g. Tata Power EZ" value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>City *</label>
              <select style={inputStyle} value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Contact Email (optional)</label>
              <input style={inputStyle} type="email" placeholder="partner@company.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#166534' }}>
              Partner ID will be auto-generated as <strong>VOLT-{CITY_CODES[city]}-XXX</strong> with a 6-digit PIN.
            </div>
            <button onClick={handleCreate} disabled={loading || !companyName.trim()} style={{ width: '100%', padding: '12px 20px', borderRadius: 10, border: 'none', background: companyName.trim() ? '#7C3AED' : '#d1d5db', color: '#fff', fontWeight: 700, fontSize: 14, cursor: companyName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
              {loading ? 'Creating...' : 'Create Partner Account'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Partner Created!</h3>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Share these credentials securely with the partner.</p>
            {[
              { label: 'Partner ID', value: result.partnerId, key: 'id' },
              { label: 'PIN', value: result.pin, key: 'pin' },
            ].map(({ label, value, key }) => (
              <div key={key} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', letterSpacing: '0.05em' }}>{value}</div>
                </div>
                <button onClick={() => copy(value, key)} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'inherit' }}>
                  {copied === key ? <><Check size={13} color="#00C853" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
            ))}
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginTop: 16, display: 'flex', gap: 8, alignItems: 'flex-start', textAlign: 'left' }}>
              <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#92400e' }}>Save this PIN now — it cannot be retrieved later. Use Reset PIN if lost.</span>
            </div>
            <button onClick={onClose} style={{ marginTop: 20, width: '100%', padding: '11px 20px', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block', letterSpacing: '0.02em' };
const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#1a1a2e', background: '#fff' };

// ─── Main AdminPartners ───
export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [resetResult, setResetResult] = useState(null); // { name, pin }
  const [copied, copy] = useCopySuccess();
  const [actionLoading, setActionLoading] = useState(null);

  const loadPartners = async () => {
    setLoading(true);
    try { setPartners(await getAllPartners()); }
    catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadPartners(); }, []);

  const handleToggle = async (partner) => {
    setActionLoading(partner.id);
    try {
      if (partner.status === 'active') await deactivatePartner(partner.id);
      else await reactivatePartner(partner.id);
      await loadPartners();
    } catch (e) { alert('Error: ' + e.message); }
    setActionLoading(null);
  };

  const handleResetPin = async (partner) => {
    if (!window.confirm(`Reset PIN for ${partner.companyName}?`)) return;
    setActionLoading(partner.id + '_pin');
    try {
      const newPin = await resetPartnerPin(partner.id);
      setResetResult({ name: partner.companyName, partnerId: partner.partnerId, pin: newPin });
    } catch (e) { alert('Error: ' + e.message); }
    setActionLoading(null);
  };

  const activeCount = partners.filter(p => p.status === 'active').length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e', marginBottom: 2 }}>Manage Partners</h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>{activeCount} active · {partners.length} total</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={16} /> Create Partner
        </button>
      </div>

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Partners', value: partners.length, color: '#7C3AED' },
          { label: 'Active', value: activeCount, color: '#00C853' },
          { label: 'Inactive', value: partners.length - activeCount, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="p-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Partners table */}
      <div className="p-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>Loading partners...</div>
        ) : partners.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
            <p style={{ color: '#9ca3af', fontWeight: 500 }}>No partners yet. Create your first one!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Company</th><th>Partner ID</th><th>City</th>
                  <th>Contact</th><th>Status</th><th>Created</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: '#1a1a2e' }}>{p.companyName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <code style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, color: '#7C3AED' }}>{p.partnerId}</code>
                        <button onClick={() => copy(p.partnerId, p.id + '_id')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2, display: 'flex' }}>
                          {copied === p.id + '_id' ? <Check size={12} color="#00C853" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                    <td style={{ color: '#6b7280' }}>{p.city}</td>
                    <td style={{ color: '#6b7280', maxWidth: 160 }}>
                      {p.contactEmail ? <a href={`mailto:${p.contactEmail}`} style={{ color: '#6b7280', textDecoration: 'none' }}>{p.contactEmail}</a> : '—'}
                    </td>
                    <td>
                      <span className={p.status === 'active' ? 'status-active' : 'status-inactive'}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280' }}>{p.createdAt ? p.createdAt.slice(0, 10) : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {/* Toggle active/inactive */}
                        <button
                          onClick={() => handleToggle(p)}
                          disabled={actionLoading === p.id}
                          title={p.status === 'active' ? 'Deactivate' : 'Reactivate'}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 9px', borderRadius: 6, background: 'none', border: `1px solid ${p.status === 'active' ? '#fca5a5' : '#6ee7b7'}`, color: p.status === 'active' ? '#dc2626' : '#047857', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                        >
                          {actionLoading === p.id ? '...' : p.status === 'active' ? <><ToggleRight size={12} />Deactivate</> : <><ToggleLeft size={12} />Reactivate</>}
                        </button>

                        {/* Reset PIN */}
                        <button
                          onClick={() => handleResetPin(p)}
                          disabled={actionLoading === p.id + '_pin'}
                          title="Reset PIN"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 9px', borderRadius: 6, background: 'none', border: '1px solid #c4b5fd', color: '#7C3AED', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                        >
                          {actionLoading === p.id + '_pin' ? '...' : <><RefreshCw size={12} />Reset PIN</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && <CreatePartnerModal onClose={() => setShowCreate(false)} onCreate={loadPartners} />}

      {/* Reset PIN result modal */}
      {resetResult && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔑</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>PIN Reset</h3>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 22 }}>{resetResult.name}</p>
            {[
              { label: 'Partner ID', value: resetResult.partnerId, key: 'rid' },
              { label: 'New PIN', value: resetResult.pin, key: 'rpin' },
            ].map(({ label, value, key }) => (
              <div key={key} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>{value}</div>
                </div>
                <button onClick={() => copy(value, key)} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'inherit' }}>
                  {copied === key ? <><Check size={13} color="#00C853" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
            ))}
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginTop: 12, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start', textAlign: 'left' }}>
              <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#92400e' }}>Save this PIN — it cannot be retrieved again.</span>
            </div>
            <button onClick={() => setResetResult(null)} style={{ width: '100%', padding: '11px 20px', borderRadius: 10, border: 'none', background: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
