/* pages/api/me.js */
import cookie from 'cookie'

export default function handler(req, res) {
  const { tg, last_auth } = cookie.parse(req.headers.cookie || '')
  if (!tg) return res.status(401).json({ error: 'no_auth' })

  try {
    const telegram = JSON.parse(Buffer.from(tg, 'base64').toString())
    res.json({ telegram, last_auth: last_auth ? Number(last_auth) : null })
  } catch {
    res.status(400).json({ error: 'invalid_tg_cookie' })
  }
}
