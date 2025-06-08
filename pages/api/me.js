// pages/api/me.js
import { parse } from 'cookie'
import { supabase } from '@/lib/supabase'

export default async function handler(req,res){
  const { tg, cid } = parse(req.headers.cookie ?? '')
  if (!tg || !cid) return res.status(401).json({error:'no_auth'})

  // базовые данные Telegram
  const telegram = JSON.parse(Buffer.from(tg,'base64').toString())

  // расширенные поля из БД
  const { data: citizen } = await supabase
    .from('citizens').select('*').eq('id', cid).single()

  res.json({ telegram, citizen, last_auth: parseInt(parse(req.headers.cookie).last_auth) })
}
