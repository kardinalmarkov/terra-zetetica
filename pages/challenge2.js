// pages/challenge2.js
// ================================================================
//  • URL: /challenge2?day=N     (N от 1 до 14)
//  • Markdown через react-markdown
//  • Сохранение:
//       1) Supabase SDK upsert  → статус «Сохранено ✓»
//       2) если ошибка/оффлайн → кладём в очередь LS  → «В очереди ✓»
//       3) sendBeacon отправит очередь при закрытии вкладки
//  • Таймер 24 ч – Web-Worker, fallback setInterval
//-----------------------------------------------------------------

import { useEffect, useState }   from 'react';
import { supabase }              from '../lib/supabase';
import { getCid }                from '../utils/localAuth';
import ReactMarkdown             from 'react-markdown';
import Link                      from 'next/link';

const ONE_DAY  = 86_400_000;
const queueKey = 'tz_queue_v1';

export default function Challenge({ day, material }) {
  /* ---------------- state --------------------------------------- */
  const [note, setNote]         = useState('');
  const [noteStatus, setNStat]  = useState('idle');    // idle | saving | saved | error
  const [doneStatus, setDStat]  = useState('idle');    // idle | saving | saved | queued | error
  const [left, setLeft]         = useState(0);

  /* ---------------- helpers ------------------------------------- */
  async function upsert(payload) {
    // Переименовываем поле note → notes, чтобы совпало со схемой
    if (payload.note !== undefined) {
      payload.notes = payload.note;
      delete payload.note;
    }
    const { error } = await supabase
      .from('daily_progress')
      .upsert(payload, { onConflict: 'citizen_id,day_no' });
    return !error;
  }

  async function flushQueue() {
    const arr = JSON.parse(localStorage.getItem(queueKey) || '[]');
    if (!arr.length) return;
    const rest = [];
    for (const p of arr) if (!(await upsert(p))) rest.push(p);
    localStorage.setItem(queueKey, JSON.stringify(rest));
    if (!rest.length && doneStatus === 'queued') setDStat('saved');
  }

  /* ---------------- initial load ------------------------------- */
  useEffect(() => {
    // 1) подгружаем черновик заметки
    setNote(localStorage.getItem(`tz_note_${day}`) || '');

    // 2) считаем остаток времени до следующего дня
    const started = Number(localStorage.getItem('tz_started') || Date.now());
    const next    = started + ONE_DAY;
    setLeft(Math.max(0, next - Date.now()));

    // 3) запускаем таймер (Web Worker если доступен)
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

  /* ---------------- queue listeners ----------------------------- */
  useEffect(() => {
    flushQueue();
    window.addEventListener('online', flushQueue);
    document.addEventListener('visibilitychange', flushQueue);
    window.addEventListener('pagehide', () => {
      const q = localStorage.getItem(queueKey);
      if (!q || q === '[]') return;
      navigator.sendBeacon(`/api/challenge/beacon?cid=${getCid()}`, q);
    });
    return () => {
      window.removeEventListener('online', flushQueue);
      document.removeEventListener('visibilitychange', flushQueue);
    };
  }, [doneStatus]);

  /* ---------------- handlers ------------------------------------ */
  const handleSaveNote = async () => {
    if (noteStatus === 'saving') return;
    setNStat('saving');
    const ok = await upsert({
      citizen_id : Number(getCid()),
      day_no     : day,
      note
    });
    setNStat(ok ? 'saved' : 'error');
    if (ok) localStorage.removeItem(`tz_note_${day}`);
  };

  const handleDone = async () => {
    if (doneStatus === 'saving') return;
    setDStat('saving');

    const payload = {
      citizen_id : Number(getCid()),
      day_no     : day,
      watched_at : new Date().toISOString(),
      note
    };
    const ok = await upsert(payload);

    if (ok) {
      setDStat('saved');
      if (!localStorage.getItem('tz_started'))
        localStorage.setItem('tz_started', Date.now());
    } else {
      // кладём в очередь (оффлайн или любая другая ошибка)
      const q = JSON.parse(localStorage.getItem(queueKey) || '[]');
      q.push(payload);
      localStorage.setItem(queueKey, JSON.stringify(q));
      setDStat('queued');
    }
  };

  /* ---------------- render -------------------------------------- */
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor(left / 60_000) % 60;
  const s = Math.floor(left / 1000) % 60;

  return (
    <main style={{padding:24,fontFamily:'system-ui'}}>
      <h1>День {day}</h1>

      <ReactMarkdown>{material || '*Нет контента*'}</ReactMarkdown>

      <textarea
        value={note}
        onChange={e=>{
          setNote(e.target.value);
          localStorage.setItem(`tz_note_${day}`, e.target.value);
        }}
        rows={4}
        style={{width:'100%',marginTop:16}}
      />

      {/* -------- кнопка заметки -------- */}
      <div style={{marginTop:12,display:'flex',gap:12,alignItems:'center'}}>
        <button onClick={handleSaveNote} disabled={noteStatus==='saving'}>
          💾 Сохранить заметку
        </button>
        <span>
          {noteStatus==='saving' && 'Сохраняю…'}
          {noteStatus==='saved'  && 'Сохранено ✓'}
          {noteStatus==='error'  && 'Ошибка ×'}
        </span>
      </div>

      {/* -------- кнопка завершения дня -------- */}
      <div style={{marginTop:16,display:'flex',gap:12,alignItems:'center'}}>
        <button
          onClick={handleDone}
          disabled={doneStatus==='saving'}
          style={{fontSize:18}}
        >
          ✅ Я осознанно изучил
        </button>
        <span>
          {doneStatus==='saving' && 'Сохраняю…'}
          {doneStatus==='saved'  && 'Сохранено ✓'}
          {doneStatus==='queued' && 'В очереди ✓'}
          {doneStatus==='error'  && 'Ошибка ×'}
        </span>
      </div>

      {/* -------- таймер -------- */}
      <p style={{marginTop:24,fontSize:18}}>
        {left > 0
          ? `До следующего дня: ${h}ч ${m}м ${s}с`
          : day < 14
            ? '✅ Можно переходить к следующему дню.'
            : '🎉 Челлендж завершён!'}
      </p>

      {left <= 0 && day < 14 &&
        <Link href={`/challenge2?day=${day+1}`}>
          ⏭ Перейти к дню {day+1}
        </Link>}
    </main>
  );
}

/* ---------- getInitialProps ------------------------------------ */
Challenge.getInitialProps = async ({ query, res }) => {
  const day = Number(query.day || 1);
  const { data } = await supabase
    .from('daily_materials')
    .select('content_md')
    .eq('day_no', day)
    .single();

  if (res) res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate');
  return { day, material: data?.content_md || '' };
};
