// pages/api/auth.js
// …
import crypto   from 'crypto'
import { supabase } from '../../lib/supabase'
import { serialize } from 'cookie'

const BOT_TOKEN = process.env.BOT_TOKEN    // ← добавьте в Vercel Env vars

export default async function handler (req, res) {
  const { hash, ...tg } = req.query
  if (!hash || !tg.id) return res.status(400).send('Bad request')

  /* 1. проверяем подпись Telegram */
  const checkString = Object.keys(tg).sort().map(k => `${k}=${tg[k]}`).join('\n')
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac   = crypto.createHmac('sha256', secret).update(checkString).digest('hex')
  if (hmac !== hash) return res.status(403).send('Bad hash')

  /* 2. upsert → если записей нет — ставим status='guest' */
  const row = {
    telegram_id : tg.id,
    full_name   : `${tg.first_name ?? ''} ${tg.last_name ?? ''}`.trim(),
    username    : tg.username ?? null,
    photo_url   : tg.photo_url ?? null,
    status      : 'guest',                // «гость» до получения гражданства
    last_auth   : new Date(Number(tg.auth_date) * 1e3).toISOString()
  }

  let { data, error } = await supabase
      .from('citizens')
      .upsert(row, { onConflict:'telegram_id', merge:['full_name','username','photo_url','last_auth'] })
      .select('id')
      .maybeSingle()

  if (!data) {
    const r = await supabase.from('citizens').select('id').eq('telegram_id', tg.id).single()
    data  = r.data
    error = r.error
  }
  if (error || !data?.id) return res.status(500).send('DB error')

  /* 3. ставим куки и переводим в /ckallenge */
  const opts = { path:'/', httpOnly:true, sameSite:'lax', secure:true, maxAge:60*60*24*30 }
  res.setHeader('Set-Cookie', [
    serialize('tg',  Buffer.from(JSON.stringify(tg)).toString('base64'), opts),
    serialize('cid', data.id.toString(),                               opts)
  ])
  return res.redirect(302, '/challenge')
}
