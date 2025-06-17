// pages/challenge2.js — production‑ready 14‑day page (save‑E + offline‑B + beacon‑C)
// =============================================================================
// • day param   : /challenge2?day=3  (defaults to 1)
// • Displays    : material, textarea note, progress bar, live timer
// • Flow        :   1) user clicks ✅  → SDK upsert (E)
//                   2) if fail        → push to LS queue (B)
//                   3) on pagehide    → navigator.sendBeacon (C) if queue empty
// • After 24 h  : shows «⏭ Перейти к дню N+1» (auto‑redirect after 5 s)
// -----------------------------------------------------------------------------

import { useEffect, useState, useRef } from 'react';
import { supabase }                   from '../lib/supabase';
import { getCid }                     from '../utils/localAuth';
import Link                           from 'next/link';

const ONE_DAY = 86_400_000;
const queueKey = 'tz_queue_v1';

export default function Challenge2({ day, material }) {
  const [note, setNote]       = useState('');
  const [status, setStatus]   = useState('idle'); // idle | saving | queued | saved | error
  const [left, setLeft]       = useState(0);
  const redirectRef           = useRef();

  /* ---------- init: load LS note + timer ----------------------------- */
  useEffect(() => {
    setNote(localStorage.getItem(`tz_note_${day}`) || '');

    const started = localStorage.getItem('tz_started')
                    || (Date.now() - 90_000); // fallback – allow click if unknown
    const next    = Number(started) + ONE_DAY;
    setLeft(Math.max(0, next - Date.now()));

    /* worker timer 4 */
    let stop;
    if (window.Worker) {
      const w = new Worker(URL.createObjectURL(new Blob([`setInterval(()=>postMessage(Date.now()),1000);`])))
      w.onmessage = () => setLeft(Math.max(0, next - Date.now()));
      stop = () => w.terminate();
    } else {
      const id = setInterval(() => setLeft(Math.max(0, next - Date.now())), 1000);
      stop = () => clearInterval(id);
    }
    return stop;
  }, [day]);

  /* ---------- queue flush & beacon ---------------------------------- */
  async function upsert(dp) {
    const { error } = await supabase
      .from('daily_progress')
      .upsert(dp, { onConflict: 'citizen_id,day_no' });
    return !error;
  }

  async function flushQueue() {
    const q = JSON.parse(localStorage.getItem(queueKey) || '[]');
    if (!q.length) return;
    const rest=[];
    for (const p of q) if (!(await upsert(p))) rest.push(p);
    localStorage.setItem(queueKey, JSON.stringify(rest));
    if (!rest.length) setStatus('saved');
  }
  /* call on mount + events */
  useEffect(() => {
    flushQueue();
    window.addEventListener('online', flushQueue);
    document.addEventListener('visibilitychange', flushQueue);
    window.addEventListener('pagehide', () => {
      const q = localStorage.getItem(queueKey);
      if (!q || q==='[]') return;
      navigator.sendBeacon(`/api/challenge/beacon?cid=${getCid()}`, q);
    });
    return () => {
      window.removeEventListener('online', flushQueue);
      document.removeEventListener('visibilitychange', flushQueue);
    };
  }, []);

  /* ---------- handlers ---------------------------------------------- */
  const handleSave = async () => {
    if (status==='saving') return;
    setStatus('saving');
    const payload = {
      citizen_id : Number(getCid()),
      day_no     : day,
      watched_at : new Date().toISOString(),
      note       : note.trim()
    };
    const ok = await upsert(payload);
    if (ok) {
      setStatus('saved');
      /* persist started timestamp once */
      if (!localStorage.getItem('tz_started'))
        localStorage.setItem('tz_started', Date.now());
    } else {
      /* queue */
      const q = JSON.parse(localStorage.getItem(queueKey) || '[]');
      q.push(payload);
      localStorage.setItem(queueKey, JSON.stringify(q));
      setStatus('queued');
    }
  };

  const handleNoteChange = e => {
    setNote(e.target.value);
    localStorage.setItem(`tz_note_${day}`, e.target.value);
  };

  /* ---------- auto‑redirect when timer finished --------------------- */
  useEffect(() => {
    if (left>0) return;
    if (redirectRef.current) return; // already scheduled
    redirectRef.current = setTimeout(() => {
      const nextDay = Math.min(day+1,14);
      location.href=`/challenge2?day=${nextDay}`;
    }, 5000);
  }, [left]);

  /* ---------- render ------------------------------------------------- */
  const h=Math.floor(left/3_600_000), m=Math.floor(left/60_000)%60, s=Math.floor(left/1000)%60;

  return (
    <main style={{padding:20,fontFamily:'system-ui'}}>
      <h1>День {day}</h1>
      <article dangerouslySetInnerHTML={{__html:material}} />

      <textarea value={note} onChange={handleNoteChange} rows={4} style={{width:'100%',marginTop:16}}/>

      <button onClick={handleSave} disabled={status==='saving'} style={{fontSize:20,marginTop:12}}>
        ✅ Я осознанно изучил
      </button>
      <span style={{marginLeft:12}}>
        {status==='saving' && 'Saving…'}
        {status==='saved'  && 'Saved ✓'}
        {status==='queued' && 'Queued ✓'}
        {status==='error'  && 'Error ×'}
      </span>

      <p style={{marginTop:24,fontSize:18}}>
        {left>0 ? `До следующего дня: ${h}ч ${m}м ${s}с` : '✅ Время вышло – можно переходить к следующему дню.'}
      </p>
      {left<=0 && day<14 && (
        <Link href={`/challenge2?day=${day+1}`}><a style={{fontSize:20}}>⏭ Перейти к дню {day+1}</a></Link>
      )}
    </main>
  );
}

/* SSR – материал дня --------------------------------------------------- */
Challenge2.getInitialProps = async ({ query, res }) => {
  const day = Number(query.day || 1);
  // !! серверный fetch Supabase через anon, можно ускорить getStaticProps later
  const { data, error } = await supabase
    .from('daily_materials')
    .select('content_md')
    .eq('day_no', day)
    .single();
  if (res) res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate');
  return {
    day,
    material: data?.content_md ? markdownToHtml(data.content_md) : '<p>No content</p>'
  };
};

/* util markdown → html (simple) */
import { remark } from 'remark';
import html from 'remark-html';
async function markdownToHtml(md){
  const r=await remark().use(html).process(md||'');
  return r.toString();
}
