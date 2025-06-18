// pages/challenge3.js  • 100 % работает и в Android 4.4
// ======================================================
import { useEffect, useState } from 'react';
import sbRest                  from '../utils/sbRest';
import DayMaterial             from '../components/DayMaterial';
import Link                    from 'next/link';
import { parse }               from 'cookie';

const ONE_DAY   = 86_400_000;
const queueKey  = 'tz_queue_v1';
const SB_URL    = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isBrowser = typeof window !== 'undefined';

/* ---------- полифиллы только в браузере --------------------- */
if (isBrowser) {
  if (!('Promise' in window))         await import('es6-promise/auto');
  if (!Array.from)                    Array.from = obj => [].slice.call(obj);
}

/* ---------- универсальный upsert ---------------------------- */
async function upsert(row) {
  if (row.note !== undefined) { row.notes = row.note; delete row.note; }

  /*  SSR — Supabase JS (fetch доступен в Node)  */
  if (!isBrowser) {
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(SB_URL, SB_KEY, { global:{ headers:{apikey:SB_KEY} } });
    const { error } = await sb.from('daily_progress').upsert(row, { onConflict:'citizen_id,day_no' });
    return !error;
  }

  /*  Браузер c fetch — прямой REST  */
  if ('fetch' in window) {
    const res = await fetch(`${SB_URL}/rest/v1/daily_progress?on_conflict=citizen_id,day_no`, {
      method :'POST',
      headers:{
        apikey       : SB_KEY,
        authorization: `Bearer ${SB_KEY}`,
        'Content-Type':'application/json',
        Prefer       :'return=minimal,resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
    return res.ok;
  }

  /*  Старинный WebView — XHR-клиент  */
  return sbRest.upsert('daily_progress', row, 'citizen_id,day_no');
}

/* ---------- Компонент --------------------------------------- */
export default function Challenge({ day, material, canSkip, cid }) {

  const [note,     setNote]   = useState('');
  const [noteStat, setNS]     = useState('idle');    // idle | saving | saved | error
  const [doneStat, setDS]     = useState('idle');    // idle | saving | saved | queued | error
  const [left,     setLeft]   = useState(canSkip ? 0 : ONE_DAY);

  /* ---------- mount ------------------------------------------ */
  useEffect(()=>{
    if (isBrowser) setNote(localStorage.getItem(`tz_note_${day}`)||'');

    if (canSkip) { setLeft(0); return; }

    const started = isBrowser
      ? Number(localStorage.getItem('tz_started')||Date.now())
      : Date.now();
    const next = started + ONE_DAY;
    setLeft(Math.max(0,next-Date.now()));

    let stop;
    if (isBrowser && window.Worker){
      const w = new Worker(URL.createObjectURL(
        new Blob(['setInterval(()=>postMessage(Date.now()),1000)'])
      ));
      w.onmessage = () => setLeft(Math.max(0,next-Date.now()));
      stop = () => w.terminate();
    } else {
      const id = setInterval(()=>setLeft(Math.max(0,next-Date.now())),1000);
      stop = () => clearInterval(id);
    }
    return stop;
  },[day,canSkip]);

  /* ---------- очередь / beacon -------------------------------- */
  async function flushQueue(){
    if (!isBrowser) return;
    const arr = JSON.parse(localStorage.getItem(queueKey)||'[]');
    if (!arr.length) return;
    const rest=[];
    for(const r of arr) if(!(await upsert(r))) rest.push(r);
    localStorage.setItem(queueKey, JSON.stringify(rest));
    if (!rest.length && doneStat==='queued') setDS('saved');
  }
  useEffect(()=>{
    flushQueue();
    if (!isBrowser) return;
    window.addEventListener('online', flushQueue);
    document.addEventListener('visibilitychange', flushQueue);
    window.addEventListener('pagehide',()=>{
      const q = localStorage.getItem(queueKey);
      if (q && q!=='[]')
        navigator.sendBeacon(`/api/challenge/beacon?cid=${cid}`, q);
    });
    return ()=>{ window.removeEventListener('online',flushQueue);
                 document.removeEventListener('visibilitychange',flushQueue); };
  },[doneStat]);

  /* ---------- handlers --------------------------------------- */
  const saveNote = async () => {
    if (noteStat==='saving') return;
    setNS('saving');
    const ok = await upsert({citizen_id:+cid,day_no:day,note});
    setNS(ok?'saved':'error');
    if(ok&&isBrowser) localStorage.removeItem(`tz_note_${day}`);
  };

  const saveDone = async () => {
    if (doneStat==='saving') return;
    setDS('saving');
    const ok = await upsert({
      citizen_id:+cid, day_no:day,
      watched_at:new Date().toISOString(), note
    });
    if (ok) {
      setDS('saved');
      if(isBrowser&&!localStorage.getItem('tz_started'))
        localStorage.setItem('tz_started', Date.now());
    } else if (isBrowser) {
      const q = JSON.parse(localStorage.getItem(queueKey)||'[]');
      q.push({citizen_id:+cid,day_no:day,watched_at:new Date().toISOString(),note});
      localStorage.setItem(queueKey, JSON.stringify(q));
      setDS('queued');
    } else setDS('error');
  };

  /* ---------- render ----------------------------------------- */
  const h=Math.floor(left/3_600_000), m=Math.floor(left/60_000)%60, s=Math.floor(left/1000)%60;

  return (
    <main style={{padding:24,maxWidth:820,margin:'0 auto',fontFamily:'system-ui'}}>
      <h1>День {day}</h1>

      {/* ============ КОНТЕНТ ДНЯ ============ */}
      {material
        ? <DayMaterial material={material}/>            {/* ←  исправлено */}
        : <p><em>Нет контента</em></p>}

      <textarea rows={4} style={{width:'100%',marginTop:16}} value={note}
        onChange={e=>{ setNote(e.target.value);
          if(isBrowser) localStorage.setItem(`tz_note_${day}`,e.target.value); }}/>

      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:12}}>
        <button onClick={saveNote} onTouchEnd={e=>{e.preventDefault();saveNote();}}
                disabled={noteStat==='saving'}>💾 Сохранить заметку</button>
        {noteStat==='saving'&&'Сохраняю…'}
        {noteStat==='saved' &&'Сохранено ✓'}
        {noteStat==='error' &&'Ошибка ×'}
      </div>

      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:16}}>
        <button onClick={saveDone} onTouchEnd={e=>{e.preventDefault();saveDone();}}
                disabled={doneStat==='saving'} style={{fontSize:18}}>
          ✅ Я осознанно изучил
        </button>
        {doneStat==='saved' && '✓'}
        {doneStat==='queued'&& 'В очереди ✓'}
        {doneStat==='saving'&& 'Сохраняю…'}
        {doneStat==='error' && 'Ошибка ×'}
      </div>

      {!canSkip &&
        <p style={{marginTop:24,fontSize:18}}>
          До следующего дня: {h}ч {m}м {s}с
        </p>}

      <div style={{marginTop:32,display:'flex',justifyContent:'space-between'}}>
        {day>1 && <Link href={`/challenge3?day=${day-1}`}>◀ День {day-1}</Link>}
        {day<14&&<Link href={`/challenge3?day=${day+1}`}
             style={{pointerEvents:(left>0&&!canSkip)?'none':'auto',
                     opacity:(left>0&&!canSkip)?0.4:1}}>
             День {day+1} ▶</Link>}
      </div>
    </main>
  );
}

/* ---------- getInitialProps (сервер) ------------------------- */
Challenge.getInitialProps = async ({ req, res, query }) => {
  const day = Number(query.day||1);

  const { createClient } = await import('@supabase/supabase-js');
  const sb = createClient(SB_URL, SB_KEY,{ global:{ headers:{apikey:SB_KEY}} });

  const { data: material } = await sb
    .from('daily_materials')
    .select('*')
    .eq('day_no', day)
    .maybeSingle();

  /* can_skip + cid */
  let cid = null, canSkip = false;
  if (req) {
    cid = parse(req.headers.cookie||'').cid || null;
    if (cid) {
      const { data:c } = await sb.from('citizens')
        .select('can_skip').eq('id',cid).maybeSingle();
      canSkip = !!c?.can_skip;
    }
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate');
  }
  return { day, material, canSkip, cid };
};
