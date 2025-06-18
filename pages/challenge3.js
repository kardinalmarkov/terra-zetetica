// pages/challenge3.js  • исправлен вывод контента + навигация
//--------------------------------------------------------------
import { useEffect, useState } from 'react';
import Link           from 'next/link';
import DayMaterial    from '../components/DayMaterial';
import sbRest         from '../utils/sbRest';
import { parse }      from 'cookie';

const ONE_DAY  = 86_400_000;
const QUEUE    = 'tz_queue_v1';
const SB_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY   = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isBrw    = typeof window !== 'undefined';

/* ─── лёгкие полифиллы (старым WebView) ────────────────────── */
if (isBrw) {
  if (!('Promise' in window))        await import('es6-promise/auto');
  if (!Array.from)                   Array.from = obj => [].slice.call(obj);
}

/* ─── универсальный upsert (SSR=fetch, CSR=XHR) ────────────── */
async function upsert(row) {
  if (row.note !== undefined) { row.notes = row.note; delete row.note; }

  // ➟ сервер
  if (!isBrw) {
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(SB_URL, SB_KEY, { global:{ headers:{ apikey:SB_KEY }}});
    return !(await sb.from('daily_progress')
                     .upsert(row,{ onConflict:'citizen_id,day_no' })).error;
  }
  // ➟ современный браузер
  if ('fetch' in window) {
    const r = await fetch(
      `${SB_URL}/rest/v1/daily_progress?on_conflict=citizen_id,day_no`, {
        method :'POST',
        headers:{
          apikey        : SB_KEY,
          authorization : `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          Prefer        : 'return=minimal,resolution=merge-duplicates'
        },
        body: JSON.stringify(row)
      });
    return r.ok;
  }
  // ➟ древний WebView
  return sbRest.upsert('daily_progress', row, 'citizen_id,day_no');
}

/* ─── React-страница ───────────────────────────────────────── */
export default function Challenge({ day, material, canSkip, cid }) {

  const [note,     setNote] = useState('');
  const [nState,   setNS  ] = useState('idle');     // idle|saving|saved|error
  const [dState,   setDS  ] = useState('idle');     // idle|saving|saved|queued|error
  const [left,     setLft ] = useState(canSkip ? 0 : ONE_DAY);

  /* mount */
  useEffect(()=>{
    if (isBrw) setNote(localStorage.getItem(`tz_note_${day}`) || '');

    if (canSkip) return setLft(0);

    const started = isBrw
      ? +localStorage.getItem('tz_started') || Date.now()
      : Date.now();
    const next = started + ONE_DAY;
    setLft(Math.max(0, next - Date.now()));

    const id = setInterval(() =>
      setLft(l => Math.max(0, l - 1000)), 1000);
    return () => clearInterval(id);
  }, [day, canSkip]);

  /* offline-очередь */
  useEffect(()=>{
    const flush = async () => {
      const q = JSON.parse(localStorage.getItem(QUEUE) || '[]');
      if (!q.length) return;
      const rest=[];
      for (const r of q) if (!(await upsert(r))) rest.push(r);
      localStorage.setItem(QUEUE, JSON.stringify(rest));
      if (!rest.length && dState==='queued') setDS('saved');
    };
    if (isBrw) {
      flush();
      addEventListener('online',        flush);
      addEventListener('visibilitychange', flush);
      return () => {
        removeEventListener('online',        flush);
        removeEventListener('visibilitychange', flush);
      };
    }
  }, [dState]);

  /* handlers */
  const saveNote = async () => {
    if (nState==='saving') return;
    setNS('saving');
    const ok = await upsert({ citizen_id:+cid, day_no:day, note });
    setNS(ok ? 'saved' : 'error');
    if (ok && isBrw) localStorage.removeItem(`tz_note_${day}`);
  };

  const saveDone = async () => {
    if (dState==='saving') return;
    setDS('saving');
    const row = { citizen_id:+cid, day_no:day,
                  watched_at:new Date().toISOString(), note };
    const ok  = await upsert(row);
    if (ok) {
      setDS('saved');
      if (isBrw && !localStorage.getItem('tz_started'))
        localStorage.setItem('tz_started', Date.now());
    } else if (isBrw) {
      const q = JSON.parse(localStorage.getItem(QUEUE)||'[]');
      q.push(row); localStorage.setItem(QUEUE, JSON.stringify(q));
      setDS('queued');
    } else setDS('error');
  };

  /* view */
  const h=Math.floor(left/3.6e6),
        m=Math.floor(left/6e4)%60,
        s=Math.floor(left/1e3)%60;

  return (
    <main style={{maxWidth:820,margin:'0 auto',padding:24,fontFamily:'system-ui'}}>
      <h1>День {day}</h1>

      {/* ---- КОНТЕНТ ДНЯ ---- */}
      {material
        ? <DayMaterial material={material}/>   {/* ← фикс: prop = material */}
        : <p><em>Нет контента</em></p>}

      <textarea rows={4} style={{width:'100%',marginTop:16}}
        value={note}
        onChange={e=>{
          setNote(e.target.value);
          if (isBrw) localStorage.setItem(`tz_note_${day}`,e.target.value);
        }}/>

      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:12}}>
        <button disabled={nState==='saving'}
                onClick={saveNote}
                onTouchEnd={e=>{e.preventDefault();saveNote();}}>
          💾 Сохранить заметку
        </button>
        {nState==='saving' && 'Сохраняю…'}
        {nState==='saved'  && 'Сохранено ✓'}
        {nState==='error'  && 'Ошибка ×'}
      </div>

      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:16}}>
        <button disabled={dState==='saving'}
                style={{fontSize:18}}
                onClick={saveDone}
                onTouchEnd={e=>{e.preventDefault();saveDone();}}>
          ✅ Я осознанно изучил
        </button>
        {dState==='saved'  && '✓'}
        {dState==='queued' && 'В очереди ✓'}
        {dState==='saving' && 'Сохраняю…'}
        {dState==='error'  && 'Ошибка ×'}
      </div>

      {!canSkip && (
        <p style={{marginTop:24,fontSize:18}}>
          До следующего дня: {h}ч {m}м {s}с
        </p>
      )}

      {/* навигация: теперь всегда «серая» ссылка, но кликабельна,
         если материал отмечен как пройден */}
      <nav style={{marginTop:32,display:'flex',justifyContent:'space-between'}}>
        {day>1 &&
          <Link href={`/challenge3?day=${day-1}`}>◀ День {day-1}</Link>}
        {day<14 &&
          <Link href={`/challenge3?day=${day+1}`}
                style={{
                  opacity: (left>0 && !canSkip && dState!=='saved') ? 0.4 : 1
                }}>
            День {day+1} ▶
          </Link>}
      </nav>
    </main>
  );
}

/* ─── getInitialProps (SSR) ─────────────────────────────────── */
Challenge.getInitialProps = async ({ req,res,query }) => {
  const day = +query.day || 1;
  const { createClient } = await import('@supabase/supabase-js');
  const sb = createClient(SB_URL, SB_KEY,{ global:{ headers:{apikey:SB_KEY}} });

  const { data:material } = await sb
    .from('daily_materials').select('*').eq('day_no',day).maybeSingle();

  let cid=null, canSkip=false;
  if (req){
    cid=parse(req.headers.cookie||'').cid||null;
    if (cid){
      const { data:c } = await sb.from('citizens')
        .select('can_skip').eq('id',cid).maybeSingle();
      canSkip=!!c?.can_skip;
    }
    res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate');
  }
  return { day, material, canSkip, cid };
};
