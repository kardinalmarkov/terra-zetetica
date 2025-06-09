// pages/challenge.js
import { parse } from 'cookie'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Challenge ({ user, citizen, material, watched }) {
  const r        = useRouter()
  const [done,setDone] = useState(watched)

  /* отметка о просмотре/ответе */
  async function mark (reply='ok') {
    await fetch('/api/challenge/watch', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ day: material.day_no, reply })
    })
    setDone(true)
  }

  /* ───────── разная заглушка ───────── */
  if (!user)          return <p style={{padding:'2rem'}}>Сначала войдите через Telegram.</p>
  if (!citizen)       return <p style={{padding:'2rem'}}>Получите гражданство, чтобы участвовать.</p>

  /* ещё не стартовал — кнопка старта */
  if (citizen.challenge_status!=='active') {
    return (
      <main style={{padding:'2rem'}}>
        <h2>Старт 14-дневного челленджа</h2>
        <form method="post" action="/api/challenge/start">
          <button className="btn">🚀 Начать</button>
        </form>
      </main>
    )
  }

  /* ───────── обычный день ───────── */
  return (
    <>
      <Head><title>{`День ${material.day_no} • Челлендж`}</title></Head>
      <main style={{maxWidth:760,margin:'0 auto',padding:'2rem 1rem'}}>
        <h2>День {material.day_no} / 14</h2>
        <h3>{material.title}</h3>

        {/* медиа */}
        {material.media_url && (
          /\.(jpg|jpeg|png|webp|gif)$/i.test(material.media_url)
            ? <img src={material.media_url} style={{maxWidth:'100%',borderRadius:6}}/>
            : <iframe src={material.media_url} width="100%" height="380"
                      style={{border:0,borderRadius:6}} allowFullScreen/>
        )}

        <p style={{marginTop:16}}>{material.description}</p>

        {/* вопрос / кнопка */}
        {material.question && !done && (
          <form onSubmit={e=>{e.preventDefault(); mark(e.target.reply.value)}}>
            <p style={{fontWeight:500}}>{material.question}</p>
            <input name="reply" required
                   style={{padding:'.45rem .8rem',border:'1px solid #ccc',borderRadius:6}}/>
            <button className="btn" style={{marginLeft:12}}>Ответить</button>
          </form>
        )}

        {!material.question && !done && (
          <button className="btn" onClick={()=>mark()}>✔ Отметить просмотр</button>
        )}

        {done && <p style={{color:'green',marginTop:16}}>✔ Материал отмечен</p>}

        {/* выбор дня назад — выпадашка */}
        <select style={{marginTop:24}}
                defaultValue={material.day_no}
                onChange={e=>r.push('/challenge?day='+e.target.value)}>
          {Array.from({length:material.day_no}).map((_,i)=>
            <option key={i} value={i+1}>День {i+1}</option>)}
        </select>
      </main>
    </>
  )
}

/* ───────── SSR ───────── */
export async function getServerSideProps ({ req, query }) {
  const { tg, cid } = parse(req.headers.cookie||'')
  const user     = tg ? JSON.parse(Buffer.from(tg,'base64').toString()) : null
  const citizen  = cid
    ? (await supabase.from('citizens').select('*').eq('id',cid).single()).data
    : null

  /* нет активного челленджа — рендерим только заглушку */
  if (!citizen || citizen.challenge_status!=='active') {
    return { props:{ user, citizen:null, material:{}, watched:false } }
  }

  /* какой день отображать */
  const reqDay = Number(query.day) || null

  const { count } = await supabase
    .from('daily_progress')
    .select('*', { head:true, count:'exact' })
    .eq('citizen_id', cid)

  const today = Math.min(count + 1, 14)
  const dayNo = reqDay && reqDay>=1 && reqDay<=today ? reqDay : today

  const { data:material } = await supabase
    .from('daily_materials').select('*').eq('day_no', dayNo).single()

  const { data:already } = await supabase
    .from('daily_progress')
    .select('id').eq('citizen_id', cid).eq('day_no', dayNo).maybeSingle()

  return { props:{
    user,
    citizen,
    material,
    watched: !!already
  }}
}
