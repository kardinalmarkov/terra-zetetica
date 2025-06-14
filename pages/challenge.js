// pages/challenge.js                                 v3.7 • 14 Jun 2025
//
// ──────────────────────────────────────────────────────────────
//  Страница «/challenge?day=N» — материал + заметка + кнопка «Я осознанно…»
//  v3.7:
//    • исправлен submit(): в запрос снова уходят поля { day, note, saveOnly } –
//      из-за переименования day→dayNo, txt→note ломался POST.
//    • обновлена стрелка «день N →»: когда день заблокирован – показываем
//      встроенный таймер до разблокировки (рассчитывается от challenge_started_at)
//    • мелкие правки типизации / комментарии
// ──────────────────────────────────────────────────────────────

import { useRouter }          from 'next/router'
import Head                   from 'next/head'
import Link                   from 'next/link'
import { useEffect, useState } from 'react'
import styles                 from '../styles/Challenge.module.css'  // (условный css-mod)

export default function ChallengePage ({ dayNo, material, watched, startedAtUTC }) {

  /* --------------------------- локальное состояние --------------------------- */
  const [note   , setNote   ] = useState(material.notes ?? '')
  const [savedOk, setSavedOk] = useState(false)
  const [isDone , setIsDone ] = useState(watched)        // кнопка уже нажата?
  const [leftMs , setLeftMs ] = useState(null)           // millis → следующий день
  const router = useRouter()

  /* ---- клиентский таймер до разблокировки следующего дня ------------------- */
  useEffect(() => {
    // next unlock point = startedAt + (dayNo)*24h   (dayNo – считаем с 0)
    const start = new Date(startedAtUTC)
    const next  = new Date(+start + dayNo * 86_400_000)

    const tick = () => {
      const ms = +next - Date.now()
      setLeftMs(ms > 0 ? ms : 0)
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [dayNo, startedAtUTC])

  /* ------------------------ отправка на бек-энд ----------------------------- */
  async function submit ({ saveOnly = false } = {}) {
    /* day        – номер (1..14)   note – trimmed   saveOnly – true/false */
    const res = await fetch('/api/challenge/mark', {
      method :'POST',
      headers:{ 'Content-Type':'application/json' },
      body   : JSON.stringify({
        day      : dayNo,
        note     : note.trim(),
        saveOnly
      })
    }).then(r => r.json())

    if (!res.ok) {
      alert('Ошибка: '+ res.error)
      return
    }
    setSavedOk(true)
    if (!saveOnly) setIsDone(true)
    // перегружаем, чтобы SSR-часть подхватила обновлённый watched_at
    router.replace(router.asPath, undefined, { scroll:false })
  }

  /* ----------------------------- разметка ----------------------------------- */
  return (
    <>
      <Head><title>День {dayNo} · Докажи шар</title></Head>

      <article className={styles.wrapper}>

        <h1>{material.title}</h1>
        <p className={styles.subtitle}>{material.subtitle}</p>

        {/*  ------- контент дня (в markdown отображается отдельно) -------- */}
        <section
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: material.html }}
        />

        {/* ----------- блок заметки / кнопки  -------------------------------- */}
        <section className={styles.noteBox}>
          <label>📝 Ваша заметка</label>

          <textarea
            rows={5}
            value={note}
            onChange={e=>setNote(e.target.value)}
          />

          <div className={styles.btnRow}>
            {/* сохранить только заметку */}
            <button className="btn primary"
                    onClick={()=>submit({saveOnly:true})}>
              💾 Сохранить заметку
            </button>

            {savedOk && <span className={styles.ok}>✔︎</span>}

            {/* «Я осознанно изучил…» – ставит watched_at, даёт след. день */}
            {!isDone ? (
              <button className="btn success"
                      onClick={()=>submit()}>
                ✅ Я осознанно изучил
              </button>
            ) : (
              <span className={styles.done}>Материал пройден 🎉</span>
            )}
          </div>
        </section>

        {/* ------------------ навигация внизу ------------------------------ */}
        <nav className={styles.nav}>
          {dayNo>1 &&
            <Link href={`/challenge?day=${dayNo-1}`} className="btn-link" scroll={false}>
              ← день {dayNo-1}
            </Link>}

          {/* если день закрыт – показываем таймер; иначе активную ссылку */}
          {dayNo<14 && isDone && (
            leftMs && leftMs > 0
              ? <span className={styles.timer}>
                  ⏰ {new Date(leftMs).toISOString().substr(11,8)}
                </span>
              : <Link href={`/challenge?day=${dayNo+1}`} className="btn-link" scroll={false}>
                  день {dayNo+1} →
                </Link>
          )}

          {/* финальный баннер после дня 14 */}
          {dayNo===14 && isDone &&
            <p className={styles.final}>
              🎉 Вы прошли все материалы!<br/>
              Перейдите в&nbsp;
              <Link href="/lk?tab=progress">Личный кабинет</Link>, чтобы отправить доказательства «шара».
            </p>}
        </nav>

      </article>
    </>
  )
}

/* ────────────────────────── SSR - данные дня ────────────────────────── */
export async function getServerSideProps ({ query, req }) {

  const { tg, cid } = (await import('cookie')).parse(req.headers.cookie ?? '')
  if (!tg || !cid)
    return { redirect:{ destination:'/lk', permanent:false } }

  const dayNo = Math.min(Math.max(+query.day || 1, 1), 14)

  const { supabase } = await import('../lib/supabase')

  /* материалы дня + заметка пользователя */
  const [{ data:mat }, { data:prg }, { data:cit }] = await Promise.all([
    supabase.from('daily_materials')
            .select('*').eq('day_no', dayNo).maybeSingle(),
    supabase.from('daily_progress')
            .select('notes').match({ citizen_id:cid, day_no:dayNo }).maybeSingle(),
    supabase.from('citizens')
            .select('challenge_started_at').eq('id',cid).maybeSingle()
  ])

  if (!mat)
    return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

  /* проверяем предыдущий день + 24 ч от старта */
  if (dayNo>1) {
    const { data:last } = await supabase
      .from('daily_progress')
      .select('watched_at')
      .match({ citizen_id:cid, day_no:dayNo-1 })
      .maybeSingle()
    if (!last) // предыдущий день не закрыт
      return { redirect:{ destination:'/lk?tab=progress', permanent:false } }

    const started = new Date(cit?.challenge_started_at ?? 0)
    const now     = Date.now()
    if (started && now - +started < (dayNo-1)*86_400_000)
      return { redirect:{ destination:'/lk?tab=progress', permanent:false } }
  }

  return {
    props:{
      dayNo,
      material: { ...mat, notes: prg?.notes ?? '' },
      watched : Boolean(prg),
      startedAtUTC: cit?.challenge_started_at ?? null
    }
  }
}
