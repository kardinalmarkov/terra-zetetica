// pages/api/auth.js
import crypto from 'crypto'
import cookie from 'cookie'

const BOT_TOKEN = process.env.BOT_TOKEN

// Проверяем, что данные от Telegram не подделаны
function validateTelegramAuth(data) {
  const { hash, ...authData } = data
  const dataCheckString = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`)
    .join('\n')

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex')

  return hmac === hash
}

export default function handler(req, res) {
  const data = req.query

  if (!validateTelegramAuth(data)) {
    return res.status(403).send('Invalid Telegram login')
  }

  // Убираем hash и кодируем всё остальное в Base64
  const { hash, ...publicFields } = data
  const tgEncoded = Buffer.from(JSON.stringify(publicFields)).toString('base64')

  const prod = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: prod,
    maxAge: 60 * 60 * 24 * 30, // 30 дней
    // в продакшене фиксируем домен, чтобы cookie ставилось на все поддомены:
    domain: prod ? '.terra-zetetica.org' : undefined,
  }

  res.setHeader('Set-Cookie', cookie.serialize('tg', tgEncoded, cookieOptions))
  res.setHeader('Cache-Control', 'no-store')
  res.redirect(302, '/lk')
}
