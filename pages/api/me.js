// pages/api/me.js
import cookie from 'cookie'

export default function handler(req, res) {
  // 1. Читаем cookie
  const cookies = cookie.parse(req.headers.cookie || '')
  const tgEncoded = cookies.tg

  if (!tgEncoded) {
    return res.status(401).json({ error: 'no_auth' })
  }

  // 2. Декодируем Base64 → JSON
  let telegram
  try {
    const json = Buffer.from(tgEncoded, 'base64').toString('utf-8')
    telegram = JSON.parse(json)
  } catch {
    return res.status(400).json({ error: 'invalid_tg_cookie' })
  }

  // 3. Отдаём все доступные поля Telegram
  return res.status(200).json({ telegram })
}
