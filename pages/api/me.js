// pages/api/me.js
export default async function handler(req, res) {
  const telegramId = req.cookies.telegram_id

  if (!telegramId) {
    return res.status(401).json({ user: null })
  }

  try {
    const apiUrl = `http://91.243.71.199:5050/api/user/${telegramId}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const user = await response.json()
      return res.status(200).json({ user })
    }

    // 🧭 Если не найден в БД — создаём временный профиль
    return res.status(200).json({
      user: {
        telegram_id: telegramId,
        full_name: 'Гость Zetetica',
        status: 'незарегистрирован',
        zetetic_id: null,
        ipfs_url: null
      }
    })
  } catch (error) {
    return res.status(500).json({ user: null })
  }
}
