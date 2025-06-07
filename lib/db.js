// lib/db.js
import sqlite3 from 'sqlite3'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'citizens.db')
const db = new sqlite3.Database(dbPath)

export function getCitizenById(telegramId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM citizens WHERE telegram_id = ?', [telegramId], (err, row) => {
      if (err) return reject(err)
      resolve(row)
    })
  })
}
