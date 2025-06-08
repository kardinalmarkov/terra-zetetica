// pages/api/me.js
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import cookie from 'cookie'
import path from 'path'

const dbPromise = open({
  filename: path.resolve(process.cwd(), 'citizens.db'),
  driver: sqlite3.Database
})

export default async function handler(req, res) {
  const parsed = cookie.parse(req.headers.cookie || '')
  if (!parsed.tg) return res.status(401).json({ error: 'no_auth' })

  const tg = JSON.parse(Buffer.from(parsed.tg, 'base64').toString())

  const db = await dbPromise
  const citizen = await db.get(
    'SELECT full_name, zetetic_id, ipfs_url, status FROM citizens WHERE telegram_id = ?',
    tg.id.toString()
  )

  return res.json({ telegram: tg, citizen: citizen || null })
}
