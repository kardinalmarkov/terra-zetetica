// pages/api/auth.js
//
// Принимает query-строку Telegram-виджета, создаёт (или находит)
// гостя в таблице citizens, ставит куки и редиректит в первый день
// челленджа.
//
//  • tg-кука  – base64-объект Telegram (для Nav, аватарки и т.д.)
//  • cid      – id гражданина / гостя
//  • sb_jwt   – JWT, который потом можно передавать
//               в Supabase клиент для RLS-запросов.
//
import { supabase }  from '../../lib/supabase'
import jwt           from 'jsonwebtoken'
import { serialize } from 'cookie'

// небольшой helper-валидатор; реальную проверку hash опустили
const isValidTg = q => q.id && q.hash

export default async function handler (req, res) {
  const tg = req.query           // всё, что прилетело из Telegram Login
  if (!isValidTg(tg)) return res.status(400).send('Bad TG payload')

  /* 1️⃣ upsert «guest»-гражданина по telegram_id */
  const { data: citizen } = await supabase
    .from('citizens')
    .upsert({
      telegram_id     : tg.id,
      username        : tg.username      || null,
      full_name       : tg.first_name    || '—',
      status          : 'guest',
      challenge_status: 'inactive'
    }, { onConflict: 'telegram_id' })
    .select()
    .single()

  /* 2️⃣ подпишем JWT (если нужен RLS) */
  const token = jwt.sign(
    { sub: tg.id, cid: citizen.id },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn: '7d' }
  )

  /* 3️⃣ кладём куки */
  res.setHeader('Set-Cookie', [
    serialize('tg',
      Buffer.from(JSON.stringify(tg)).toString('base64'),
      { path:'/', httpOnly:true, maxAge:31536000 }),      // 1 год

    serialize('cid', String(citizen.id),
      { path:'/', httpOnly:true, maxAge:31536000 }),

    serialize('sb_jwt', token,
      { path:'/', httpOnly:true, maxAge:60*60*24*7 })
  ])

  /* 4️⃣ редирект сразу в первый день */
  res.writeHead(302, { Location:'/challenge?day=1' })
  res.end()
}
