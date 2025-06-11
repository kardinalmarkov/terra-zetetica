// pages/api/challenge/mark.js
import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end()

  const { cid } = parse(req.headers.cookie||'')
  if(!cid)       return res.status(401).json({ ok:false, error:'login' })

  const { dayNo, notes='' } = req.body || {}
  if(!dayNo)     return res.status(400).json({ ok:false, error:'day?' })

  // ⬇︎ одна строка на (citizen, day)
  const { error } = await supabase
    .from('daily_progress')
    .upsert(
      { citizen_id:+cid, day_no:+dayNo, notes },
      { onConflict:'citizen_id,day_no' })
  if(error) return res.status(500).json({ ok:false, error:error.message })

  // для триггера progress_pct
  await supabase.rpc('upd_progress_pct')  // если нужен форс-пересчёт

  res.json({ ok:true })
}
