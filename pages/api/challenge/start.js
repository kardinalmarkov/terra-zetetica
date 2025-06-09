// pages/api/challenge/start.js
import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  // Единственная точка старта челленджа (в том числе для «guest»)
  const { tg, cid } = parse(req.headers.cookie || '')
  if (!tg || !cid) return res.status(401).json({ ok: false, err: 'Не авторизован' })

  // Активируем челлендж у пользователя
  const { error } = await supabase
    .from('citizens')
    .update({ challenge_status: 'active' })
    .eq('id', cid)
  if (error) return res.status(500).json({ ok: false, err: 'Ошибка активации' })

  return res.json({ ok: true })
}
