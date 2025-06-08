// pages/api/challenge/watch.js
import { supabase } from '../../../lib/supabase'
import { parse }    from 'cookie'

export default async (req,res)=>{
  if(req.method!=='POST') return res.status(405).end()
  const { tg, cid } = parse(req.headers.cookie||'')
  if(!tg||!cid) return res.status(401).end()

  const { day, reply } = req.body          // { day:3, reply:"Горизонт" }
  if(!day) return res.status(400).end()

  // проверяем ответ
  const { data:mat } = await supabase.from('daily_materials')
                    .select('answer').eq('day_no',day).single()
  const ok = mat?.answer
           ? mat.answer.trim().toLowerCase() === reply.trim().toLowerCase()
           : true      // если нет вопроса — всегда ок

  if(!ok) return res.status(400).json({ ok:false, err:'wrong' })

  // upsert progress
  await supabase.from('daily_progress')
    .upsert({ citizen_id:Number(cid), day_no:day })

  // финальный день → finished
  if(day===14){
    await supabase.from('citizens')
      .update({ challenge_status:'finished' })
      .eq('id',cid)
  }
  res.json({ ok:true })
}
``` :contentReference[oaicite:0]{index=0}

### Viewer (обновлённый кусок в `pages/challenge/[day].js`)
```jsx
{/* вопрос */}
{material.question && (
  <form onSubmit={submit}>
    <p style={{marginTop:20,fontWeight:500}}>{material.question}</p>
    <input name="reply" required
           style={{padding:'.4rem .6rem',border:'1px solid #ccc',borderRadius:6}}/>
    <button className="btn" style={{marginLeft:10}}>✓ Отправить</button>
  </form>
)}
