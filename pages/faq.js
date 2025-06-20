// pages/faq.js — версия 2.3
// ─────────────────────────────────────────────────────────────
// Полный список вопросов (оригинальные + новые) + ссылки ↗

import Head from 'next/head'
import { useState } from 'react'
import Link from 'next/link'

// 👉 Материалы FAQ. Если нужен «без ссылки», оставляем строкой.
const faqList = [
  {
    q: 'Что такое Terra Zetetica?',
    a: `Это государство, основанное на Истине, зететизме и свободе. 
        Мы объединяем людей, которые отвергают догмы и следуют наблюдаемой реальности.`
  },
  {
    q: 'Где можно увидеть Конституцию?',
    a: (
      <>
        Конституция закреплена в IPFS.{' '}
        ➡️{' '}
        <Link href="/constitution" target="_blank" rel="noopener noreferrer">Раздел Конституция ↗</Link>{' '}·{' '}
        📜{' '}
        <a href="/constitution-terra-zetetica-1-2.pdf" target="_blank" rel="noopener noreferrer">PDF версии ↗</a>
      </>
    )
  },  
  {
    q: 'Как стать гражданином?',
    a: (
      <>
        Подайте заявку на странице{' '}
        <Link href="/apply" target="_blank" rel="noopener noreferrer">
          🪪 Стать гражданином ↗
        </Link>{' '}– получите Zetetic&nbsp;ID и далее NFT‑паспорт.
      </>
    )
  },
  {
    q: 'Что такое Z-ID?',
    a: `Zetetic ID — цифровой идентификатор гражданина Terra Zetetica, связанный с вашей заявкой.`
  },
  {
    q: 'Зачем нужен NFT-паспорт?',
    a: `Он доказывает гражданство, даёт доступ в DAO и содержит QR‑код с IPFS‑ссылкой.`
  },
  {
    q: 'Что такое DAO?',
    a: `DAO — децентрализованная система принятия решений через прямое голосование граждан.`
  },
  {
    q: 'Где находятся анклавы?',
    a: `Первые анклавы: Санкт‑Петербург (Россия) и Брестская область (Белоруссия). Интерактивная карта — в разработке.`
  },
  {
    q: 'Можно ли жить в анклаве?',
    a: `Да. Каждый анклав живёт по Конституции; правила утверждает владелец с одобрением DAO.`
  },
  {
    q: 'Признаётся ли гражданство другими странами?',
    a: `Пока нет. Terra Zetetica — добровольное цифровое гражданство, не отменяющее ваши национальные паспорта.`
  },
  {
    q: 'Сколько стоит паспорт?',
    a: `Базовый PDF‑паспорт выдаётся бесплатно.`
  },
  {
    q: 'Что такое IPFS?',
    a: `IPFS — децентрализованное хранилище; ваш паспорт хранится там под уникальным CID.`
  },
  {
    q: 'Как пройти челлендж «Докажи шар — получи дом»?',
    a: (
      <>
        Перейдите на страницу{' '}
        <Link href="/dom" target="_blank" rel="noopener noreferrer">🏠 Челленджа ↗</Link>{' '}и следуйте 14‑дневной программе.
      </>
    )
  },
  {
    q: 'Где посмотреть Дорожную карту проекта?',
    a: (
      <>
        Полный план развития находится в разделе{' '}
        <Link href="/roadmap" target="_blank" rel="noopener noreferrer">🗺️ Дорожная карта ↗</Link>.
      </>
    )
  },
  {
    q: 'Где взять материалы для исследований?',
    a: (
      <>
        Собранный архив экспериментов и документации — на странице{' '}
        <Link href="/materials" target="_blank" rel="noopener noreferrer">📚 Материалы ↗</Link>.
      </>
    )
  },
]

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <>
      <Head><title>FAQ | Terra Zetetica</title></Head>
      <main className="wrapper" style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🧭 Часто задаваемые вопросы</h1>
        <div className="accordion">
          {faqList.map((item, i) => (
            <section key={i} className={openIdx === i ? 'open' : ''}>
              <h2 onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ cursor: 'pointer' }}>
                {item.q}
              </h2>
              {openIdx === i && (
                <div className="content" style={{ marginTop: '.5rem' }}>
                  {/* Если a — строка → оборачиваем в <p>, иначе рендерим как есть */}
                  {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
