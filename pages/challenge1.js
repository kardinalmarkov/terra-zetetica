// pages/challenge1.js – playground with 5×2 fallback strategies + UI buttons
// ========================================================================
// URL     : /challenge1?day=3
// Buttons : переключают варианты сохранения (A–E) и таймера (1–5)
// ------------------------------------------------------------------------
import { useEffect, useState, useCallback } from 'react';
import { getCid } from '../utils/localAuth';

// ---------- экспериментальные матрицы -----------------------------------
const SAVE_VARIANTS  = ['A', 'B', 'C', 'D', 'E'];
const TIMER_VARIANTS = ['1', '2', '3', '4', '5'];

export default function Challenge1({ queryDay, querySave, queryTimer }) {
  const [saveV,  setSaveV]  = useState(querySave);
  const [timerV, setTimerV] = useState(queryTimer);
  const [status, setStatus] = useState('idle'); // idle | saving | queued | saved | error
  const [countdown, setCountdown] = useState(0);

  // --- helpers -----------------------------------------------------------
  const reload = (k, v) => {
    const url = new URL(window.location.href);
    url.searchParams.set(k, v);
    window.location.href = url.toString();
  };

  // --- SAVE STRATEGIES ---------------------------------------------------
  const sendMark = useCallback(async () => {
    if (status === 'saving') return;
    setStatus('saving');

    const payload = { day: queryDay, note: '' };
    const attempt = async () => {
      try {
        const ok = await fetch('/api/challenge/mark', {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-cid'       : getCid()
          },
          body: JSON.stringify(payload)
        }).then(r => r.ok);
        return ok;
      } catch (_) { return false; }
    };

    switch (saveV) {
      // A: прямой запрос ----------------------------------------------------
      case 'A': {
        const ok = await attempt();
        setStatus(ok ? 'saved' : 'error');
        break;
      }
      // B: offline‑queue ---------------------------------------------------
      case 'B': {
        const queue = JSON.parse(localStorage.getItem('tz_pending') || '[]');
        queue.push(payload);
        localStorage.setItem('tz_pending', JSON.stringify(queue));
        setStatus('queued');
        break;
      }
      // C: sendBeacon ------------------------------------------------------
      case 'C': {
        const ok = navigator.sendBeacon && navigator.sendBeacon('/api/challenge/mark', JSON.stringify(payload));
        setStatus(ok ? 'saved' : 'error');
        break;
      }
      // D: idle‑callback + retry ------------------------------------------
      case 'D': {
        const retry = (n=0) => {
          if (n>3) { setStatus('error'); return; }
          requestIdleCallback(async () => {
            const ok = await attempt();
            ok ? setStatus('saved') : setTimeout(()=>retry(n+1), 2000);
          });
        };
        retry();
        break;
      }
      // E: Supabase client‑side upsert -------------------------------------
      case 'E': {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.from('daily_progress').upsert({
          citizen_id : Number(getCid()),
          day_no     : queryDay,
          watched_at : new Date().toISOString()
        }, { onConflict: 'citizen_id,day_no' });
        setStatus(error ? 'error' : 'saved');
        break;
      }
    }
  }, [saveV, status, queryDay]);

  // --- TIMER VARIANTS ----------------------------------------------------
  useEffect(() => {
    let stop;
    const target = Date.now() + 1000*60*60*24; // 24h demo
    const update = () => setCountdown(Math.max(0, target - Date.now()));

    switch (timerV) {
      case '1': stop = setInterval(update, 1000); break;
      case '2': (function raf(){ update(); stop=requestAnimationFrame(raf); })(); break;
      case '3': {
        const el = document.createElement('div');
        el.style.animation = 'tick 1s steps(1) infinite';
        el.addEventListener('animationiteration', update);
        document.body.appendChild(el);
        stop = () => { el.remove(); };
        break;
      }
      case '4': {
        const worker = new Worker(URL.createObjectURL(new Blob([`
          setInterval(()=>postMessage(Date.now()),1000);
        `])));
        worker.onmessage = update; stop = () => worker.terminate();
        break;
      }
      case '5': {
        const loop = () => { update(); stop=setTimeout(loop,800); }; loop();
        break;
      }
    }
    return () => stop && (typeof stop==='number'?clearInterval(stop):stop());
  }, [timerV]);

  // -----------------------------------------------------------------------
  return (
    <main style={{padding:20,fontFamily:'sans-serif'}}>
      <h1>День {queryDay}</h1>

      {/* ===== панель выбора вариантов ================================== */}
      <div style={{display:'flex',gap:16,marginBottom:24}}>
        {/* сохранялка */}
        <fieldset>
          <legend>Save variant</legend>
          {SAVE_VARIANTS.map(v=>
            <button key={v}
              disabled={v===saveV}
              style={{marginRight:4}}
              onClick={()=>reload('save',v)}>{v}</button>) }
        </fieldset>
        {/* таймер */}
        <fieldset>
          <legend>Timer variant</legend>
          {TIMER_VARIANTS.map(v=>
            <button key={v}
              disabled={v===timerV}
              style={{marginRight:4}}
              onClick={()=>reload('timer',v)}>{v}</button>) }
        </fieldset>
      </div>

      {/* ===== кнопка отметки ============================================ */}
      <button onClick={sendMark} disabled={status==='saving'} style={{fontSize:24,padding:'8px 20px'}}>
        ✅ Я осознанно изучил
      </button>
      <span style={{marginLeft:12}}>
        {status==='saving' && 'Saving…'}
        {status==='saved'  && 'Saved ✓'}
        {status==='queued' && 'Queued ✓'}
        {status==='error'  && 'Error ×'}
      </span>

      {/* ===== таймер ===================================================== */}
      <p style={{marginTop:24,fontSize:20}}>
        <strong>До следующего дня: </strong>
        {Math.floor(countdown/3600000)}ч {Math.floor(countdown/60000)%60}м {Math.floor(countdown/1000)%60}с
      </p>
    </main>
  );
}

// ------------------------------------------------------------------------
Challenge1.getInitialProps = ({ query }) => ({
  queryDay   : Number(query.day   || 1),
  querySave  : (query.save  || SAVE_VARIANTS[0]).toUpperCase(),
  queryTimer : (query.timer || TIMER_VARIANTS[0])
});