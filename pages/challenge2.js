// pages/challenge2.js  · Markdown через react-markdown, без remark
// ================================================================
import { useEffect, useState, useRef } from 'react';
import { supabase }                   from '../lib/supabase';
import { getCid }                     from '../utils/localAuth';
import ReactMarkdown                  from 'react-markdown';
import Link                           from 'next/link';

const ONE_DAY  = 86_400_000;
const queueKey = 'tz_queue_v1';

export default function Challenge2({ day, materialMd }) {
  /* --- state -------------------------------------------------------- */
  const [note, setNote]         = useState('');
  const [doneStatus, setDone]   = useState('idle');  // idle | saving | queued | saved | error
  const [noteStatus, setNStat]  = useState('idle');  // для кнопки 💾
  const [left, setLeft]         = useState(0);
  const redirectRef             = useRef(null);

  /* --- init: note + timer ------------------------------------------ */
  useEffect(() => {
    setNote(localStorage.getItem(`tz_note_${day}`) || '');

    const started = Number(localStorage.getItem('tz_started') || Date.now());
    const next    = started + ONE_DAY;
    setLeft(Math.max(0, next - Date.now()));

    /* Web-Worker-таймер (fallback setInterval) */
    let stop;
    if (window.Worker) {
      const w = new Worker(URL.createObjectURL(
        new Blob([`setInterval(()=>postMessage(Date.now()),1000)`])
      ));
      w.onmessage = () => setLeft(Math.max(0, next - Date.now()));
      stop = () => w.terminate();
    } else {
      const id = setInterval(() => setLeft(Math.max(0, next - Date.now())), 1000);
      stop = () => clearInterval(id);
    }
    return stop;
  }, [day]);

  /* --- helpers ------------------------------------------------------ */
  async function upsert(payload) {
    const { error } = await supabase
      .from('daily_progress')
      .upsert(payload, { onConflict:'citizen_id,day_no' });
    return !error;
  }
  async function flushQueue() {
    const q = JSON.parse(localStorage.getItem(queueKey) || '[]');
    if (!q.length) return;
    const rest=[];
    for (const p of q) if (!(await upsert(p))) rest.push(p);
    localStorage.setItem(queueKey, JSON.stringify(rest));
    if (!rest.length && doneStatus==='queued') setDone('saved');
  }
  /* queue flush hooks */
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

  /* --- handlers ----------------------------------------------------- */
  const saveNote = async () => {
    if (noteStatus==='saving') return;
    setNStat('saving');
    const ok = await upsert({
      citizen_id : Number(getCid()),
      day_no     : day,
      note       : note.trim()
    });
    setNStat(ok ? 'saved' : 'error');
  };

  const saveDone = async () => {
    if (doneStatus==='saving') return;
    setDone('saving');
    const payload = {
      citizen_id : Number(getCid()),
      day_no     : day,
      watched_at : new Date().toISOString(),
      note       : note.trim()
    };
    const ok = await upsert(payload);
    if (ok) {
      setDone('saved');
      if (!localStorage.getItem('tz_started'))
        localStorage.setItem('tz_started', Date.now());
    } else {
      const q = JSON.parse(localStorage.getItem(queueKey) || '[]');
      q.push(payload);
      localStorage.setItem(queueKey, JSON.stringify(q));
      setDone('queued');
    }
  };

  const h=Math.floor(left/3_600_000), m=Math.floor(left/60_000)%60, s=Math.floor(left/1000)%60;

  /* --- auto-redirect ------------------------------------------------ */
  useEffect(() => {
    if (left>0 || day===14) return;
    if (redirectRef.current) return;
    redirectRef.current = setTimeout(()=>location.href=`/challenge2?day=${day+1}`,5000);
  }, [left, day]);

  /* --- render ------------------------------------------------------- */
  return (
    <main style={{padding:20,fontFamily:'system-ui'}}>
      <h1>День {day}</h1>

      <ReactMarkdown>{materialMd||'*Нет контента*'}</ReactMarkdown>

      <textarea
        value={note}
        onChange={e=>{setNote(e.target.value); localStorage.setItem(`tz_note_${day}`,e.target.value)}}
        rows={4} style={{width:'100%',marginTop:16}}
      />

      <div style={{marginTop:12,display:'flex',gap:12,alignItems:'center'}}>
        <button onClick={saveNote} disabled={noteStatus==='saving'}>💾 Сохранить заметку</button>
        <span>
          {noteStatus==='saving' && 'Сохраняю…'}
          {noteStatus==='saved'  && 'Сохранено ✓'}
          {noteStatus==='error'  && 'Ошибка ×'}
        </span>
      </div>

      <div style={{marginTop:16,display:'flex',gap:12,alignItems:'center'}}>
        <button onClick={saveDone} disabled={doneStatus==='saving'} style={{fontSize:18}}>
          ✅ Я осознанно изучил
        </button>
        <span>
          {doneStatus==='saving' && 'Сохраняю…'}
          {doneStatus==='saved'  && 'Сохранено ✓'}
          {doneStatus==='queued' && 'В очереди ✓'}
          {doneStatus==='error'  && 'Ошибка ×'}
        </span>
      </div>

      <p style={{marginTop:24,fontSize:18}}>
        {left>0
          ? `До следующего дня: ${h}ч ${m}м ${s}с`
          : day<14
            ? '✅ Время вышло — можно переходить к следующему дню.'
            : '🎉 Челлендж завершён!'}
      </p>
      {left<=0 && day<14 &&
        <Link href={`/challenge2?day=${day+1}`}><a style={{fontSize:20}}>⏭ Перейти к дню {day+1}</a></Link>}
    </main>
  );
}

/* ---------- SSR: контент дня --------------------------------------- */
Challenge2.getInitialProps = async ({ query, res }) => {
  const day = Number(query.day || 1);
  const { data } = await supabase
    .from('daily_materials')
    .select('content_md')
    .eq('day_no', day)
    .single();
  if (res) res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate');
  return { day, materialMd: data?.content_md || '' };
};
