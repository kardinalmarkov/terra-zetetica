// pages/challenge2.js — финальная версия без remark, с ReactMarkdown
// ====================================================================
//  • URL: /challenge2?day=3   (если ?day нет → 1)
//  • Стратегия сохранения: SDK‑upsert (E) → очередь (B) → sendBeacon (C)
//  • Таймер: Web‑Worker (fallback setInterval)
// --------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import { useRouter }                       from 'next/router';
import ReactMarkdown                       from 'react-markdown';
import { supabase }                        from '../lib/supabase';
import { getCid }                          from '../utils/localAuth';

// localStorage keys
const QKEY = 'tz_queue_v1';          // array of payloads
const NOTE_KEY = d => `tz_note_${d}`;

export default function Challenge2({ day, mat }) {
  const router         = useRouter();
  const [note, setNote]   = useState('');
  const [status, setStatus] = useState('idle'); // idle | saving | queued | saved | error
  const [left, setLeft]     = useState(mat.leftMs);

  /* --- load draft note ------------------------------------------------ */
  useEffect(()=>{
    setNote(localStorage.getItem(NOTE_KEY(day))||'');
  },[day]);

  /* --- save progress -------------------------------------------------- */
  const payload = useCallback(() => ({
    citizen_id : Number(getCid()),
    day_no     : day,
    watched_at : new Date().toISOString(),
    note
  }), [day,note]);

  const upsert = async p => {
    const { error } = await supabase
      .from('daily_progress')
      .upsert(p, { onConflict:'citizen_id,day_no' });
    return !error;
  };

  const flushQueue = async () => {
    const q = JSON.parse(localStorage.getItem(QKEY)||'[]');
    if(!q.length) return;
    const rest = [];
    for(const p of q) if(!(await upsert(p))) rest.push(p);
    localStorage.setItem(QKEY, JSON.stringify(rest));
    if(!rest.length && status==='queued') setStatus('saved');
  };

  const beaconFlush = () => {
    const q = localStorage.getItem(QKEY);
    if(!q || q==='[]') return;
    navigator.sendBeacon(`/api/challenge/beacon?cid=${getCid()}`, q);
  };

  const handleClick = async () => {
    if(status==='saving') return;
    setStatus('saving');
    localStorage.setItem(NOTE_KEY(day), note);
    const ok = await upsert(payload());
    if(ok){
      localStorage.removeItem(NOTE_KEY(day));
      setStatus('saved');
    }else{
      const q = JSON.parse(localStorage.getItem(QKEY)||'[]');
      q.push(payload());
      localStorage.setItem(QKEY, JSON.stringify(q));
      setStatus('queued');
    }
  };

  /* --- timer (worker + redirect) ------------------------------------- */
  useEffect(()=>{
    flushQueue();
    window.addEventListener('online', flushQueue);
    document.addEventListener('visibilitychange', flushQueue);
    window.addEventListener('pagehide', beaconFlush);

    const target = Date.now() + left;
    let stop;
    if(window.Worker){
      const blob = new Blob([`setInterval(()=>postMessage(Date.now()),1000);`]);
      const w = new Worker(URL.createObjectURL(blob));
      w.onmessage = () => {
        const ms = Math.max(0, target-Date.now());
        setLeft(ms);
        if(ms<=0){
          w.terminate();
          if(day<14) router.replace(`/challenge2?day=${day+1}`);
        }
      };
      stop = () => w.terminate();
    }else{
      const id = setInterval(()=>{
        const ms = Math.max(0, target-Date.now());
        setLeft(ms);
        if(ms<=0){
          clearInterval(id);
          if(day<14) router.replace(`/challenge2?day=${day+1}`);
        }
      },1000);
      stop = () => clearInterval(id);
    }
    return () => {
      stop();
      window.removeEventListener('online', flushQueue);
      document.removeEventListener('visibilitychange', flushQueue);
      window.removeEventListener('pagehide', beaconFlush);
    };
  }, [day]);

  const h = String(Math.floor(left/3_600_000)).padStart(2,'0');
  const m = String(Math.floor(left/60_000)%60).padStart(2,'0');
  const s = String(Math.floor(left/1000)%60).padStart(2,'0');

  return (
    <main style={{padding:'1.5rem',fontFamily:'sans-serif',maxWidth:700,margin:'0 auto'}}>
      <h1>День {day}: {mat.title}</h1>

      <ReactMarkdown>{mat.content_md||'_'}</ReactMarkdown>

      <textarea style={{width:'100%',minHeight:120,marginTop:20}}
                placeholder="Ваши заметки..."
                value={note}
                onChange={e=>setNote(e.target.value)} />

      <button style={{fontSize:20,padding:'6px 16px',marginTop:10}}
              onClick={handleClick} disabled={status==='saving'}>
        ✅ Я осознанно изучил
      </button>
      <span style={{marginLeft:12}}>
        {status==='saving' && 'Saving…'}
        {status==='saved'  && 'Saved ✓'}
        {status==='queued' && 'Queued ✓'}
        {status==='error'  && 'Error ×'}
      </span>

      <p style={{marginTop:24,fontSize:18}}>До следующего дня: {h}:{m}:{s}</p>
    </main>
  );
}

/* ----------------------- getServerSideProps --------------------------- */
export async function getServerSideProps({ query }){
  const day = Math.max(1, Math.min(14, Number(query.day)||1));
  // fetch material
  const { data, error } = await supabase
      .from('daily_materials')
      .select('title, content_md')
      .eq('day_no', day)
      .single();
  const now = Date.now();
  const leftMs = 86_400_000; // 24h — клиент скорректирует
  return {
    props:{ day, mat:{...data, leftMs} }
  };
}
