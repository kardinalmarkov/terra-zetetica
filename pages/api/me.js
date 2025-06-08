// pages/api/me.js
export default function handler(req, res) {
  const cookies = req.headers.cookie
  if (!cookies) return res.status(401).json({ error: 'No cookie' })

  const user = {}
  cookies.split(';').forEach(c => {
    const [key, value] = c.trim().split('=')
    user[key] = decodeURIComponent(value)
  })

  if (!user.telegram_id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  res.json({
    telegram_id: user.telegram_id,
    first_name: user.user_name,
    username: user.username || null
  })
}
