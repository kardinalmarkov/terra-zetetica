// pages/api/auth.js
import crypto from 'crypto'

const BOT_TOKEN = process.env.BOT_TOKEN

function validateTelegramAuth(data) {
  const { hash, ...authData } = data
  const dataCheckString = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`)
    .join('\n')

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')

  return hmac === hash
}

export default function handler(req, res) {
  const data = req.query

  if (!validateTelegramAuth(data)) {
    return res.status(403).send('❌ Invalid Telegram login')
  }

  const userData = {
    id: data.id,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    photo_url: data.photo_url
  }

  res.setHeader('Set-Cookie', [
    `telegram_id=${userData.id}; Path=/; HttpOnly; SameSite=Lax`,
    `user_name=${encodeURIComponent(userData.first_name)}; Path=/; SameSite=Lax`,
    `username=${userData.username || ''}; Path=/; SameSite=Lax`
  ])

  res.setHeader('Cache-Control', 'no-store')
  res.redirect('/lk')
}
