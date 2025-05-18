import Head from 'next/head';
import { useState } from 'react';

const roadmapData = [
  {
    quarter: 'I. Запуск основ (2025, Q2–Q3)',
    rows: [
      ['✅ Конституция', 'Опубликована, CID в IPFS', '✔'],
      ['✅ NFT-Паспорт', 'v1.0 создан, PDF + QR + CID', '✔'],
      ['✅ Первые анклавы', 'Санкт-Петербург (РФ), Брестский р-н (BY)', '✔'],
      ['✅ CID-реестр документов', 'Основные документы в IPFS', '✔'],
      ['🔄 Сайт', 'terra-zetetica.org + GitHub', '🔃'],
      ['🔄 Флаг, герб, девиз', 'Утверждены и внедряются', '🔃']
    ]
  },
  {
    quarter: 'II. Рост и структура (Q4 2025 – Q2 2026)',
    rows: [
      ['🧬 Гражданство', 'Z-ID автоматизирован + реестр NFT-граждан'],
      ['📍 Анклавы', '10 анклавов минимум, интерактивная карта'],
      ['🧑‍⚖️ DAO-платформа', 'Базовое DAO (Snapshot, IPFS-регистрация)'],
      ['🧾 Документы', 'Цифровые ID, титулы, NFT-сертификаты'],
      ['🏛 Образование', 'Академия Зететики: zeta-glossary, курсы, эмиссия значков'],
      ['💬 Коммуникация', 'Discord, Telegram, форум, анонимные предложения']
    ]
  },
  {
    quarter: 'III. Международная стадия (2026)',
    rows: [
      ['🤝 Дипломатия', 'Подача писем в ООН, UNPO, микронации'],
      ['📣 Репутация', 'Форумы, конференции, мероприятия'],
      ['📜 2-я редакция Конституции', 'DAO-правки и ратификация'],
      ['📡 ЗаКуполья', 'DAO-экспедиции, публикации, анонимные отчёты'],
      ['🗳 Цифровые голосования', 'Z-ID-валидатор, zk-ID'],
      ['🗺 Центральный анклав', 'Покупка/передача земли под штаб-центр']
    ]
  }
];

export default function Roadmap() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  
  function handleSubmit(e) {
    e.preventDefault();
    fetch('/api/subscribe', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email })
    }).then(() => setSent(true));
  }
  
  return (
    <>
      <Head><title>Дорожная карта | Terra Zetetica</title></Head>
      <main className="wrapper">
        <h1>📈 Дорожная карта Terra Zetetica</h1>
        <p style={{ marginBottom:'1.5rem' }}>Версия: 2025–2026</p>

        {roadmapData.map(section => (
          <section key={section.quarter} style={{ marginBottom:'2rem' }}>
            <h2>{section.quarter}</h2>
            <table>
              <thead>
                <tr>
                  {section.rows[0].length === 3
                    ? ['Этап','Содержание','Статус']
                    : ['Цель','Действие']
                  }.map(h => <th key={h}>{h}</th>)
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row,i) => (
                  <tr key={i}>
                    {row.map((cell,j) => <td key={j}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <section style={{ marginBottom:'2rem' }}>
          <h2>📊 Подписаться на обновления</h2>
          {sent
            ? <p>Спасибо, вы подписаны!</p>
            : (
              <form onSubmit={handleSubmit} style={{ display:'flex', gap:'0.5rem' }}>
                <input
                  type="email" required placeholder="Ваш e-mail"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flexGrow:1, padding:'0.6rem', border:'1px solid #ccc', borderRadius:4 }}
                />
                <button type="submit" className="btn primary">Подписаться</button>
              </form>
            )
          }
        </section>
      </main>
    </>
  );
}
