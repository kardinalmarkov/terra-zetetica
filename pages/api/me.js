// pages/api/me.js
import cookie from 'cookie'

export default function handler(req, res) {
  // Парсим cookie
  const { tg: tgEncoded } = cookie.parse(req.headers.cookie || '')
  if (!tgEncoded) {
    return res.status(401).json({ error: 'Не авторизован' })
  }

  // Декодируем Base64 и парсим JSON
  let telegramData
  try {
    const json = Buffer.from(tgEncoded, 'base64').toString('utf-8')
    telegramData = JSON.parse(json)
  } catch (e) {
    return res.status(400).json({ error: 'Неверные данные Telegram' })
  }

  // Возвращаем все доступные поля из Telegram
  return res.status(200).json({ telegram: telegramData })
}
