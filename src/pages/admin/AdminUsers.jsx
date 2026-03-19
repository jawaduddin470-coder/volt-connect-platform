import { useState } from 'react';
import { MOCK_USERS } from '../../data/seedData';
import { Search } from 'lucide-react';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search));

  return (
    <div>
      <h1 style={{ fontSize:20, fontWeight:800, color:'#1a1a2e', marginBottom:16 }}>Users</h1>
      <div style={{ position:'relative', marginBottom:16, maxWidth:320 }}>
        <Search size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af' }} />
        <input className="input-light" style={{ paddingLeft:36 }} placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div className="p-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table" style={{ fontSize:13 }}>
            <thead>
              <tr><th>User ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Sessions</th><th>Spent</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u=>(
                <tr key={u.id}>
                  <td style={{ color:'#1565C0', fontWeight:600 }}>{u.id}</td>
                  <td style={{ fontWeight:600 }}>{u.name}</td>
                  <td style={{ color:'#6b7280' }}>{u.email}</td>
                  <td style={{ color:'#6b7280' }}>{u.phone}</td>
                  <td style={{ color:'#6b7280' }}>{u.joined}</td>
                  <td style={{ fontWeight:600 }}>{u.totalSessions}</td>
                  <td style={{ fontWeight:700, color:'#00C853' }}>₹{u.totalSpent.toLocaleString()}</td>
                  <td><span className={`status-${u.status}`}>{u.status}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button style={{ fontSize:11, padding:'3px 8px', borderRadius:4, background:'none', border:'1px solid #e5e7eb', cursor:'pointer', color:'#6b7280', fontFamily:'inherit' }}>View</button>
                      <button style={{ fontSize:11, padding:'3px 8px', borderRadius:4, background:'none', border:'1px solid #fca5a5', cursor:'pointer', color:'#dc2626', fontFamily:'inherit' }}>Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
