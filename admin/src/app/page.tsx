'use client';
import { useState, useEffect } from 'react';

const API = 'http://localhost:3000';

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [blockedNums, setBlockedNums] = useState<any[]>([]);
  const [blockedUrls, setBlockedUrls] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  useEffect(() => { 
    const token = localStorage.getItem('locksy_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    loadAll(); 
  }, []);

  async function authFetch(url: string, options: any = {}) {
    const token = localStorage.getItem('locksy_token');
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    }).then(async res => {
      if (res.status === 401) {
        localStorage.removeItem('locksy_token');
        window.location.href = '/login';
      }
      return res;
    });
  }

  async function loadAll() {
    const [n, a, g, bn, bu, u, s] = await Promise.all([
      authFetch(`${API}/notifications`).then(r=>r.json()).catch(()=>[]),
      authFetch(`${API}/ads`).then(r=>r.json()).catch(()=>[]),
      authFetch(`${API}/guides`).then(r=>r.json()).catch(()=>[]),
      authFetch(`${API}/blocked-numbers`).then(r=>r.json()).catch(()=>[]),
      authFetch(`${API}/threats/urls/all`).then(r=>r.json()).catch(()=>[]),
      authFetch(`${API}/users/all`).then(r=>r.json()).catch(()=>[]),
      authFetch(`${API}/stats`).then(r=>r.json()).catch(()=>({})),
    ]);
    setNotifications(Array.isArray(n)?n:[]);
    setAds(Array.isArray(a)?a:[]);
    setGuides(Array.isArray(g)?g:[]);
    setBlockedNums(Array.isArray(bn)?bn:[]);
    setBlockedUrls(Array.isArray(bu)?bu.filter((x:any)=>x.type==='BLOCKED'):[]);
    setUsers(Array.isArray(u)?u:[]);
    setStats(s);
  }

  async function del(endpoint: string, id: string) {
    if(!confirm('O\'chirishni tasdiqlaysizmi?')) return;
    await authFetch(`${API}/${endpoint}/${id}`, { method: 'DELETE' });
    loadAll();
  }

  async function save(endpoint: string, data: any, id?: string) {
    await authFetch(`${API}/${endpoint}${id?'/'+id:''}`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setEditing(null);
    loadAll();
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users', label: '👥 Foydalanuvchilar' },
    { id: 'notifications', label: '🔔 Xabarlar' },
    { id: 'ads', label: '📣 Reklamalar' },
    { id: 'guides', label: '📖 Qo\'llanma' },
    { id: 'blocked-nums', label: '📵 Taqiq. Raqamlar' },
    { id: 'blocked-urls', label: '🚫 Bloklangan URL' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#0a0e17', color: '#fff' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#0d1424', borderRight: '1px solid #1e2d45', padding: '24px 0', flexShrink: 0, position:'sticky', top:0, height:'100vh' }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid #1e2d45', marginBottom: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#00e676', letterSpacing: 1.5, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{background:'#00e676', color:'#000', padding:'2px 8px', borderRadius:6, fontSize:18}}>LX</span>
            LOCKSY X
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 8, textTransform:'uppercase', letterSpacing:1 }}>Boshqaruv Paneli</div>
        </div>
        <nav style={{ padding: '0 12px' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems:'center', width: '100%', textAlign: 'left', padding: '14px 16px', marginBottom: 4,
              background: tab === t.id ? 'rgba(0,230,118,0.1)' : 'transparent',
              color: tab === t.id ? '#00e676' : '#94a3b8',
              border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 14, fontWeight: tab === t.id ? 600 : 500,
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 40, overflow: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing:'-0.5px' }}>{tabs.find(t=>t.id===tab)?.label.split(' ')[1]}</h1>
            <p style={{ color: '#64748b', margin: '6px 0 0', fontSize:14 }}>Platforma holati va real vaqt boshqaruvi</p>
          </div>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
             <button onClick={loadAll} style={{background:'#131a28', border:'1px solid #1e2d45', color:'#94a3b8', padding:'8px 16px', borderRadius:8, cursor:'pointer'}}>🔄 Yangilash</button>
             <div style={{ background: '#131a28', border: '1px solid #1e2d45', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight:600, color:'#00e676' }}>Admin: SuperUser</div>
             <button onClick={() => { localStorage.removeItem('locksy_token'); window.location.href='/login'; }} style={{background:'#ef535022', border:'1px solid #ef5350', color:'#ef5350', padding:'8px 16px', borderRadius:8, cursor:'pointer'}}>🚪 Chiqish</button>
          </div>
        </header>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
              {[
                { label: 'Jami Foydalanuvchilar', val: users.length, color: '#00b0ff', icon: '👥' },
                { label: 'Yuborilgan Xabarlar', val: notifications.length, color: '#00e676', icon: '🔔' },
                { label: 'Faol Reklamalar', val: ads.filter(a=>a.isActive).length, color: '#ce93d8', icon: '📣' },
                { label: 'Bloklangan Havolalar', val: stats.blockedLinks || 0, color: '#ef5350', icon: '🚫' },
              ].map(s => (
                <div key={s.label} style={{ background: '#131a28', border: `1px solid #1e2d45`, borderRadius: 16, padding: 24, position:'relative', overflow:'hidden' }}>
                  <div style={{fontSize:40, opacity:0.1, position:'absolute', right:10, bottom:10}}>{s.icon}</div>
                  <div style={{ color: '#64748b', fontSize: 13, fontWeight:600, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#131a28', borderRadius: 16, border: '1px solid #1e2d45', padding: 24 }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                <h3 style={{ margin: 0, color: '#94a3b8', fontSize:18 }}>Oxirgi Faol Foydalanuvchilar</h3>
                <button onClick={()=>setTab('users')} style={{background:'transparent', border:'none', color:'#00b0ff', cursor:'pointer', fontSize:13}}>Barchasini ko'rish →</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ color: '#64748b', fontSize: 12, borderBottom:'1px solid #1e2d45' }}>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Locksy ID</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Hudud</th>
                  <th style={{ textAlign: 'left', padding: '12px' }}>Oxirgi faollik</th>
                  <th style={{ textAlign: 'right', padding: '12px' }}>Harakat</th>
                </tr></thead>
                <tbody>{users.slice(0, 8).map((u:any) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #0d1424' }}>
                    <td style={{ padding: '14px 12px', color: '#00b0ff', fontFamily: 'monospace', fontWeight: 700 }}>{u.locksyId}</td>
                    <td style={{ padding: '14px 12px' }}>🇺🇿 {u.region||'O\'zbekiston'}</td>
                    <td style={{ padding: '14px 12px', fontSize: 13, color: '#94a3b8' }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}</td>
                    <td style={{ padding: '14px 12px', textAlign:'right' }}>
                      <button onClick={()=>setSelectedUser(u)} style={{background:'#00b0ff22', border:'1px solid #00b0ff', color:'#00b0ff', padding:'4px 10px', borderRadius:6, fontSize:12, cursor:'pointer'}}>Info</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div>
            <div style={{marginBottom:20, display:'flex', gap:12}}>
              <input id="user-search" placeholder="Locksy ID bo'yicha qidirish..." style={{...inputStyle, maxWidth:400, marginBottom:0}} 
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  const rows = document.querySelectorAll('.user-row');
                  rows.forEach((row: any) => {
                    const id = row.getAttribute('data-id');
                    row.style.display = id.includes(val) ? '' : 'none';
                  });
                }}
              />
            </div>
            <div style={{ background: '#131a28', borderRadius: 16, border: '1px solid #1e2d45', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0d1424', color: '#64748b', fontSize: 12 }}>
                  {['Locksy ID','Hudud','Ro\'yxatdan o\'tgan','Oxirgi faolligi','Amal'].map(h=>(
                    <th key={h} style={{ textAlign:'left', padding:'16px' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{users.map((u:any) => (
                  <tr key={u.id} className="user-row" data-id={u.locksyId} style={{ borderTop:'1px solid #1e2d45' }}>
                    <td style={{ padding:'16px', color:'#00e676', fontFamily:'monospace', fontWeight:700 }}>{u.locksyId}</td>
                    <td style={{ padding:'16px' }}>🇺🇿 {u.region||'O\'zbekiston'}</td>
                    <td style={{ padding:'16px', fontSize:13, color:'#94a3b8' }}>{new Date(u.registeredAt).toLocaleString()}</td>
                    <td style={{ padding:'16px', fontSize:13, color:'#64748b' }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}</td>
                    <td style={{ padding:'16px' }}>
                      <button onClick={()=>setSelectedUser(u)} style={btnStyle('#00b0ff')}>Batafsil</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === 'notifications' && (
          <div>
            <div style={formCard}>
              <h3 style={{ margin:'0 0 20px', color: '#00e676', fontSize:18 }}>➕ Yangi Ommaviy Xabar</h3>
              <div style={{display:'grid', gap:16}}>
                <input id="notif-title" placeholder="Xabar sarlavhasi (Masalan: Xavfsizlik yangilanishi)" style={inputStyle} />
                <textarea id="notif-msg" placeholder="Xabar matni..." style={{...inputStyle, minHeight:100}} />
                <button onClick={()=>{
                  const t = (document.getElementById('notif-title') as any).value;
                  const m = (document.getElementById('notif-msg') as any).value;
                  if(t&&m) { save('notifications', {title:t, message:m}); (document.getElementById('notif-title') as any).value=''; (document.getElementById('notif-msg') as any).value=''; }
                }} style={{...btnStyle('#00e676', '#000'), padding:'12px', fontSize:14}}>Barcha foydalanuvchilarga yuborish</button>
              </div>
            </div>
            <ListTable
              items={notifications}
              cols={['title','message','createdAt']}
              labels={['Sarlavha','Xabar','Sana']}
              onDelete={(id:any)=>del('notifications',id)}
              onEdit={(item:any)=>setEditing({type:'notif',item})}
            />
          </div>
        )}

        {/* ADS */}
        {tab === 'ads' && (
          <div>
            <AdsForm onSave={(d:any)=>save('ads', d)} />
            <div style={{marginTop:32}}>
              <h3 style={{color:'#94a3b8', fontSize:18, marginBottom:16}}>Mavjud Reklamalar</h3>
              <ListTable
                items={ads}
                cols={['type','content','buttonText','targetUrl','isActive']}
                labels={['Tur','Kontent','Tugma','Havola','Status']}
                onDelete={async (id:any)=>{
                  await del('ads',id);
                  alert('Reklama muvaffaqiyatli o\'chirildi');
                }}
                onEdit={(item:any)=>setEditing({type:'ad',item})}
                extraAction={(item:any)=>(
                  <button onClick={()=>save('ads',{isActive:!item.isActive},item.id)} style={btnStyle(item.isActive?'#ef5350':'#00e676')}>
                    {item.isActive ? 'O\'chir' : 'Yoqish'}
                  </button>
                )}
              />
            </div>
          </div>
        )}

        {/* Other tabs remain similar but stylized */}
        {tab === 'guides' && (
          <div>
            <div style={formCard}>
               <h3 style={{margin:'0 0 20px', color:'#00b0ff'}}>📖 Qo'llanmani Yangilash</h3>
               <div style={{display:'flex', gap:12, marginBottom:16}}>
                 {['uz','ru','en'].map(l => (
                   <button key={l} onClick={()=>setEditing({type:'guide', item: guides.find(g=>g.lang===l) || {lang:l, content:''} })} style={btnStyle('#00b0ff')}>{l.toUpperCase()} tahrirlash</button>
                 ))}
               </div>
               <p style={{color:'#64748b', fontSize:14}}>Har bir til uchun alohida qo'llanma matnini kiritishingiz mumkin.</p>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
               {guides.map(g => (
                 <div key={g.lang} style={{background:'#131a28', border:'1px solid #1e2d45', borderRadius:12, padding:20}}>
                   <div style={{color:'#00b0ff', fontWeight:700, marginBottom:8, textTransform:'uppercase'}}>{g.lang}</div>
                   <div style={{fontSize:13, color:'#94a3b8', maxHeight:100, overflow:'hidden'}}>{g.content}</div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {tab === 'blocked-nums' && (
           <div style={formCard}>
              <h3 style={{margin:'0 0 20px', color:'#ef5350'}}>📵 Taqiq. Raqamlar</h3>
              <div style={{display:'flex', gap:12, marginBottom:24}}>
                <input id="bn-num" placeholder="+998901234567" style={{...inputStyle, flex:1}} />
                <button onClick={()=>{
                  const v = (document.getElementById('bn-num') as any).value;
                  if(v) { save('blocked-numbers', {number:v}); (document.getElementById('bn-num') as any).value=''; }
                }} style={btnStyle('#ef5350')}>Qo'shish</button>
              </div>
              <ListTable 
                items={blockedNums} 
                cols={['number','userId','createdAt']} 
                labels={['Raqam','User','Sana']} 
                onDelete={(id:any)=>del('blocked-numbers',id)}
                onEdit={(item:any)=>setEditing({type:'blocked-num',item})}
              />
              {editing?.type === 'blocked-num' && (
                <EditModal
                  fields={[{name:'number',label:'Telefon Raqam'}]}
                  data={editing.item}
                  onClose={()=>setEditing(null)}
                  onSave={(d:any)=>save('blocked-numbers',d,editing.item.id)}
                />
              )}
           </div>
        )}

        {tab === 'blocked-urls' && (
           <div style={formCard}>
              <h3 style={{margin:'0 0 20px', color:'#ef5350'}}>🚫 Bloklangan URLlar</h3>
              <div style={{display:'flex', gap:12, marginBottom:24}}>
                <input id="bu-url" placeholder="scam-site.com" style={{...inputStyle, flex:1}} />
                <button onClick={()=>{
                  const v = (document.getElementById('bu-url') as any).value;
                  if(v) { save('threats/url', {domain:v, url:v, severity:'CRITICAL', type:'BLOCKED'}); (document.getElementById('bu-url') as any).value=''; }
                }} style={btnStyle('#ef5350')}>Bloklash</button>
              </div>
              <ListTable 
                items={blockedUrls} 
                cols={['domain','severity','createdAt']} 
                labels={['Domain','Xavf','Sana']} 
                onDelete={(id:any)=>del('threats/url',id)}
                onEdit={(item:any)=>setEditing({type:'blocked-url',item})}
              />
              {editing?.type === 'blocked-url' && (
                <EditModal
                  fields={[
                    {name:'domain',label:'Domain / URL'},
                    {name:'severity',label:'Xavf darajasi (CRITICAL/HIGH/MEDIUM/LOW)'}
                  ]}
                  data={editing.item}
                  onClose={()=>setEditing(null)}
                  onSave={(d:any)=>save('threats/url',d,editing.item.id)}
                />
              )}
           </div>
        )}

      </main>

      {/* MODALS */}
      {selectedUser && (
        <Modal title={`Foydalanuvchi: ${selectedUser.locksyId}`} onClose={()=>setSelectedUser(null)}>
          <div style={{display:'grid', gap:12}}>
            <Detail label="Unique ID" value={selectedUser.locksyId} color="#00e676" />
            <Detail label="Hudud" value={selectedUser.region || 'O\'zbekiston'} />
            <Detail label="Ro'yxatdan o'tgan" value={new Date(selectedUser.registeredAt).toLocaleString()} />
            <Detail label="Oxirgi faollik" value={selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Hali kirmagan'} />
            <Detail label="Taqiqlangan raqamlari" value={blockedNums.filter(b=>b.userId===selectedUser.locksyId).length + ' ta'} />
          </div>
        </Modal>
      )}

      {editing?.type === 'notif' && (
        <EditModal fields={[{name:'title',label:'Sarlavha'},{name:'message',label:'Xabar',multiline:true}]} data={editing.item} onClose={()=>setEditing(null)} onSave={(d:any)=>save('notifications',d,editing.item.id)} />
      )}
      
      {editing?.type === 'ad' && (
        <EditModal fields={[
          {name:'type',label:'Tur (text/image/video)'},
          {name:'content',label:'Kontent/URL',multiline:true},
          {name:'buttonText',label:'Tugma matni'},
          {name:'targetUrl',label:'Yo\'naltirish URL'},
          {name:'durationSeconds',label:'Vaqt (sekund)'}
        ]} data={editing.item} onClose={()=>setEditing(null)} onSave={(d:any)=>save('ads',d,editing.item.id)} />
      )}

      {editing?.type === 'guide' && (
        <EditModal fields={[{name:'content',label:'Matn',multiline:true}]} data={editing.item} onClose={()=>setEditing(null)} onSave={(d:any)=>save('guides', {...editing.item, ...d})} />
      )}

    </div>
  );
}

// --- UI COMPONENTS ---

function AdsForm({ onSave }:any) {
  const [type, setType] = useState('text');
  const [content, setContent] = useState('');
  const [btnText, setBtnText] = useState('');
  const [url, setUrl] = useState('');
  const [dur, setDur] = useState('5');

  return (
    <div style={formCard}>
      <h3 style={{ margin:'0 0 20px', color:'#ce93d8', fontSize:18 }}>📣 Yangi Reklama Qo'shish</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div>
          <label style={labelStyle}>Reklama turi</label>
          <select value={type} onChange={e=>setType(e.target.value)} style={inputStyle}>
            <option value="text">Matnli xabar</option>
            <option value="image">Rasm (URL)</option>
            <option value="video">Video (URL)</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Ko'rinish vaqti (sekund)</label>
          <input type="number" value={dur} onChange={e=>setDur(e.target.value)} style={inputStyle} />
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <label style={labelStyle}>Asosiy kontent ({type === 'text' ? 'Matn' : 'URL'})</label>
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="..." style={{...inputStyle, minHeight:60}} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <div>
          <label style={labelStyle}>Tugma matni (Ixtiyoriy)</label>
          <input value={btnText} onChange={e=>setBtnText(e.target.value)} placeholder="Masalan: Sotib olish" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Tugma bosilgandagi URL</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
        </div>
      </div>
      <button onClick={()=>{
        if(content) {
          onSave({type, content, buttonText:btnText, targetUrl:url, durationSeconds:+dur, isActive:true});
          setContent(''); setBtnText(''); setUrl('');
        }
      }} style={{...btnStyle('#ce93d8', '#000'), width:'100%', padding:'12px', fontSize:14, fontWeight:700}}>Reklamani Faollashtirish</button>
    </div>
  );
}

function ListTable({ items, cols, labels, onDelete, onEdit, extraAction }:any) {
  return (
    <div style={{ background:'#131a28', borderRadius:16, border:'1px solid #1e2d45', overflow:'hidden' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'#0d1424' }}>
            {labels.map((l:string) => <th key={l} style={{ textAlign:'left', padding:'12px 16px', color:'#64748b', fontSize:12, fontWeight:600 }}>{l}</th>)}
            <th style={{ textAlign:'right', padding:'12px 16px', color:'#64748b', fontSize:12 }}>Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item:any) => (
            <tr key={item.id} style={{ borderTop:'1px solid #1e2d45' }}>
              {cols.map((c:string) => (
                <td key={c} style={{ padding:'14px 16px', fontSize:13, color: c==='isActive' ? (item[c]?'#00e676':'#ef5350') : '#fff' }}>
                  {c==='isActive' ? (item[c]?'Faol':'O\'chiq') : (item[c]?.toString() || '—')}
                </td>
              ))}
              <td style={{ padding:'14px 16px', textAlign:'right' }}>
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  {extraAction && extraAction(item)}
                  {onEdit && <button onClick={()=>onEdit(item)} style={btnStyle('#00b0ff')}>✏️</button>}
                  <button onClick={()=>onDelete(item.id)} style={btnStyle('#ef5350')}>🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Modal({ title, children, onClose }:any) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)' }}>
      <div style={{ background:'#131a28', border:'1px solid #1e2d45', borderRadius:20, padding:32, width:450, boxShadow:'0 20px 40px rgba(0,0,0,0.4)' }}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:24}}>
          <h3 style={{margin:0, fontSize:20}}>{title}</h3>
          <button onClick={onClose} style={{background:'transparent', border:'none', color:'#64748b', fontSize:24, cursor:'pointer'}}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EditModal({ fields, data, onClose, onSave }:any) {
  const [form, setForm] = useState<any>({...data});
  return (
    <Modal title="Tahrirlash" onClose={onClose}>
      {fields.map((f:any) => (
        <div key={f.name} style={{ marginBottom:16 }}>
          <label style={labelStyle}>{f.label}</label>
          {f.multiline 
            ? <textarea value={form[f.name]||''} onChange={e=>setForm({...form, [f.name]:e.target.value})} style={{...inputStyle, minHeight:100}} />
            : <input value={form[f.name]||''} onChange={e=>setForm({...form, [f.name]:e.target.value})} style={inputStyle} />
          }
        </div>
      ))}
      <button onClick={()=>onSave(form)} style={{...btnStyle('#00e676','#000'), width:'100%', padding:'12px', marginTop:10}}>O'zgarishlarni Saqlash</button>
    </Modal>
  );
}

function Detail({ label, value, color }:any) {
  return (
    <div style={{background:'#0d1424', padding:'12px 16px', borderRadius:10, border:'1px solid #1e2d45'}}>
      <div style={{fontSize:11, color:'#64748b', textTransform:'uppercase', marginBottom:4}}>{label}</div>
      <div style={{fontSize:15, fontWeight:600, color: color || '#fff'}}>{value}</div>
    </div>
  );
}

const inputStyle:any = { width:'100%', padding:'12px 16px', background:'#0d1424', border:'1px solid #1e2d45', borderRadius:10, color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };
const labelStyle:any = { display:'block', fontSize:12, color:'#64748b', marginBottom:6, fontWeight:600 };
const formCard:any = { background:'#131a28', border:'1px solid #1e2d45', borderRadius:16, padding:24, marginBottom:24 };
function btnStyle(bg:string, color='#fff'):any {
  return { padding:'8px 16px', background:bg+'15', border:`1px solid ${bg}`, color:bg, borderRadius:8, cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.2s' };
}
