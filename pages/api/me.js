// pages/api/me.js  ✅ рабочая версия
const cookie = require('cookie')

module.exports = function handler(req, res) {
  const { tg: raw, last_auth } = cookie.parse(req.headers.cookie || '')
  if (!raw) return res.status(401).json({ error: 'no_auth' })

  let telegram
  try {
    telegram = JSON.parse(Buffer.from(raw, 'base64').toString())
  } catch {
    return res.status(400).json({ error: 'invalid_tg_cookie' })
  }

  res.json({ telegram, last_auth: last_auth ? Number(last_auth) : null })
}
