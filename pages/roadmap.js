import Head from 'next/head'

const roadmap = [
  {
    quarter: 'Весна–Лето 2025',
    items: [
      { label: '📜 Конституция и цифровая основа проекта', status: '✅' },
      { label: '🪪 NFT-Паспорт гражданина v1.0', status: '✅' },
      { label: '🏡 Первые анклавы (Дом Истины и др.)', status: '✅' },
      { label: '🔗 CID-реестр документов (через IPFS)', status: '✅' },
      { label: '🧩 Публичный сайт + репозиторий на GitHub', status: '🔄' },
      { label: '🏁 Флаг, герб, девиз Terra Zetetica', status: '🔄' },
    ],
  },
  {
    quarter: 'Осень 2025 – Весна 2026',
    items: [
      { label: '🧭 Интерактивная карта анклавов с метками', status: '✅' },
      { label: '🌀 Поисковик z-search на SearxNG (без слежки)', status: '✅' },
      { label: '📬 Форма связи с кураторами анклавов', status: '✅' },
      { label: '🆔 Автоматизация выдачи Z-ID через бота', status: '✅' },
      { label: '📌 10+ зарегистрированных анклавов', status: '🔄' },
      { label: '📋 Базовая DAO-система (Snapshot)', status: '🔄' },
      { label: '🎓 Курсы Академии Зететики', status: '🛠️' },
      { label: '🗣️ Комьюнити (🔄 Discord, ✅ Telegram, 🔄 форум)', status: '🔄' },
    ],
  },
  {
    quarter: '2026 и далее',
    items: [
      '✴️ Дипломатия (в том числе UNPO, другие платформы)',
      '🏛 Конференции, офлайн и онлайн-собрания',
      '📜 Конституция 2.0 (с DAO-правками)',
      '🧭 Исследования ЗаКуполья (DAO-экспедиции)',
      '🗳️ Цифровые голосования (zk-ID и децентрализация)',
      '🏰 Центральный анклав на физической земле',
      '📦 Платформа для обмена ресурсами между гражданами',
      '🌱 Проекты по самодостаточности (агро, энергия, мастерские)',
    ],
  },
]

export default function Roadmap() {
  return (
    <main className="wrapper">
      <Head><title>Дорожная карта | Terra Zetetica</title></Head>
      <h1>🗺️ Дорожная карта Terra Zetetica</h1>
      <p>Версия: 2025–2026</p>

      {roadmap.map(({ quarter, items }) => (
        <section key={quarter} style={{ marginTop: '2rem' }}>
          <h2 className="text-xl font-bold mb-2">{quarter}</h2>
          <ul className="list-disc pl-5 space-y-1">
            {items.map((it, i) => (
              <li key={i}>
                {typeof it === 'string' ? it : `${it.status} ${it.label}`}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Ключевые этапы развития
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            🗺️ <strong>Вступление в UNPO</strong><br/>
            Получение международного признания
          </li>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            🏝️ <strong>Аренда острова</strong><br/>
            Создание суверенного анклава на 99 лет
          </li>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            🏫 <strong>Регистрация анклавов</strong><br/>
            Как официальных НКО и школ
          </li>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            📜 <strong>Паспорта и ID на блокчейне</strong><br/>
            Верификация и защита данных через IPFS
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-2">🔧 Что можем улучшить вместе?</h2>
        <p>Ознакомьтесь с нашим <a href="/checklist" className="text-blue-600 underline">чек-листом гражданина</a> и напишите предложения через <a href="/contact" className="text-blue-600 underline">форму обратной связи</a>.</p>
      </section>
    </main>
  )
}
