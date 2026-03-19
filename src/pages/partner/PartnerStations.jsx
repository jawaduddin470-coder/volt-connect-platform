import { useState } from 'react';
import { STATIONS } from '../../data/seedData';
import { Plus, Edit, Eye, Power, X } from 'lucide-react';

const CONNECTOR_TYPES = ['CCS2', 'Type2', 'CHAdeMO', 'Type1'];
const AMENITIES_LIST = ['Parking', 'Restroom', 'Cafe', 'WiFi', 'Security'];

function AddStationModal({ onClose }) {
  const [form, setForm] = useState({ name:'', address:'', city:'Hyderabad', pincode:'', lat:'', lng:'', hours:'24/7', amenities:[] });
  const [connectors, setConnectors] = useState([{ type:'CCS2', powerKW:'50', pricePerUnit:'14', maxDuration:'120' }]);

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:560, maxHeight:'90dvh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>Add New Station</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280' }}><X size={20}/></button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          {[['Station Name','name','text','e.g. Ather Grid HQ'],['Address','address','text','Full address'],['City','city','text','Hyderabad'],['Pincode','pincode','text','500081'],['Latitude','lat','number','17.4486'],['Longitude','lng','number','78.3908']].map(([label,key,type,ph])=>(
            <div key={key}>
              <label style={{fontSize:12,color:'#6b7280',marginBottom:4,display:'block'}}>{label}</label>
              <input className="input-light" type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={{fontSize:12,color:'#6b7280',marginBottom:4,display:'block'}}>Operating Hours</label>
          <select className="input-light" value={form.hours} onChange={e=>setForm({...form,hours:e.target.value})}>
            <option>24/7</option><option>6:00 AM – 11:00 PM</option><option>7:00 AM – 10:00 PM</option>
          </select>
        </div>

        {/* Connectors */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <label style={{fontSize:13,fontWeight:600,color:'#1a1a2e'}}>Connectors</label>
            <button onClick={()=>setConnectors([...connectors,{type:'Type2',powerKW:'22',pricePerUnit:'10',maxDuration:'180'}])}
              style={{background:'none',border:'none',color:'#00C853',cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',gap:4,fontFamily:'inherit'}}>
              <Plus size={14}/>Add
            </button>
          </div>
          {connectors.map((c,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr auto', gap:8, marginBottom:8, alignItems:'end' }}>
              <div>
                {i===0 && <label style={{fontSize:11,color:'#9ca3af',marginBottom:4,display:'block'}}>Type</label>}
                <select className="input-light" value={c.type} onChange={e=>{const n=[...connectors];n[i].type=e.target.value;setConnectors(n);}}>
                  {CONNECTOR_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              {[['kW','powerKW'],['₹/kWh','pricePerUnit'],['Max min','maxDuration']].map(([ph,field])=>(
                <div key={field}>
                  {i===0 && <label style={{fontSize:11,color:'#9ca3af',marginBottom:4,display:'block'}}>{ph}</label>}
                  <input className="input-light" type="number" placeholder={ph} value={c[field]}
                    onChange={e=>{const n=[...connectors];n[i][field]=e.target.value;setConnectors(n);}} />
                </div>
              ))}
              <button onClick={()=>setConnectors(connectors.filter((_,j)=>j!==i))}
                style={{ background:'none', border:'none', color:'#FF1744', cursor:'pointer', paddingTop: i===0?20:0 }}>
                <X size={16}/>
              </button>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div style={{ marginBottom:20 }}>
          <label style={{fontSize:13,fontWeight:600,color:'#1a1a2e',marginBottom:8,display:'block'}}>Amenities</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {AMENITIES_LIST.map(a=>(
              <button key={a} onClick={()=>setForm({...form,amenities:form.amenities.includes(a)?form.amenities.filter(x=>x!==a):[...form.amenities,a]})}
                style={{ padding:'6px 14px', borderRadius:24, border:`1.5px solid ${form.amenities.includes(a)?'#00C853':'#e5e7eb'}`, background:form.amenities.includes(a)?'rgba(0,200,83,0.1)':'#fff', color:form.amenities.includes(a)?'#007B33':'#6b7280', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
          <button className="btn-primary" style={{ flex:2, justifyContent:'center' }}>Save Station</button>
        </div>
      </div>
    </div>
  );
}

export default function PartnerStations() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#1a1a2e', marginBottom:2 }}>My Stations</h1>
          <p style={{ color:'#6b7280', fontSize:14 }}>{STATIONS.length} stations registered</p>
        </div>
        <button className="btn-primary" onClick={()=>setShowModal(true)}><Plus size={16}/>Add Station</button>
      </div>

      <div className="p-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Station Name</th><th>Address</th><th>Connectors</th>
                <th>Status</th><th>Sessions Today</th><th>Revenue Today</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {STATIONS.map(s=>{
                const available = s.connectors.filter(c=>c.status==='available').length;
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight:600, color:'#1a1a2e' }}>{s.name}</td>
                    <td style={{ color:'#6b7280', fontSize:13 }}>{s.city}</td>
                    <td>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {[...new Set(s.connectors.map(c=>c.type))].map(t=>(
                          <span key={t} style={{ fontSize:11, padding:'2px 7px', borderRadius:4, background:'#f3f4f6', color:'#374151', fontWeight:600 }}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td><span className="status-active">Active</span></td>
                    <td style={{ fontWeight:600 }}>{s.sessionsToday}</td>
                    <td style={{ fontWeight:700, color:'#00C853' }}>₹{s.revenueToday.toLocaleString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12, color:'#6b7280', fontFamily:'inherit' }}>Edit</button>
                        <button style={{ background:'none', border:'1px solid #e5e7eb', borderRadius:6, padding:'4px 10px', cursor:'pointer', fontSize:12, color:'#6b7280', fontFamily:'inherit' }}>View</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddStationModal onClose={()=>setShowModal(false)} />}
    </div>
  );
}
