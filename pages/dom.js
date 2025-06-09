// -------------------------------
// File: pages/dom.js
// -------------------------------
import Head   from 'next/head'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => r.ok ? r.json() : null)

export default function Dom () {
  const { data: me } = useSWR('/api/me', fetcher)

  return (
    <main className="wrapper" style={{ maxWidth:860, margin:'0 auto', padding:'2rem 1rem' }}>
      <Head><title>🏠 «Докажи шар — получи дом» • Terra Zetetica</title></Head>

      <h1>🏠 «Докажи шар — получи дом»</h1>
      <p>14 дней материалов о Плоской Земле. Победа — дом в Европе.</p>

      <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', margin:'2rem 0' }}>
        {/* Главная кнопка старта челленджа */}
        <a href="/challenge" className="btn btn-primary" style={{ fontSize:'1.1rem', padding:'1rem 2rem' }}>
          🚀 К челленджу
        </a>
        {/* Вторая кнопка: перейти в личный кабинет */}
        <a href="/lk" className="btn btn-secondary" style={{ fontSize:'1.1rem', padding:'1rem 2rem' }}>
          📊 Личный кабинет
        </a>
      </div>

      <h2>Как это работает</h2>
      <ol>
        <li>Нажмите кнопку «🚀 К челленджу». Если вы не в системе — появится Telegram‑авторизация.</li>
        <li>Сразу попадёте в челлендж и каждый день будете получать новое задание.</li>
        <li>После 14 дней загрузите доказательство шарообразности Земли.</li>
      </ol>
    </main>
  )
}