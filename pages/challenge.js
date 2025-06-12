// pages/challenge.js   —  v2.6  (13 Jun 2025)
/*
  ▸ FIX #1  – если material == null → мягкий редирект в /lk?tab=progress
  ▸ FIX #2  – dynamic import canvas-confetti (избегаем SSR проблем)
  ▸ FIX #3  – “Следующий день … 0 ч 0 мин” больше не рисуется,
              когда день уже открыт (left === 0 мы не показываем)
  ▸ UX      – кнопка «💾 Сохранить заметку» активна всегда, даже
              при непустой заметке (обновление мысли)
*/

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/router';
import Head                    from 'next/head';
import DayMaterial             from '../components/DayMaterial';
import useMe                   from '../utils/useMe';

/* ─────────────────────────────────────────── */
/*                 SSR-часть                   */
/* ─────────────────────────────────────────── */
export async function getServerSideProps ({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '');

  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } };

  const day = Math.min(Math.max(+query.day || 1, 1), 14);
  const { supabase } = await import('../lib/supabase');

  const [{ data: mat }, { data: prg }] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', day).maybeSingle(),
    supabase.from('daily_progress')
            .select('notes').match({ citizen_id:cid, day_no:day }).maybeSingle()
  ]);

  /* ➜ Если материал не найден – уводим в ЛК,
        а не кидаем 404: так пользователю понятнее. */
  if (!mat)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } };

  /* ➜ Если день ещё закрыт – туда же. */
  if (mat.unlock_at && new Date(mat.unlock_at) > Date.now())
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } };

  return {
    props:{
      dayNo   : day,
      material: { ...mat, notes: prg?.notes ?? '' },
      watched : Boolean(prg)
    }
  };
}

/* ─────────────────────────────────────────── */
/*               CSR-компонент                */
/* ─────────────────────────────────────────── */
export default function ChallengePage ({ dayNo, material, watched }) {
  const router = useRouter();
  const { mutate } = useMe();

  const [isDone, setDone] = useState(watched);
  const [note,   setNote] = useState(material.notes);
  const [left,   setLeft] = useState(null);      // msec

  /* динамически подгружаем confetti только в браузере */
  async function fireConfetti(){
    const { default: confetti } = await import('canvas-confetti');
    confetti({ particleCount:200, spread:80 });
  }

  useEffect(()=>{
    if (isDone && dayNo === 14) fireConfetti();
  }, [isDone, dayNo]);

  /* таймер до разблокировки следующего дня */
  useEffect(()=>{
    if (isDone || dayNo === 14 || !material.unlock_at) return;

    const t = setInterval(()=>{
      const ms = new Date(material.unlock_at) - Date.now();
      setLeft(ms>0 ? ms : null);       // ← null когда «открыт»
    }, 1000);
    return ()=>clearInterval(t);
  }, [isDone, dayNo, material.unlock_at]);

  /* API-маркировка */
  async function submit({ saveOnly=false } = {}){
    const r = await fetch('/api/challenge/mark', {
      method :'POST',
      headers:{ 'Content-Type':'application/json' },
      body   : JSON.stringify({ day: dayNo, note })
    }).then(r=>r.json());

    if (r.ok){
      if (!saveOnly) setDone(true);
      mutate();                    // invalidate /api/me
    } else alert('Ошибка: '+(r.error||'unknown'));
  }

  const fmt = ms => {
    const h = Math.floor(ms/3.6e6);
    const m = Math.floor(ms/6e4)%60;
    return `${h} ч ${m} мин`;
  };

  /* ─────────────── JSX ─────────────── */
  return (
    <main style={{ maxWidth:900, margin:'0 auto', padding:'1rem' }}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* шаги-точки */}
      <div style={{ display:'flex', gap:6, margin:'24px 0 6px' }}>
        {Array.from({ length:14 }).map((_,i)=>(
          <span key={i}
            style={{
              width:12, height:12, borderRadius:'50%',
              background: i < dayNo-1 || (i===dayNo-1 && isDone) ? '#28a745' : '#ccc'
            }}/>
        ))}
      </div>

      {/* таймер (показываем только >0) */}
      {left>0 && (
        <p style={{ color:'#555', margin:'8px 0 18px' }}>
          ⏰ Следующий день откроется через <b>{fmt(left)}</b>
        </p>
      )}

      {/* заметка */}
      <h3 style={{ margin:'24px 0 6px' }}>📝 Ваша заметка</h3>
      <textarea
        rows={4}
        maxLength={1000}
        style={{ width:'100%', marginBottom:10 }}
        value={note}
        onChange={e=>setNote(e.target.value)}
      />

      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        <button className="btn primary" onClick={()=>submit({saveOnly:true})}>
          💾 Сохранить&nbsp;заметку
        </button>

        {!isDone ? (
          <button className="btn primary" onClick={()=>submit()}>
            ✔️ Я осознанно изучил&nbsp;материал
          </button>
        ) : (
          <span style={{ alignSelf:'center', color:'#28a745', fontWeight:600 }}>
            ✅ Материал&nbsp;изучен
          </span>
        )}
      </div>

      {/* навигация */}
      <nav style={{ marginTop:32, fontSize:18,
                    display:'flex', justifyContent:'space-between' }}>
        <button className="btn-link" onClick={()=>router.back()}>← Назад</button>

        <button className="btn-link" title="Прогресс"
                onClick={()=>router.push('/lk?tab=progress')}>📈</button>

        {dayNo<14 && isDone && !left && (
          <button className="btn-link"
                  onClick={()=>router.push(`/challenge?day=${dayNo+1}`)}>
            день {dayNo+1} →
          </button>
        )}
      </nav>
    </main>
  );
}
