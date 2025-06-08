// pages/api/auth.js
import crypto from 'crypto'
import cookie from 'cookie'

const BOT_TOKEN = process.env.BOT_TOKEN

function isValid(data) {
  const { hash, ...auth } = data
  const dataCheck = Object.keys(auth).sort().map(k => `${k}=${auth[k]}`).join('\n')
  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac   = crypto.createHmac('sha256', secret).update(dataCheck).digest('hex')
  return hmac === hash
}

export default function handler(req, res) {
  const data = req.query
  if (!isValid(data)) return res.status(403).send('Invalid Telegram login')

  // Сохраняем всё, кроме hash, в base64-cookie
  const { hash, ...publicFields } = data
  const tgEncoded = Buffer.from(JSON.stringify(publicFields)).toString('base64')

  const prod = process.env.NODE_ENV === 'production'
  const opts = { httpOnly: true, sameSite: 'lax', path: '/', secure: prod }

  res.setHeader('Set-Cookie', cookie.serialize('tg', tgEncoded, opts))
  res.setHeader('Cache-Control', 'no-store')
  return res.redirect('/lk')
}
