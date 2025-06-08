// pages/api/me.js
import cookie from 'cookie'

export default function handler(req, res) {
  // Парсим все cookie из заголовка
  const cookies = cookie.parse(req.headers.cookie || '')
  const tgEncoded = cookies.tg

  if (!tgEncoded) {
    // Нет авторизации
    return res.status(401).json({ error: 'no_auth' })
  }

  let telegram
  try {
    // Base64 → JSON
    const json = Buffer.from(tgEncoded, 'base64').toString('utf-8')
    telegram = JSON.parse(json)
  } catch (e) {
    return res.status(400).json({ error: 'invalid_tg_cookie' })
  }

  // Отдаем все доступные поля
  return res.status(200).json({ telegram })
}
