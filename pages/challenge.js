// pages/challenge.js
//
// ▸ Защита «по-взрослому»: 1 день разблокируется каждые 24 ч от challenge_started_at
// ▸ Если день недоступен — редирект + сообщаем в query ?wait=секунд
// ▸ На клиенте показан тай-мер обратного отсчёта
// ▸ «💾 Сохранить заметку» работает и до, и после отметки «Материал изучен»
//

import Head          from 'next/head'
import Link          from 'next/link'
import { parse }     from 'cookie'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase }  from '../lib/supabase'

/* ---------- CLIENT ---------- */
export default function Challenge({ dayNo, material, watched, waitSec }) {
  const router      = useRouter()
  const [note,setN] = useState(material.notes || '')
  const [isDone,setD]= useState(watched)
  const [saved,setS] = useState(false)       // небольшой «галочка-флэш»
  const [left, setLeft] = useState(waitSec || 0)

  /* live-countdown */
  useEffect(()=>{
    if(!left) return
    const t = setInterval(()=>setLeft(s=>Math.max(0,s-1)),1000)
    return ()=>clearInterval(t)
  },[left])

  /* отправка заметки / закрытие дня */
  async function submit({saveOnly=false}={}) {
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ day:dayNo, note, saveOnly })
    }).then(r=>r.json())

    if(!r.ok){ alert('Ошибка: '+(r.error||'unknown')); return }

    setS(true); setTimeout(()=>setS(false),1800)
    if(!saveOnly){ setD(true); router.replace(router.asPath) }
  }

  /* ---------- UI ---------- */
  return (
    <>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <main style={{maxWidth:860,margin:'2rem auto',padding:'0 1rem'}}>
        {/* === СОДЕРЖИМОЕ ДНЯ === */}
        <h2>{material.title}</h2>
        {/* …текст / markdown можно рендерить как вам угодно… */}

        {/* === круги-индикаторы === */}
        <div style={{margin:'18px 0'}}>
          {Array.from({length:14}).map((_,i)=>(
            <span key={i} style={{
              display:'inline-block',width:10,height:10,borderRadius:'50%',
              marginRight:4,
              background: i<dayNo ? (i<dayNo-1?'#28a745':'#198754') : '#ccc'
            }}/>
          ))}
        </div>

        {/* === заметка === */}
        <h3>📝 Ваша заметка</h3>
        <textarea value={note} rows={4} maxLength={1000}
                  onChange={e=>setN(e.target.value)}
                  style={{width:'100%',marginBottom:12}}/>

        <button className="btn primary"
                onClick={()=>submit({saveOnly:true})}>
          💾 Сохранить заметку
        </button>
        {saved && <span style={{color:'#28a745',fontWeight:600,marginLeft:6}}>✔️</span>}

        {/* чек-бокс «изучил» */}
        {!isDone ? (
          <button className="btn primary" style={{marginLeft:14}}
                  onClick={()=>submit()}>
            ✔️ Я осознанно изучил материал
          </button>
        ):(
          <span style={{color:'#28a745',marginLeft:14,fontWeight:600}}>
            Материал изучен
          </span>
        )}

        {/* === навигация === */}
        <div style={{marginTop:26}}>
          <Link href="/lk?tab=progress" className="btn-link">← Назад</Link>

          {/* NEXT-DAY (доступен сразу после отметки) */}
          {dayNo<14 && isDone &&
            <Link href={`/challenge?day=${dayNo+1}`}
                  className="btn-link" style={{float:'right'}}>
              день {dayNo+1} →
            </Link>}
        </div>

        {/* === финал === */}
        {dayNo===14 && isDone && (
          <p style={{marginTop:32,fontSize:18,color:'green'}}>
            🎉 Все материалы пройдены!<br/>
            Перейдите в&nbsp;
            <Link href="/lk?tab=progress"><a>Личный кабинет</a></Link>,
            чтобы отправить доказательства «шара».
          </p>
        )}

        {/* === TIMER до разблокировки (если прилетел waitSec > 0) === */}
        {left>0 && (
          <p style={{marginTop:32,fontSize:18,color:'#dc3545'}}>
            ⏰ Следующий день откроется через&nbsp;
            {Math.floor(left/3600).toString().padStart(2,'0')}:
            {Math.floor(left/60%60).toString().padStart(2,'0')}:
            {(left%60).toString().padStart(2,'0')}
          </p>
        )}
      </main>
    </>
  )
}

/* ---------- SSR ---------- */
export async function getServerSideProps({ query, req }){
  const { tg, cid } = parse(req.headers.cookie||'')
  if(!tg || !cid)
    return {redirect:{destination:'/lk',permanent:false}}

  const dayNo = Math.min(Math.max(+query.day||1,1),14)

  /* тащим citizen — нужен challenge_started_at / progress */
  const [{data: citizen},{data: mat},{count},{data: prev}] = await Promise.all([
    supabase.from('citizens').select('*').eq('id',cid).maybeSingle(),
    supabase.from('daily_materials')
            .select('*').eq('day_no',dayNo).maybeSingle(),
    supabase.from('daily_progress')
            .select('*',{count:'exact'}).match({citizen_id:cid}),
    supabase.from('daily_progress')
            .select('watched_at').match({citizen_id:cid,day_no:dayNo-1}).maybeSingle()
  ])

  /* защита: нет материала → назад */
  if(!mat)
    return {redirect:{destination:'/lk?tab=progress',permanent:false}}

  /* вычисляем «разрешённый максимальный день» */
  const started = citizen?.challenge_started_at
  const allowed = started
        ? 1 + Math.floor((Date.now()-new Date(started))/86400000)
        : 1                                              // safety-fallback

  /* если пользователь лезет вперёд… */
  if(dayNo>allowed || (dayNo>1 && !prev)){
    const wait = started
      ? Math.max(0,
          Math.ceil((new Date(started).getTime()+allowed*86400000 - Date.now())/1000))
      : 0
    return {redirect:{
      destination:`/lk?tab=progress&wait=${wait}`,
      permanent:false
    }}
  }

  /* берём заметку + факт «день закрыт» */
  const {data: cur}=await supabase
    .from('daily_progress')
    .select('notes').match({citizen_id:cid,day_no:dayNo}).maybeSingle()

  return {
    props:{
      dayNo,
      material:{ ...mat, notes:cur?.notes||'' },
      watched : !!cur,
      waitSec : 0
    }
  }
}
