// pages/challenge/[day].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Head from 'next/head'

export default function Viewer () {
  const { query:{ day } } = useRouter()
  const d = Number(day)
  const [material,setMat] = useState(null)

  /* ─── берём материал дня ─── */
  useEffect(() => {
    if (!d) return
    supabase
      .from('daily_materials')
      .select('*')
      .eq('day_no', d)
      .single()
      .then(({data}) => setMat(data))
  }, [d])

  if (!material) return <p style={{padding:'2rem'}}>Загрузка…</p>

  async function submit (e) {
    e.preventDefault()
    const reply = e.target.reply.value
    const r = await fetch('/api/challenge/watch', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ day:d, reply })
    })
    if (r.ok) location.href = d===14 ? '/lk' : `/challenge?day=${d+1}`
    else alert('Ответ неверен, попробуйте ещё раз')
  }

  return (
    <>
      <Head><title>{`День ${d} • Челлендж`}</title></Head>
      <main style={{maxWidth:720,margin:'0 auto',padding:'2rem 1rem'}}>
        <h2>День {d}: {material.title}</h2>

        {/* изображение / видео */}
        {material.media_url && (
          material.media_url.match(/\.(jpg|jpeg|png|webp)$/i)
            ? <img src={material.media_url}
                   style={{maxWidth:'100%',borderRadius:8}} />
            : <video src={material.media_url} controls style={{maxWidth:'100%'}} />
        )}

        {material.description && <p style={{marginTop:16}}>{material.description}</p>}

        {/* вопрос */}
        {material.question && (
          <form onSubmit={submit} style={{marginTop:24}}>
            <p style={{fontWeight:500}}>{material.question}</p>
            <input name="reply" required
                   style={{padding:'.5rem .8rem',border:'1px solid #ccc',borderRadius:6}}/>
            <button className="btn" style={{marginLeft:12}}>Отправить</button>
          </form>
        )}

        {!material.question && (
          <button onClick={()=>submit({preventDefault(){},target:{reply:{value:'ok'}}})}
                  className="btn" style={{marginTop:24}}>
            Прочитано ✓
          </button>
        )}
      </main>
    </>
  )
}
