// pages/api/auth.js
import { supabase } from '../../lib/supabase'
import jwt          from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function handler(req, res) {
  // 1) проверяем Telegram-hash ─ ваша реализация
  const tg = {/* разбираем req.query, проверяем data и hash */} 
  if (!tg) return res.status(401).send('Auth failed')

  // 2) ищем или создаём guest
  let { data: existing } = await supabase
    .from('citizens')
    .select('id,telegram_id')
    .eq('telegram_id', tg.id)
    .maybeSingle()

  if (!existing) {
    const ins = await supabase
      .from('citizens')
      .insert({ telegram_id: tg.id, status:'guest' })
      .select('id')
      .single()
    existing = ins.data
  }

  // 3) сгенерировать JWT с claim cid
  const token = jwt.sign(
    { sub: tg.id, cid: existing.id },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn:'7d' }
  )

  // 4) ставим куки
  res.setHeader('Set-Cookie', [
    serialize('tg', Buffer.from(JSON.stringify(tg)).toString('base64'), { path:'/', httpOnly:true }),
    serialize('cid', String(existing.id), { path:'/', httpOnly:true }),
    serialize('sb_jwt', token, { path:'/', httpOnly:true })
  ])

  // 5) редирект в ЛК
  res.redirect('/lk')
}
