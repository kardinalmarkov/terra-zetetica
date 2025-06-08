// pages/api/me.js
import { parse } from 'cookie'           // ← named import

export default function handler(req, res) {
  const cookies = parse(req.headers.cookie || '')
  const raw = cookies.tg
  if (!raw) return res.status(401).json({ error: 'no_auth' })

  let telegram
  try {
    telegram = JSON.parse(Buffer.from(raw, 'base64').toString())
  } catch {
    return res.status(400).json({ error: 'invalid_tg_cookie' })
  }

  return res.json({
    telegram,
    last_auth: cookies.last_auth ? Number(cookies.last_auth) : null
  })
}
