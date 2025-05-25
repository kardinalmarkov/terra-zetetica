// pages/get-involved.js
import Head from 'next/head'

const tasks = [
  { id: 1, text: '!!Репостить анонсы TZ в ВКонтакте', time: '10 мин', complexity: 'simple', zeta: 1 },
  { id: 2, text: 'Создать и вести группу TZ в VK', time: '1 час', complexity: 'medium', zeta: 5 },
  { id: 3, text: 'Постить истории в Instagram с фактами о TZ', time: '15 мин', complexity: 'simple', zeta: 1 },
  { id: 4, text: 'Запустить канал TZ в Telegram для региона', time: '20 мин', complexity: 'simple', zeta: 1 },
  { id: 5, text: 'Перевести сайт проекта на русский', time: '2 часа', complexity: 'hard', zeta: 10 },
  // ... добавьте остальные задачи до 100
]

const complexityLabels = {
  simple: { label: '⭐ Простая', zeta: '1–3 ZETA' },
  medium: { label: '🌟 Средняя', zeta: '5–10 ZETA' },
  hard: { label: '🚀 Сложная', zeta: '15–20 ZETA' },
}

export default function GetInvolved() {
  return (
    <main className="wrapper" style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      <Head>
        <title>Как помочь | Terra Zetetica</title>
      </Head>

      <h1>Как помочь проекту</h1>
      <p>Выбери задачу и получи ZETA за свой вклад!</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>#</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Задача</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Время</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Сложность</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>Награда</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.id}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.text}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.time}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{complexityLabels[task.complexity].label}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.zeta} ZETA</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '2rem' }}>Легенда по сложности</h2>
      <ul>
        {Object.entries(complexityLabels).map(([key, { label, zeta }]) => (
          <li key={key}>{label} — {zeta}</li>
        ))}
      </ul>
    </main>
  )
}
