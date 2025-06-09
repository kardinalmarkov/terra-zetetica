// pages/challenge.js
import { parse }       from 'cookie'
import Head            from 'next/head'
import Link            from 'next/link'
import { useRouter }   from 'next/router'
import { useState, useEffect } from 'react'
import DayPicker       from '../components/DayPicker'
import { supabase }    from '../lib/supabase'
import ReactMarkdown   from 'react-markdown'
import remarkGfm       from 'remark-gfm'
import confetti        from 'canvas-confetti'

export default function Challenge ({ user, material, watched, notes }) {
  const router = useRouter()
  const [done, setDone] = useState(watched)
  const [myNote, setNote] = useState(notes || '')

  // сброс заметки при смене дня (notes из SSR меняется)
  useEffect(() => setNote(notes || ''), [notes])

  // конфетти на последний день
  useEffect(() => {
    if (material.day_no === 14 && done) {
      confetti({ particleCount:200, spread:80 })
    }
  }, [material.day_no, done])

  // старт челленджа (для новых пользователей)
  async function startChallenge() {
    const res = await fetch('/api/challenge/start', { method:'POST' })
    const json = await res.json()
    if (json.ok) router.replace('/challenge')
    else alert('Ошибка старта: '+json.err)
  }

  // отметка «просмотрено»
  async function mark(reply='ok') {
    const res = await fetch('/api/challenge/watch', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ day: material.day_no, reply })
    })
    const json = await res.json()
    if (json.ok) setDone(true)
    else alert('Ошибка: '+json.err)
  }

  // сохранение заметки
  async function saveNote() {
    const res = await fetch('/api/challenge/note', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ day: material.day_no, note: myNote })
    })
    const json = await res.json()
    if (json.ok) alert('Сохранено!')
    else alert('Ошибка сохранения: '+json.err)
  }

  // guards
  if (!user) {
    return (
      <main style={{padding:'2rem', textAlign:'center'}}>
        <p>Сначала авторизуйтесь через Telegram.</p>
      </main>
    )
  }

  // если челлендж ещё не активирован — выводим кнопку старта
  if (!watched && !material.day_no) {
    return (
      <main style={{padding:'2rem', textAlign:'center'}}>
        <h2>Старт 14-дневного челленджа</h2>
        <button onClick={startChallenge} className="btn btn-primary">🚀 Начать челлендж</button>
      </main>
    )
  }

  // обычный UI
  return (
    <>
      <Head><title>День {material.day_no} • Челлендж</title></Head>
      <main style={{maxWidth:760, margin:'0 auto', padding:'2rem 1rem'}}>
        <h2>День {material.day_no} / 14</h2>
        <h3>{material.title}</h3>

        {/* медиаконтент */}
        {material.media_url && /\.(jpe?g|png|gif)$/i.test(material.media_url)
          ? <img src={material.media_url} style={{maxWidth:'100%',borderRadius:6}}/>
          : <iframe src={material.media_url} width="100%" height="380" style={{border:0,borderRadius:6}} allowFullScreen/>
        }

        {/* описание и вопрос */}
        <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
          {material.description}
        </ReactMarkdown>

        {!done && material.question && (
          <form onSubmit={e=>{ e.preventDefault(); mark(e.target.reply.value) }} style={{marginTop:20}}>
            <p style={{fontWeight:600}}>{material.question}</p>
            <input name="reply" required style={{padding:'.5rem',width:'100%',borderRadius:4,border:'1px solid #ccc'}}/>
            <button type="submit" className="btn" style={{marginTop:8}}>Ответить</button>
          </form>
        )}

        {!done && !material.question && (
          <button onClick={()=>mark()} className="btn" style={{marginTop:20}}>✔ Отметить просмотр</button>
        )}

        {done && <p style={{color:'green',marginTop:16}}>✔ Уже отмечено</p>}

        {/* навигация по дням */}
        {done && material.day_no < 14 && (
          <Link href={`/challenge?day=${material.day_no+1}`} className="btn" style={{marginTop:16}}>
            ➡️ К дню {material.day_no+1}
          </Link>
        )}

        <div style={{marginTop:32, display:'flex', gap:12}}>
          <button onClick={()=>router.back()}>← Назад</button>
          <Link href="/lk?tab=progress" className="btn btn-secondary">📈 Прогресс</Link>
        </div>

        {/* заметки */}
        {done && (
          <form onSubmit={e=>{e.preventDefault(); saveNote()}} style={{marginTop:32}}>
            <textarea
              rows={4}
              value={myNote}
              onChange={e=>setNote(e.target.value)}
              placeholder="Ваши заметки…"
              style={{width:'100%',padding:8,borderRadius:4,border:'1px solid #ccc'}}
            />
            <button type="submit" className="btn" style={{marginTop:8}}>💾 Сохранить заметку</button>
          </form>
        )}
      </main>
    </>
  )
}

// SSR: загружаем user из cookie и первый материал
export async function getServerSideProps({ req, query }) {
  const { tg, cid } = parse(req.headers.cookie||'')
  const user    = tg ? JSON.parse(Buffer.from(tg,'base64')) : null

  // если ещё не стартовали — вернём пустой материал
  if (!cid) {
    return { props:{ user, material:{}, watched:false, notes:null } }
  }

  // прочитан ли хотя бы 1
  const { count } = await supabase
    .from('daily_progress')
    .select('*',{ head:true, count:'exact' })
    .eq('citizen_id', cid)

  const today = Math.min(count+1,14)
  const reqDay = Number(query.day)
  const dayNo  = reqDay>=1 && reqDay<=today ? reqDay : today

  const { data: material } = await supabase
    .from('daily_materials')
    .select('*')
    .eq('day_no', dayNo)
    .single()

  const { data: progress } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('citizen_id', cid)
    .eq('day_no', dayNo)
    .maybeSingle()

  return {
    props: {
      user,
      material,
      watched: !!progress,
      notes: progress?.notes || ''
    }
  }
}
