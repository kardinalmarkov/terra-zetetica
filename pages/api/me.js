// pages/api/me.js
import { parse } from 'cookie'
import { supabase } from '../../lib/supabase.js'



export default async function handler(req, res) {
  const { tg, cid, last_auth = 0 } = parse(req.headers.cookie ?? '')
  if (!tg || !cid) return res.status(401).json({ error:'no_auth' })

  const telegram = JSON.parse(Buffer.from(tg, 'base64').toString())
  const { data: citizen } = await supabase
    .from('citizens').select('*').eq('id', cid).single()

  res.json({ telegram, citizen, last_auth:Number(last_auth) })
}
