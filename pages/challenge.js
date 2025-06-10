// pages/challenge.js
import Head          from 'next/head'
import { parse }     from 'cookie'
import { supabase }  from '../lib/supabase'
import DayMaterial   from '../components/DayMaterial'
import { useState, useEffect } from 'react'
import confetti      from 'canvas-confetti'
import { useRouter } from 'next/router'
import { mutate }   from 'swr'
import Link          from 'next/link'

export default function ChallengePage({ dayNo, material = {}, watched, notes }) {
  const router = useRouter()
  const [done, setDone]     = useState(watched)
  const [myNote, setMyNote] = useState(notes || '')

  useEffect(() => { setDone(watched); setMyNote(notes || '') }, [watched, notes, dayNo])
  useEffect(() => { if (dayNo===14 && done) confetti({particleCount:200,spread:80}) }, [done, dayNo])

  async function markRead() {
    const res = await fetch('/api/challenge/mark', {

      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ dayNo, notes: myNote })
    })
    const { ok, error } = await res.json()
    if (ok) {
      setDone(true)
      mutate('/api/me')
      mutate('/api/challenge/progress')
    }
    else alert('Ошибка: '+error)
  }

  return (
    <>
      <Head><title>День {dayNo}/14 • Terra Zetetica</title></Head>
      <main style={{maxWidth:800,margin:'2rem auto',padding:'0 1rem'}}>
         <div style={{ display:'flex', gap:4, marginBottom:16, justifyContent:'center' }}>
           {Array.from({length:14}).map((_,i)=>(
             <div key={i}
               style={{
                 width:12, height:12, borderRadius:'50%',
                 background: i < dayNo ? '#28a745' : '#ccc'
               }}
             />
           ))}
         </div>

        <h1>День {dayNo} / 14</h1>

        {/* рендерим из новых полей */}
        <DayMaterial material={material} />

        {!done
          ? <button onClick={markRead}
                    style={{background:'#28a745',color:'#fff',padding:'0.75rem 1.5rem',
                            border:'none',borderRadius:6,cursor:'pointer',fontSize:16}}>
              ✔️ Я осознанно изучил материал
            </button>
          : <p style={{color:'#28a745',fontWeight:'bold'}}>✔️ Материал отмечен</p>
        }

        {done && (
          <div style={{marginTop:24}}>
            <textarea
              value={myNote}
              onChange={e=>setMyNote(e.target.value)}
              rows={5}
              style={{width:'100%',padding:8,borderRadius:4,border:'1px solid #ccc'}}
              placeholder="Ваши заметки…"
            />
            <button onClick={markRead}
                    style={{marginTop:8,background:'#007bff',color:'#fff',
                            border:'none',padding:'0.5rem 1rem',borderRadius:4,cursor:'pointer'}}>
              💾 Сохранить заметку
            </button>
          </div>
        )}

        <div style={{marginTop:32,display:'flex',gap:12}}>
          <button onClick={()=>router.back()} style={{cursor:'pointer'}}>← Назад</button>

          {dayNo<14 && (
            <Link href={`/challenge?day=${dayNo+1}`}>
              <a>➡️ Перейти к дню {dayNo+1}</a>
            </Link>
          )}
          {dayNo===14 && (
            <Link href="/lk?tab=progress"><a>📈 Мой прогресс</a></Link>
          )}
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps({ req, query }) {
  const { cid } = parse(req.headers.cookie||'')
  if (!cid) {
    return { redirect:{ destination:'/lk', permanent:false } }
  }

  const day = Number(query.day) || 1

  // теперь выбираем все новые колонки
  const { data: mat } = await supabase
    .from('daily_materials')
    .select('day_no, title, subtitle, theme, summary, content_md, media_json, resources, takeaway_md')

    .eq('day_no', day)
    .single()

  const { data: prog } = await supabase
    .from('daily_progress')
    .select('id, notes')
    .eq('citizen_id', cid)
    .eq('day_no', day)
    .maybeSingle()

  return {
    props: {
      dayNo:    day,
      material: mat || {},
      watched:  Boolean(prog),
      notes:    prog?.notes || '',
    }
  }
}
