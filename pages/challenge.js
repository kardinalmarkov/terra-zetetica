// pages/challenge.js
import { supabase } from '../lib/supabase'
import { parse } from 'cookie'
import { useState } from 'react'
import Head from 'next/head'

export default function Challenge ({ user, citizen, material, watched }) {
  const [done, setDone] = useState(watched)

  async function markWatched () {
    await fetch('/api/challenge/watch', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ day: material.day_no })
    })
    setDone(true)
  }

  if (!user) {
    return <p style={{padding:'2rem'}}>Сначала войдите через Telegram.</p>
  }

  if (!citizen) {
    return <p style={{padding:'2rem'}}>Получите гражданство, чтобы участвовать.</p>
  }

  if (citizen.challenge_status!=='active') {
    return (
      <main style={{padding:'2rem'}}>
        <h2>Присоединиться к челленджу</h2>
        <p>Нажмите, чтобы стартовать 14-дневную программу.</p>
        <form method="post" action="/api/challenge/start">
          <button style={{padding:'.6rem 1.2rem'}}>Стартовать</button>
        </form>
      </main>
    )
  }
        {material.question && !done && (
          <form onSubmit={async e=>{
              e.preventDefault();
              await markWatched();
          }}>
            <p style={{fontWeight:500}}>{material.question}</p>
            <input name="reply" style={{padding:'.4rem .8rem',border:'1px solid #ccc',borderRadius:6}}/>
            <button style={{marginLeft:12}}>Отправить</button>
          </form>
        )}

  return (
    <>
      <Head><title>День {material.day_no} / Челлендж</title></Head>
      <main style={{maxWidth:760,margin:'0 auto',padding:'2rem 1rem'}}>
        <h2>День {material.day_no} / 14</h2>
        <h3>{material.title}</h3>
        {material.media_url && (
          <div style={{margin:'1rem 0'}}>
            {/* картинка или iframe youtube */}
            {/\.(jpg|jpeg|png|gif|webp)$/i.test(material.media_url)
              ? <img src={material.media_url} style={{maxWidth:'100%'}}/>
              : <iframe width="100%" height="380" src={material.media_url}
                        frameBorder="0" allowFullScreen/>}
          </div>
        )}
        <p>{material.description}</p>

        {done
          ? <p style={{color:'green'}}>✔ Материал отмечен просмотренным</p>
          : <button onClick={markWatched}
                    style={{padding:'.6rem 1.2rem'}}>Отметить просмотренным</button>}
      </main>
    </>
  )
}

/* ─── SSR ─── */
export async function getServerSideProps ({ req }) {
  const { tg, cid } = parse(req.headers.cookie||'')
  let user=null, citizen=null, material=null, watched=false

  if (tg) user = JSON.parse(Buffer.from(tg,'base64').toString())

  if (cid) {
    const { data } = await supabase
      .from('citizens').select('*').eq('id',cid).single()
    citizen = data ?? null
  }

  if (citizen?.challenge_status==='active') {
    // какой сегодня день?
    const { count } = await supabase
      .from('daily_progress')
      .select('*', { count:'exact', head:true })
      .eq('citizen_id', cid)

    const day = Math.min(count+1, 14)
    const { data:mat } = await supabase
      .from('daily_materials')
      .select('*')
      .eq('day_no', day)
      .single()
    material = mat ?? null

    const { data:already } = await supabase
      .from('daily_progress')
      .select('id')
      .eq('citizen_id',cid)
      .eq('day_no',day)
      .single()
    watched = !!already
  }

  return { props:{ user, citizen, material, watched } }
}
