// pages/api/challenge/start.js
import { parse, serialize } from 'cookie'
import { supabase }         from '../../../lib/supabase'

// ⚠️ вызывается из ЛК кнопкой «Начать челлендж»
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { tg, cid } = parse(req.headers.cookie ?? '')
  if (!tg) return res.status(401).end()                  // не авторизован в Telegram

  const t   = JSON.parse(Buffer.from(tg,'base64').toString())
  let   id  = cid                                       // id гражданина (может быть уже в куке)

  // ─── ищем / создаём citizen ───────────────────────────────────────────────
  if (!id) {
    const { data: exist } = await supabase
      .from('citizens')
      .select('id')
      .eq('telegram_id', t.id)
      .maybeSingle()

    if (exist) {
      id = exist.id
    } else {
      const ins = await supabase
        .from('citizens')
        .insert({
          telegram_id     : t.id,
          full_name       : t.first_name,
          username        : t.username ?? null,
          photo_url       : t.photo_url ?? null,
          status          : 'guest',
          challenge_status: 'active',
          timestamp       : new Date()
        })
        .select('id')
        .single()
      if (ins.error) return res.status(500).json({ error: ins.error.message })
      id = ins.data.id
    }
    // прописываем куку cid, чтобы остальные роуты сразу работали
    res.setHeader('Set-Cookie', serialize('cid', String(id), { path:'/', httpOnly:true }))
  }

  // если запись была, просто переводим challenge_status → active
  await supabase
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('id', id)
    .neq('challenge_status', 'active')

  res.json({ ok:true })
}
