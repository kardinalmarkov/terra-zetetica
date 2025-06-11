// pages/challenge.js
// ──────────────────────────────────────────────────────────────────────────────
// Страница «День N» 14-дневного челленджа.
//
// • Верхний progress-bar: 14 кружков (зелёные = уже открыт).
// • Таймер «до открытия следующего дня»
//   работает, если в daily_materials есть столбец unlock_at TIMESTAMPTZ.
// • Кнопка «✔️ Я осознанно…» → POST /api/challenge/mark
//   (см. pages/api/challenge/mark.js – там upsert в daily_progress).
// • Заметка сохраняется тем же запросом (notes)
//
// NB: если у вас ещё нет колонки unlock_at - заведите `DATE + INTERVAL`.  
//     Тогда таймер просто не показывается (left === null).
// ──────────────────────────────────────────────────────────────────────────────
import Head           from 'next/head'
import { parse }      from 'cookie'
import { supabase }   from '../lib/supabase'
import DayMaterial    from '../components/DayMaterial'
import confetti       from 'canvas-confetti'
import Link           from 'next/link'
import { useRouter }  from 'next/router'
import { mutate }     from 'swr'
import { useState, useEffect } from 'react'

// UI-кружочки progress-bar
const Dots = ({ curr }) => (
  <div style={{display:'flex',gap:4,marginBottom:16,justifyContent:'center'}}>
    {Array.from({length:14}).map((_,i)=>(
      <div key={i} style={{
        width:12,height:12,borderRadius:'50%',
        background:i<curr ? '#28a745':'#ccc'
      }}/>
    ))}
  </div>
)

export default function ChallengePage({ dayNo, material={}, watched, notes }) {
  const r = useRouter()

  // состояние «прочитано» + заметка
  const [done,setDone]      = useState(watched)
  const [myNote,setMyNote]  = useState(notes||'')

  // таймер до следующего unlock_at
  const [left,setLeft]=useState(null)
  useEffect(()=>{
    if(!material.unlock_at) return
    const id=setInterval(()=>{
      setLeft(Math.max(0,new Date(material.unlock_at)-Date.now()))
    },1_000)
    return ()=>clearInterval(id)
  },[material.unlock_at])

  // конфетти в финальный день
  useEffect(()=>{ if(dayNo===14 && done) confetti({particleCount:180,spread:70}) },[done,dayNo])

  // запрос «отметить/сохранить»
  const save = async () =>{
    const res  = await fetch('/api/challenge/mark',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ dayNo, notes: myNote })
    })
    const j = await res.json()
    if(!j.ok) return alert('Ошибка: '+(j.error||'unknown'))
    setDone(true)
    mutate('/api/me')               // синхронно обновим прогресс в ЛК
  }

  /* ---------- рендер ---------- */
  return (
    <>
      <Head><title>День {dayNo} / 14 • Terra Zetetica</title></Head>

      <main style={{maxWidth:820,margin:'2rem auto',padding:'0 1rem'}}>
        <Dots curr={dayNo}/>

        {left>0 && (
          <p style={{textAlign:'center',color:'#555',marginTop:-12}}>
            Новый день через&nbsp;{Math.ceil(left/36e5)} ч
          </p>
        )}

        <h1 style={{margin:'1rem 0'}}>День {dayNo} / 14</h1>

        <DayMaterial material={material}/>

        {/* -------------------------------------------------- кнопка/метка */}
        {!done
          ? <button onClick={save} className="btn success">
              ✔️ Я осознанно изучил материал
            </button>
          : <p style={{color:'#28a745',fontWeight:600}}>✔ Материал отмечен</p>}

        {/* -------------------------------------------------- заметка */}
        {done && (
          <div style={{marginTop:24}}>
            <textarea
              rows={5}
              value={myNote}
              onChange={e=>setMyNote(e.target.value.slice(0,1000))} // 1k лимит
              style={{width:'100%',border:'1px solid #bbb',borderRadius:6,padding:8}}
              placeholder="Ваши заметки…"
            />
            <button onClick={save} className="btn primary" style={{marginTop:8}}>
              💾 Сохранить заметку
            </button>
          </div>
        )}

        {/* -------------------------------------------------- навигация */}
        <div style={{marginTop:32,display:'flex',gap:12}}>
          <button onClick={()=>r.back()} className="btn">← Назад</button>
          {dayNo<14
            ? <Link href={`/challenge?day=${dayNo+1}`}><a className="btn">➡ День {dayNo+1}</a></Link>
            : <Link href="/lk?tab=progress"><a className="btn">📈 Прогресс</a></Link>}
        </div>
      </main>
    </>
  )
}

/* ───────────────────────── SSR ───────────────────────── */
export async function getServerSideProps({ req, query }) {
  const { cid } = parse(req.headers.cookie||'')
  if(!cid) return {redirect:{destination:'/lk',permanent:false}}

  const day = Math.min(Math.max(+query.day||1,1),14)

  // материалы
  const { data: mat } = await supabase
    .from('daily_materials')
    .select('*')           // берём все новые колонки
    .eq('day_no',day).single()

  // прогресс (есть ли строка)
  const { data: prog } = await supabase
    .from('daily_progress')
    .select('notes').match({citizen_id:cid,day_no:day}).maybeSingle()

  return {
    props:{
      dayNo : day,
      material: mat||{},
      watched: !!prog,
      notes  : prog?.notes||''
    }
  }
}
