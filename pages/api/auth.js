// pages/api/auth.js
import { supabase }  from '../../lib/supabase'
import jwt           from 'jsonwebtoken'
import { serialize } from 'cookie'

/* 0. простая проверка: id + hash должны быть */
const isValidTg = q => !!q.id && !!q.hash

export default async function handler (req, res) {
  const tg = req.query
  if (!isValidTg(tg)) {
    console.warn('TG payload invalid', tg)
    return res.status(400).send('Bad TG payload')
  }

  /* 1. upsert guest */
  const { data: citizen, error } = await supabase
    .from('citizens')
    .upsert({
      telegram_id     : tg.id,
      username        : tg.username   || null,
      full_name       : tg.first_name || '—',
      status          : 'guest',
      challenge_status: 'inactive'
    }, { onConflict:'telegram_id' })
    .select()
    .single()

  if (error || !citizen) {                         // <-  защита от null
    console.error('SB upsert error', error)
    return res.status(500).send('DB error')
  }

  /* 2. подписываем JWT (если пользуетесь RLS) */
  const token = jwt.sign(
    { sub: tg.id, cid: citizen.id },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn: '7d' }
  )

  /* 3. кладём куки */
  res.setHeader('Set-Cookie', [
    serialize('tg',  Buffer.from(JSON.stringify(tg)).toString('base64'),
      { path:'/', httpOnly:true, maxAge:31536000 }),
    serialize('cid', String(citizen.id),
      { path:'/', httpOnly:true, maxAge:31536000 }),
    serialize('sb_jwt', token,
      { path:'/', httpOnly:true, maxAge:60*60*24*7 })
  ])

  /* 4. redirect */
  res.writeHead(302, { Location:'/challenge?day=1' })
  res.end()
}
