// pages/api/me.js
export default async function handler(req, res) {
  const telegramId = req.cookies.telegram_id

  if (!telegramId) {
    return res.status(401).json({ user: null })
  }

  try {
    const apiUrl = `http://91.243.71.199:5050/api/user/${telegramId}` // 👈 укажи IP и порт!
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('User not found')
    const user = await response.json()

    res.status(200).json({ user })
  } catch (error) {
    res.status(404).json({ user: null })
  }
}
