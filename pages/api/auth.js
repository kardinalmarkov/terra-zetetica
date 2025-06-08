// pages/api/auth.js
import crypto from 'crypto'
import { serialize } from 'cookie'
import { supabase } from '@/lib/supabase'

const BOT_TOKEN = process.env.BOT_TOKEN

export default async function handler(req, res) {
  try {
    const { hash, ...tg } = req.query                           // 1. валидация
    const data = Object.keys(tg).sort().map(k=>`${k}=${tg[k]}`).join('\n')
    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
    const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex')
    if (hmac !== hash) return res.status(403).send('Bad hash')

    // 2. upsert гражданина
    const { data: citizen } = await supabase
      .from('citizens')
      .upsert({
        telegram_id: tg.id,
        full_name: `${tg.first_name ?? ''} ${tg.last_name ?? ''}`.trim(),
        username: tg.username,
        photo_url: tg.photo_url
      }, { onConflict: 'telegram_id', merge: ['full_name','username','photo_url'] })
      .select('id')
      .single()

    // 3. пишем куки
    const opts = { httpOnly:true, sameSite:'lax', path:'/', secure:true, maxAge:60*60*24*30 }
    res.setHeader('Set-Cookie', [
      serialize('tg',  Buffer.from(JSON.stringify(tg)).toString('base64'), opts),
      serialize('cid', citizen.id.toString(), opts),
      serialize('last_auth', tg.auth_date, { ...opts, httpOnly:false })
    ])
    res.redirect(302, '/lk')
  } catch (e) {
    console.error('[api/auth]', e)
    res.status(500).send(`Auth error: ${e.message}`)
  }
}
