// pages/challenge.js
// v2.7 — 16 Jun 2025
//
// ────────────  ЧТО ИЗМЕНИЛОСЬ  ────────────
// 1. SSR-часть:  • leftMS → передаём в props, чтобы
//                   на клиенте сразу знать «сколько ждать».
//                • Проверка «материал уже есть, но предыдущий
//                   день не закрыт» – ранний redirect.
// 2. CSR-часть: • useState(leftMS)  – нет лишнего “0 ч 0 мин”.
//               • submit({saveOnly})     – галочка ✔️ после
//                 успешного сохранения заметки.
//               • fireConfetti() — динамический import
//                 canvas-confetti только в браузере.
//               • навигация: ← Назад ‖ 📈 (ЛК) ‖ → след. день.
// 3. UI:        • кнопка «💾 Сохранить заметку» активна ВСЕГДА.
//               • “Материал изучен” показывается dès isDone=true.
//               • Таймер ⏰ не рисуется, когда left ≤ 0.

import { useState, useEffect } from 'react';
import { useRouter }           from 'next/router';
import Head                    from 'next/head';
import DayMaterial             from '../components/DayMaterial';
import useMe                   from '../utils/useMe';

/* ─────────────────────────────────────────── */
/*                 SSR-часть                  */
/* ─────────────────────────────────────────── */
export async function getServerSideProps({ query, req }) {
  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '');

  // без авторизации — в ЛК
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } };

  const day = Math.min(Math.max(+query.day || 1, 1), 14);
  const { supabase } = await import('../lib/supabase');

  // материал дня + возможная заметка пользователя
  const [{ data: mat }, { data: prg }] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', day).maybeSingle(),
    supabase.from('daily_progress')
            .select('notes, watched_at')
            .match({ citizen_id: cid, day_no: day })
            .maybeSingle()
  ]);

  /* ➊ Материала нет — мягко отправляем в ЛК */
  if (!mat)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } };

  /* ➋ Материал есть, но ещё «глобально» заблокирован */
  if (mat.unlock_at && new Date(mat.unlock_at) > Date.now())
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } };

  /* ➌ Проверяем локальную последовательность (24 ч правило) */
  const { data: prev } = await supabase
    .from('daily_progress')
    .select('watched_at')
    .match({ citizen_id: cid, day_no: day - 1 })
    .maybeSingle();                  // prev undefined ↔ день 1

  // предыдущий не пройден
  if (day > 1 && !prev)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } };

  // предыдущий пройден < 24 ч назад
  if (prev && Date.now() - new Date(prev.watched_at) < 86_400_000)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } };

  // сколько осталось до разблокировки next-day?
  const left =
    prev ? 86_400_000 - (Date.now() - new Date(prev.watched_at)) : null;

  return {
    props:{
      dayNo   : day,
      material: { ...mat, notes: prg?.notes ?? '' },
      watched : Boolean(prg),
      leftMS  : left                                // ⇐ !!!
    }
  };
}

/* ─────────────────────────────────────────── */
/*               CSR-компонент                */
/* ─────────────────────────────────────────── */
export default function ChallengePage({ dayNo, material, watched, leftMS }) {
  const router  = useRouter();
  const { mutate } = useMe(); // invalidate /api/me после отметки

  const [isDone, setDone] = useState(watched);
  const [note,   setNote] = useState(material.notes ?? '');
  const [savedOK,setOK ]  = useState(false);
  const [left,   setLeft] = useState(leftMS);          // ms → таймер

  /* confetti только в браузере */
  async function fireConfetti() {
    const { default: confetti } = await import('canvas-confetti');
    confetti({ particleCount: 180, spread: 70 });
  }

  /* если роут стал /challenge?day=N → синхронизируем state */
  useEffect(() => {
    setNote(material.notes ?? '');
    setDone(watched);
    setOK(false);
  }, [router.asPath]);

  /* салют в последний день */
  useEffect(() => {
    if (isDone && dayNo === 14) fireConfetti();
  }, [isDone, dayNo]);

  /* локальный таймер «сколько ждать» */
  useEffect(() => {
    if (isDone || dayNo === 14 || left === null) return;

    const t = setInterval(() => {
      const ms = leftMS - (Date.now() % 1);      // грубо, ±1 с
      setLeft(ms > 0 ? ms : null);
    }, 1000);
    return () => clearInterval(t);
  }, [isDone, dayNo, leftMS]);

  async function submit({ saveOnly = false } = {}) {
    const r = await fetch('/api/challenge/mark', {
      method :'POST',
      headers:{ 'Content-Type':'application/json' },
      body   : JSON.stringify({ day: dayNo, note, saveOnly })
    }).then(r => r.json());

    if (r.ok) {
      if (!saveOnly) setDone(true);
      setOK(true);          // ✔️ на 1-2 сек
      mutate();
      setTimeout(() => setOK(false), 2000);
    } else alert('Ошибка: ' + (r.error || 'unknown'));
  }

  const fmt = ms => {
    const h = Math.floor(ms / 3.6e6);
    const m = Math.floor(ms / 60000) % 60;
    return `${h} ч ${m} мин`;
  };

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material} />

      {/* точки-индикаторы */}
      <div style={{ display:'flex', gap:6, margin:'22px 0 6px' }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i}
            style={{
              width:12, height:12, borderRadius:'50%',
              background:
                i < dayNo - 1 || (i === dayNo - 1 && isDone) ? '#28a745' : '#ccc'
            }}/>
        ))}
      </div>

      {/* только если реально ждать */}
      {left && left > 0 && (
        <p style={{ color:'#555', margin:'8px 0 20px' }}>
          ⏰ Следующий день откроется через <b>{fmt(left)}</b>
        </p>
      )}

      {/* Заметка */}
      <h3 style={{ margin:'26px 0 6px' }}>📝 Ваша заметка</h3>
      <textarea
        rows={4}
        maxLength={1000}
        value={note}
        style={{ width:'100%', marginBottom:10 }}
        onChange={e => setNote(e.target.value)}
      />

      <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
        <button className="btn primary" onClick={() => submit({ saveOnly:true })}>
          💾 Сохранить заметку
        </button>

        {savedOK && <span style={{ color:'#28a745', fontWeight:600 }}>✔️ сохранено</span>}

        {!isDone && (
          <button className="btn primary" onClick={() => submit()}>
            ✅ Материал изучен
          </button>
        )}
      </div>

      {/* Навигация */}
      <nav style={{ marginTop:34, display:'flex',
                    justifyContent:'space-between', fontSize:18 }}>
        <button className="btn-link" onClick={() => router.back()}>← Назад</button>

        <button className="btn-link" title="Прогресс"
                onClick={() => router.push('/lk?tab=progress')}>📈</button>

        {dayNo < 14 && isDone && !left && (
          <button className="btn-link"
                  onClick={() => router.push(`/challenge?day=${dayNo + 1}`)}>
            день {dayNo + 1} →
          </button>
        )}
      </nav>
    </main>
  );
}
