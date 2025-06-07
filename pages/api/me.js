// pages/api/me.js

export default async function handler(req, res) {
  const telegramId = req.cookies.telegram_id

  // 🔧 Заглушка: если нет ID, возвращаем тестового пользователя
  if (!telegramId || telegramId === 'test') {
    return res.status(200).json({
      user: {
        telegram_id: 'test',
        full_name: 'Тестовый гражданин',
        zetetic_id: 'ZID-0001',
        status: 'тестовый режим',
        ipfs_url: 'https://gateway.pinata.cloud/ipfs/exampleCID'
      }
    })
  }

  // ⛔ Если не заглушка, но ID не найден — выдаём пусто
  return res.status(404).json({ user: null })
}
