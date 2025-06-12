// pages/challenge.js   —  v2.5  (13 Jun 2025)
/*
  ▸ FIX #1  – защита, если в daily_materials нет записи (mat == null)
  ▸ FIX #2  – используем Optional-chaining (?.) для unlock_at
  ▸ FIX #3  – кнопка «💾 Сохранить заметку» всегда активна
  ▸ UX      – «✅ Материал изучен» остаётся после F5,
              навигация ← Назад / 📈 / → день N работает без ошибок
*/

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/router';
import Head                    from 'next/head';
import confetti                from 'canvas-confetti';
import DayMaterial             from '../components/DayMaterial';
import useMe                   from '../utils/useMe';

/* ──── SSR ──── */
export async function getServerSideProps ({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '');

  /* неавторизован → ЛК */
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } };

  /* нормализуем номер дня */
  const day = Math.min(Math.max(+query.day || 1, 1), 14);
  const { supabase } = await import('../lib/supabase');

  /* выбираем материал + прогресс (заметка может быть '') */
  const [{ data: mat, error:matErr }, { data: prg }] = await Promise.all([
    supabase.from('daily_materials')
            .select('*')
            .eq('day_no', day)
            .maybeSingle(),               // ← может вернуться null
    supabase.from('daily_progress')
            .select('notes')
            .match({ citizen_id: cid, day_no: day })
            .maybeSingle()
  ]);

  /* если материала в БД нет → 404 */
  if (matErr || !mat)
    return { notFound:true };

  /* если день закрыт – толкаем в ЛК */
  if (mat.unlock_at && new Date(mat.unlock_at) > Date.now())
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } };

  return {
    props:{
      dayNo    : day,
      material : { ...mat, notes: prg?.notes ?? '' },
      watched  : Boolean(prg)          // день считается пройденным,
    }                                   // даже если заметка пуста
  };
}

/* ──── CSR ──── */
export default function ChallengePage ({ dayNo, material, watched }) {

  const router          = useRouter();
  const { mutate }      = useMe();          // для /api/me кеш
  const [isDone,setDone]= useState(watched);
  const [note,   setNote]=useState(material.notes || '');
  const [left,   setLeft]=useState(null);   // мс до разблокировки

  /* таймер */
  useEffect(()=>{
    /* не запускаем если день пройден  или последний */
    if (isDone || dayNo===14 || !material.unlock_at) return;

    const id = setInterval(()=>{
      const ms = new Date(material.unlock_at) - Date.now();
      setLeft(ms>0 ? ms : 0);
    }, 1000);
    return ()=>clearInterval(id);
  }, [isDone, dayNo, material.unlock_at]);

  /* салют */
  useEffect(()=>{
    if (isDone && dayNo===14) confetti({particleCount:200, spread:80});
  }, [isDone, dayNo]);

  /* POST /mark */
  async function submit({ saveOnly=false } = {}){
    const r = await fetch('/api/challenge/mark', {
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ day:dayNo, note })
    }).then(r=>r.json());

    if (r.ok){
      if (!saveOnly) setDone(true);
      mutate();                         // обновить /lk?tab=progress
    } else alert('Ошибка: '+(r.error||'unknown'));
  }

  const fmt = ms=>{
    const h=Math.floor(ms/3.6e6);
    const m=Math.floor(ms/6e4)%60;
    return `${h} ч ${m} мин`;
  };

  /* ─── JSX ─── */
  return (
    <main style={{maxWidth:900,margin:'0 auto',padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material}/>

      {/* точки прогресса */}
      <div style={{margin:'20px 0 6px',display:'flex',gap:6}}>
        {Array.from({length:14}).map((_,i)=>(
          <span key={i}
            style={{
              width:12,height:12,borderRadius:'50%',
              background: i < dayNo-1 || (i===dayNo-1 && isDone)
                           ? '#28a745' : '#c4c4c4'
            }}/>
        ))}
      </div>

      {/* таймер */}
      {!isDone && left>0 && (
        <p style={{color:'#666',marginBottom:12}}>
          ⏰ До открытия&nbsp;следующего&nbsp;дня:&nbsp;<b>{fmt(left)}</b>
        </p>
      )}

      {/* заметка */}
      <h3 style={{margin:'24px 0 6px'}}>📝 Ваша заметка</h3>
      <textarea rows={4} maxLength={1000}
        style={{width:'100%',marginBottom:10}}
        value={note}
        onChange={e=>setNote(e.target.value)}/>

      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <button className="btn primary"
          onClick={()=>submit({saveOnly:true})}>
          💾 Сохранить заметку
        </button>

        {!isDone
          ? <button className="btn primary"
              onClick={()=>submit()}>
              ✔️ Я&nbsp;осознанно&nbsp;изучил материал
            </button>
          : <span style={{alignSelf:'center',color:'#28a745',fontWeight:600}}>
              ✅ Материал&nbsp;изучен
            </span>}
      </div>

      {/* навигация */}
      <nav style={{marginTop:32,fontSize:18,display:'flex',
                  justifyContent:'space-between',alignItems:'center'}}>
        <button className="btn-link" onClick={()=>router.back()}>← Назад</button>

        <button className="btn-link" title="Прогресс"
                onClick={()=>router.push('/lk?tab=progress')}>📈</button>

        {dayNo<14 && isDone && (!left || left<=0) && (
          <button className="btn-link"
                  onClick={()=>router.push(`/challenge?day=${dayNo+1}`)}>
            день&nbsp;{dayNo+1} →
          </button>
        )}
      </nav>
    </main>
  );
}
