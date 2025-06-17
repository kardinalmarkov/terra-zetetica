// pages/challenge2.js  — full‑featured page with DayMaterial, can_skip support
// ========================================================================
//  * URL           : /challenge2?day=N   (N 1‑14, default 1)
//  * Markdown      : rendered via <DayMaterial> (title, subtitle, media, links …)
//  * Save flow     : SDK‑upsert  → queue  → sendBeacon
//  * Timer         : WebWorker (fallback setInterval) • hidden if can_skip
//  * Navigation    : «◀ предыдущий / ▶ следующий» + автовыделение если unlocked
//--------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { supabase }           from '../lib/supabase';
import { getCid }             from '../utils/localAuth';
import DayMaterial            from '../components/DayMaterial';
import Link                   from 'next/link';
import { parse }              from 'cookie';

const ONE_DAY  = 86_400_000;
const queueKey = 'tz_queue_v1';

export default function Challenge({ day, material, canSkip }) {
  const [note, setNote]         = useState('');
  const [noteStat, setNStat]    = useState('idle');  // idle | saving | saved | error
  const [doneStat, setDStat]    = useState('idle');  // idle | saving | saved | queued | error
  const [left, setLeft]         = useState(canSkip ? 0 : ONE_DAY);

  /* --- helpers ---------------------------------------------------- */
  async function upsert(row) {
    if (row.note !== undefined) { row.notes = row.note; delete row.note; }
    const { error } = await supabase
      .from('daily_progress')
      .upsert(row, { onConflict:'citizen_id,day_no' });
    return !error;
  }
  const flushQueue = async () => {
    const q = JSON.parse(localStorage.getItem(queueKey)||'[]');
    if (!q.length) return;
    const rest=[];
    for (const r of q) if(!await upsert(r)) rest.push(r);
    localStorage.setItem(queueKey, JSON.stringify(rest));
    if (!rest.length && doneStat==='queued') setDStat('saved');
  };

  /* --- init ------------------------------------------------------- */
  useEffect(()=>{
    setNote(localStorage.getItem(`tz_note_${day}`)||'');
    if (canSkip) { setLeft(0); return; }
    const started = Number(localStorage.getItem('tz_started')||Date.now());
    const next    = started + ONE_DAY;
    setLeft(Math.max(0, next-Date.now()));
    let stop;
    if (window.Worker) {
      const w=new Worker(URL.createObjectURL(new Blob([`setInterval(()=>postMessage(Date.now()),1000);`] )));
      w.onmessage=()=>setLeft(Math.max(0,next-Date.now()));
      stop=()=>w.terminate();
    } else {
      const id=setInterval(()=>setLeft(Math.max(0,next-Date.now())),1000);
      stop=()=>clearInterval(id);
    }
    return stop;
  },[day,canSkip]);

  /* --- queue listeners ------------------------------------------- */
  useEffect(()=>{
    flushQueue();
    window.addEventListener('online', flushQueue);
    document.addEventListener('visibilitychange', flushQueue);
    window.addEventListener('pagehide', ()=>{
      const q=localStorage.getItem(queueKey); if(!q||q==='[]')return;
      navigator.sendBeacon(`/api/challenge/beacon?cid=${getCid()}`, q);
    });
    return ()=>{
      window.removeEventListener('online',flushQueue);
      document.removeEventListener('visibilitychange',flushQueue);
    };
  },[doneStat]);

  /* --- handlers --------------------------------------------------- */
  const saveNote=async()=>{
    if(noteStat==='saving')return;
    setNStat('saving');
    const ok=await upsert({citizen_id:+getCid(),day_no:day,note});
    setNStat(ok?'saved':'error');
    if(ok) localStorage.removeItem(`tz_note_${day}`);
  };
  const saveDone=async()=>{
    if(doneStat==='saving')return;
    setDStat('saving');
    const row={citizen_id:+getCid(),day_no:day,watched_at:new Date().toISOString(),note};
    const ok=await upsert(row);
    if(ok){
      setDStat('saved');
      if(!localStorage.getItem('tz_started')) localStorage.setItem('tz_started', Date.now());
    }else{
      const q=JSON.parse(localStorage.getItem(queueKey)||'[]');q.push(row);
      localStorage.setItem(queueKey,JSON.stringify(q));
      setDStat('queued');
    }
  };

  /* --- render ----------------------------------------------------- */
  const h=Math.floor(left/3_600_000),m=Math.floor(left/60_000)%60,s=Math.floor(left/1000)%60;
  return (
    <main style={{padding:24,maxWidth:800,margin:'0 auto',fontFamily:'system-ui'}}>
      <h1>День {day}</h1>
      {material ? <DayMaterial day={day} data={material}/> : <p><em>Нет контента</em></p>}

      <textarea rows={4} style={{width:'100%',marginTop:16}}
        value={note}
        onChange={e=>{setNote(e.target.value);localStorage.setItem(`tz_note_${day}`,e.target.value);}}
      />

      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:12}}>
        <button onClick={saveNote} disabled={noteStat==='saving'}>💾 Сохранить заметку</button>
        {noteStat==='saving' && 'Сохраняю…'}
        {noteStat==='saved'  && 'Сохранено ✓'}
        {noteStat==='error'  && 'Ошибка ×'}
      </div>

      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:16}}>
        <button onClick={saveDone} disabled={doneStat==='saving'} style={{fontSize:18}}>✅ Я осознанно изучил</button>
        {doneStat==='saved'  && '✓'}
        {doneStat==='queued' && 'В очереди ✓'}
        {doneStat==='saving' && 'Сохраняю…'}
        {doneStat==='error'  && 'Ошибка ×'}
      </div>

      {!canSkip && <p style={{marginTop:24,fontSize:18}}>До следующего дня: {h}ч {m}м {s}с</p>}

      {/* Навигация по дням */}
      <div style={{marginTop:32,display:'flex',justifyContent:'space-between'}}>
        {day>1  && <Link href={`/challenge2?day=${day-1}`}>◀ День {day-1}</Link>}
        {day<14 && (left===0||canSkip) && <Link href={`/challenge2?day=${day+1}`}>День {day+1} ▶</Link>}
      </div>
    </main>
  );
}

/* ------------------------- getInitialProps --------------------- */
Challenge.getInitialProps=async({req,res,query})=>{
  const day=Number(query.day||1);
  // 1) контент дня
  const { data:mat }=await supabase.from('daily_materials')
    .select('*')
    .eq('day_no',day)
    .single();

  // 2) can_skip из citizens (по cookie cid)
  let canSkip=false;
  if(req){
    const cid=parse(req.headers.cookie||'').cid;
    if(cid){
      const { data:c }=await supabase.from('citizens').select('can_skip').eq('id',cid).single();
      canSkip=!!c?.can_skip;
    }
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate');
  }
  return { day, material:mat||null, canSkip };
};
