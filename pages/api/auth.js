// pages/api/auth.js
import crypto from 'crypto'
import cookie from 'cookie'

const BOT_TOKEN = process.env.BOT_TOKEN

export default function handler(req, res) {
  try {
    if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not defined')

    const { hash, ...auth } = req.query            // всё, что прислал виджет
    const dataCheck = Object.keys(auth).sort().map(k => `${k}=${auth[k]}`).join('\n')

    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
    const hmac   = crypto.createHmac('sha256', secret).update(dataCheck).digest('hex')
    if (hmac !== hash) return res.status(403).send('❌ Invalid Telegram login')

    const prod = process.env.NODE_ENV === 'production'
    const opts = { httpOnly: true, sameSite: 'lax', path: '/', secure: prod, maxAge: 60*60*24*30 }

    // cookie с данными Telegram (без hash)
    const tg = cookie.serialize('tg', Buffer.from(JSON.stringify(auth)).toString('base64'), opts)

    // cookie с последней датой входа (доступна JS-коду на клиенте)
    const last = cookie.serialize(
      'last_auth',
      auth.auth_date,
      { sameSite: 'lax', path: '/', secure: prod, maxAge: 60*60*24*30 }
    )

    res.setHeader('Set-Cookie', [tg, last])
    res.setHeader('Cache-Control', 'no-store')
    return res.redirect(302, '/lk')
  } catch (e) {
    console.error('[api/auth] error:', e)
    return res.status(500).send(`Auth error: ${e.message}`)
  }
}
