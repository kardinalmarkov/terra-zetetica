import { supabase } from '../../lib/supabase'
import { parse } from 'cookie'
import { useRouter } from 'next/router'
import { useState } from 'react'

export async function getServerSideProps ({ params, req }) {
  const day = Number(params.day)
  const { tg, cid } = parse(req.headers.cookie || '')
  if (!tg) return { redirect:{ destination:'/lk', permanent:false } }

  const { data:material } = await supabase
        .from('daily_materials')
        .select('*')
        .eq('day_no', day)
        .single()

  return { props:{ material, cid, day } }
}

export default function Viewer ({ material, cid, day }) {
  const r = useRouter()
  const [answer,setAnswer] = useState('')

  async function handleOk () {
    await fetch('/api/challenge/watch',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ day, reply:answer })
    })
    r.push('/lk')
  }

  return (
    <main style={{maxWidth:720,margin:'2rem auto'}}>
      <h2>День {day}</h2>
      <img src={material.media_url} width={600}/>
      {material.question && (
        <>
          <p>{material.question}</p>
          <input value={answer} onChange={e=>setAnswer(e.target.value)}/>
        </>
      )}
      <button onClick={handleOk}>Отметить просмотр</button>
    </main>
  )
}
