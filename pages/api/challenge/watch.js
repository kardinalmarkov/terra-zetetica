// pages/api/challenge/watch.js
import { supabase } from '../../../lib/supabase'
import { parse }    from 'cookie'

export default async function handler (req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow','POST')
    return res.status(200).json({ ok:false })
  }

  const { tg , cid } = parse(req.headers.cookie||'')
  if (!tg || !cid)     return res.json({ ok:false, err:'auth' })

  const { day , reply='' } = req.body
  if (!day) return res.json({ ok:false, err:'bad-day' })

  await supabase.from('daily_progress').upsert({
    citizen_id : Number(cid),
    day_no     : Number(day),
    answer     : reply
  })

  if (+day===14)
    await supabase.from('citizens')
      .update({ challenge_status:'finished' })
      .eq('id', cid)

  res.json({ ok:true })
}
