// pages/api/auth.js
import crypto from 'crypto'

const BOT_TOKEN = process.env.BOT_TOKEN
const SECRET_KEY = process.env.SECRET_KEY || 'supersecret'

function validateTelegramAuth(data) {
  const authData = { ...data }
  const hash = authData.hash
  delete authData.hash

  const dataCheckString = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`)
    .join('\n')

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')

  return hmac === hash
}

export default async function handler(req, res) {
  const { query } = req

  console.log('[auth] query:', query) // 👉 Добавь для отладки

  if (!validateTelegramAuth(query)) {
    return res.status(403).send('Invalid Telegram login')
  }

  res.setHeader(
    'Set-Cookie',
    `telegram_id=${query.id}; Path=/; HttpOnly; SameSite=Lax; Secure`
  )

  res.redirect('/lk')
}
