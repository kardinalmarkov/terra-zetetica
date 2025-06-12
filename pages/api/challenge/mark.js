// pages/api/challenge/mark.js
import { parse } from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler (req, res) {
  if (req.method!=='POST') return res.status(405).end()
  const { cid } = parse(req.headers.cookie||'')
  const { day, note='' } = req.body
  if (!cid || !day) return res.status(400).json({ error:'bad args' })
  if (note.length > 1000)           return res.status(400).json({ error:'long' })

  /* 1. upsert заметку (в progress.notes) */
  const { error:e1 } = await supabase
    .from('daily_progress')
    .upsert({ citizen_id:cid, day_no:day, notes:note }, { onConflict:'citizen_id,day_no' })
  if (e1) return res.status(500).json({ error:e1.message })

  /* 2. переводим челлендж в active (но НЕ трогаем status!) */
  await supabase.from('citizens')
    .update({ challenge_status:'active' })
    .eq('id',cid).in('challenge_status',['inactive',null])

  res.json({ ok:true })
}
