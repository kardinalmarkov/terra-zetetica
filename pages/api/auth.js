// pages/api/auth.js
import crypto from 'crypto'
import { serialize } from 'cookie'          // <-- именованный импорт

const BOT_TOKEN = process.env.BOT_TOKEN

export default function handler(req, res) {
  try {
    if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not defined')
    if (typeof serialize !== 'function') throw new Error('cookie.serialize is undefined')

    const { hash, ...auth } = req.query
    const dataCheck = Object.keys(auth).sort().map(k => `${k}=${auth[k]}`).join('\n')

    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
    const hmac   = crypto.createHmac('sha256', secret).update(dataCheck).digest('hex')
    if (hmac !== hash) return res.status(403).send('❌ Invalid Telegram login')

    const prod = process.env.NODE_ENV === 'production'
    const opts = { httpOnly: true, sameSite: 'lax', path: '/', secure: prod, maxAge: 60*60*24*30 }

    const tgCookie   = serialize('tg',  Buffer.from(JSON.stringify(auth)).toString('base64'), opts)
    const lastCookie = serialize('last_auth', auth.auth_date, { ...opts, httpOnly: false })

    res.setHeader('Set-Cookie', [tgCookie, lastCookie])
    res.setHeader('Cache-Control', 'no-store')
    return res.redirect(302, '/lk')
  } catch (e) {
    console.error('[api/auth] error:', e)
    return res.status(500).send(`Auth error: ${e.message}`)
  }
}
