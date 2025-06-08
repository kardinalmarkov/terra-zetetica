// pages/api/me.js
import cookie from 'cookie'

export default function handler(req, res) {
  const { tg: tgRaw, last_auth } = cookie.parse(req.headers.cookie || '')
  if (!tgRaw) return res.status(401).json({ error: 'no_auth' })

  let telegram
  try {
    telegram = JSON.parse(Buffer.from(tgRaw, 'base64').toString())
  } catch {
    return res.status(400).json({ error: 'invalid_tg_cookie' })
  }

  res.json({
    telegram,
    last_auth: last_auth ? Number(last_auth) : null
  })
}
