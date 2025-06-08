// pages/api/auth.js
import crypto from 'crypto'
import cookie from 'cookie'

const BOT_TOKEN = process.env.BOT_TOKEN

export default function handler(req, res) {
  // 1. Получаем данные из виджета
  const data = req.query
  const { hash, ...authData } = data

  // 2. Проверяем подпись
  const dataCheckString = Object.keys(authData)
    .sort()
    .map(k => `${k}=${authData[k]}`)
    .join('\n')

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac = crypto.createHmac('sha256', secret)
                     .update(dataCheckString)
                     .digest('hex')

  if (hmac !== hash) {
    return res.status(403).send('❌ Invalid Telegram login')
  }

  // 3. Кодируем все поля (кроме hash) в одну cookie
  const tgPayload = Buffer.from(JSON.stringify(authData)).toString('base64')
  const prod = process.env.NODE_ENV === 'production'
  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: prod,
    maxAge: 60 * 60 * 24 * 30,       // 30 дней
    domain: prod ? '.terra-zetetica.org' : undefined
  }

  res.setHeader('Set-Cookie', cookie.serialize('tg', tgPayload, cookieOpts))
  res.setHeader('Cache-Control', 'no-store')
  res.redirect(302, '/lk')
}
