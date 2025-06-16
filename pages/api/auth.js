// pages/api/auth.js          v2.4 • 25 Jun 2025
//
//  ‣ Если citizen уже есть  →  status НЕ меняем
//  ‣ Если записи нет        →  вставляем guest + challenge_status='inactive'
//  ‣ JWT кладём в sb_jwt (используется RLS)

import { supabase }  from '../../lib/supabase'
import jwt           from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function handler(req, res) {
  const tg = req.query                      // ?id=…&first_name=…&hash=…
  if (!tg.id || !tg.hash)
    return res.status(400).send('bad-tg-params')

  /* ---------- upsert ---------------------------------------------------- */
  const guest = {
    telegram_id  : tg.id,
    username     : tg.username    || null,
    photo_url    : tg.photo_url   || null,
    full_name    : tg.first_name  || '—',
    status       : 'guest',             // ← используется ТОЛЬКО при insert
    challenge_status : 'inactive'
  }

  let { data: citizen, error } = await supabase
    .from('citizens')
    .upsert(
      guest,
      {
        onConflict      : 'telegram_id',
        ignoreDuplicates: false,
        updateColumns   : ['username', 'photo_url', 'full_name'] // status не затрагиваем
      }
    )
    .select()
    .single()

  /* если нарушение unique-констрейнта (id уже есть) ---------------------- */
  if (error && error.code === '23505') {
    const r = await supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id', tg.id)
      .single()
    citizen = r.data
    error   = r.error
  }

  if (error || !citizen) {
    console.error('auth > supabase error:', error)
    return res.status(500).send('db error')
  }

  /* ---------- JWT ------------------------------------------------------- */
  const sbJwt = jwt.sign(
    { sub: tg.id, cid: citizen.id },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn: '7d' }
  )

  /* ---------- cookies --------------------------------------------------- */
  res.setHeader('Set-Cookie', [
    serialize('tg' , Buffer.from(JSON.stringify(tg)).toString('base64'), {
      path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 365 }),
    serialize('cid', String(citizen.id), {
      path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 365 }),
    serialize('sb_jwt', sbJwt, {
      path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7   })
  ])

  /* ---------- GO! ------------------------------------------------------- */
  res.writeHead(302, { Location: '/challenge?day=1' })
  res.end()
}
