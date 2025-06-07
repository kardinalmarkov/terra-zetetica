// pages/api/me.js
import { getCitizenById } from '../../lib/db'

export default async function handler(req, res) {
  const telegramId = req.cookies.telegram_id

  if (!telegramId) {
    return res.status(401).json({ user: null })
  }

  const citizen = await getCitizenById(telegramId)
  if (!citizen) {
    return res.status(404).json({ user: null })
  }

  res.status(200).json({
    user: {
      telegram_id: citizen.telegram_id,
      full_name: citizen.full_name,
      zetetic_id: citizen.zetetic_id,
      status: citizen.status,
      ipfs_url: citizen.ipfs_url
    }
  })
}
