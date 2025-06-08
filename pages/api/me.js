// pages/api/me.js  ✅ рабочая версия
import cookie from 'cookie'

export default function handler(req, res) {
  const { tg: raw, last_auth } = cookie.parse(req.headers.cookie || '')
  if (!raw) return res.status(401).json({ error: 'no_auth' })

  try {
    const telegram = JSON.parse(Buffer.from(raw, 'base64').toString())
    res.json({ telegram, last_auth: last_auth ? Number(last_auth) : null })
  } catch {
    res.status(400).json({ error: 'invalid_tg_cookie' })
  }
}
