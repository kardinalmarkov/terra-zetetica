// pages/api/challenge/watch.js
import { supabase } from '../../../lib/supabase'
import { parse }    from 'cookie'

export default async function handler (req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { tg, cid } = parse(req.headers.cookie || '')
  if (!tg || !cid)   return res.status(401).end()

  const { day, reply } = req.body               // { day: 3, reply: 'Горизонт' }
  if (!day) return res.status(400).end()

  /* ─── сверяем ответ ─── */
  const { data: m } = await supabase
    .from('daily_materials')
    .select('answer')
    .eq('day_no', day)
    .single()

  const ok = m?.answer
    ? m.answer.trim().toLowerCase() === reply.trim().toLowerCase()
    : true                                // если вопроса нет – зачёт всегда

  if (!ok) return res.status(400).json({ ok: false, err: 'wrong' })

  /* ─── фиксируем прогресс ─── */
  await supabase
    .from('daily_progress')
    .upsert({
      citizen_id: Number(cid),
      day_no:     day,
      answer:     reply,           // ✔️ правильный ключ
    })

  /* ─── последний день – меняем статус ─── */
  if (day === 14) {
    await supabase
      .from('citizens')
      .update({ challenge_status: 'finished' })
      .eq('id', cid)
  }

  res.json({ ok: true })
}
