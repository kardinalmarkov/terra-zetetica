// pages/api/challenge/mark.js
import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req,res){
  if (req.method!=='POST')            return res.status(405).end()

  const { cid }               = parse(req.headers.cookie||'')
  const { dayNo, notes = '' } = req.body

  if (!cid || !dayNo)         return res.status(400).json({error:'args'})
  if (notes.length > 1000)    return res.status(400).json({error:'long'})

  // атомарно пишем заметку / отметку «просмотрено»
  const { error } = await supabase
    .from('daily_progress')
    .upsert({ citizen_id: cid, day_no: dayNo, notes },
            { onConflict:'citizen_id,day_no' })
  if (error) return res.status(500).json({error:error.message})

  // активируем челлендж, если ещё «inactive»
  await supabase
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('id', cid)
    .in('challenge_status', ['inactive', null])

  res.json({ ok:true })
}
