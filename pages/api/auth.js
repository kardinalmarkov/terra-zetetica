// pages/api/auth.js
import { supabase } from '../../lib/supabase'
import jwt          from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function handler(req, res) {
  // 1) Validate Telegram hash here (omitted for brevity)
  const { hash, ...tg } = req.query
  if (!tg.id || !hash) return res.status(401).send('Auth failed')

  // 2) Find or insert guest
  let { data: existing } = await supabase
    .from('citizens')
    .select('id, telegram_id')
    .eq('telegram_id', tg.id)
    .maybeSingle()

  if (!existing) {
    const ins = await supabase
      .from('citizens')
      .insert({ telegram_id: tg.id, status: 'guest', full_name: tg.first_name })
      .select('id')
      .single()
    existing = ins.data
  }

  // 3) Issue JWT for Supabase client and RLS
  const token = jwt.sign(
    { sub: tg.id, cid: existing.id },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn: '7d' }
  )

  // 4) Set cookies: tg, cid, sb_jwt
  res.setHeader('Set-Cookie', [
    serialize('tg',    Buffer.from(JSON.stringify(tg)).toString('base64'), { path:'/', httpOnly:true }),
    serialize('cid',   String(existing.id),                                { path:'/', httpOnly:true }),
    serialize('sb_jwt', token,                                               { path:'/', httpOnly:true }),
  ])

  // 5) Redirect back to where user left off (e.g. challenge)
  res.redirect(302, '/challenge')
}