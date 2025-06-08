// pages/api/challenge/start.js
import { supabase } from '../../../lib/supabase'
import { parse } from 'cookie'

export default async function handler (req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')

  const { tg } = parse(req.headers.cookie || '')
  if (!tg) return res.status(401).send('Not auth')

  const { id } = JSON.parse(Buffer.from(tg,'base64').toString())

  await supabase
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('telegram_id', id)

  res.json({ ok:true })
}
