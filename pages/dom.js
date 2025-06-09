// -------------------------------
// File: pages/dom.js
// -------------------------------
import Head   from 'next/head'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => r.ok ? r.json() : null)

export default function Dom () {
  const { data: me } = useSWR('/api/me', fetcher)

  // Primary CTA always leads to /challenge (authenticated or not)
  const primary = {
    href: '/challenge',
    label: '🚀 К челленджу'
  }

  // Secondary CTA: go to personal cabinet
  const secondary = {
    href: '/lk',
    label: '📊 Личный кабинет'
  }

  return (
    <main className="wrapper" style={{maxWidth:860, margin:'0 auto', padding:'2rem 1rem'}}>
      <Head><title>🏠 «Докажи шар — получи дом» • Terra Zetetica</title></Head>

      <h1>🏠 «Докажи шар — получи дом»</h1>
      <p>14 дней материалов о Плоской Земле. Победа — дом в Европе.</p>

      <div style={{display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', margin:'2rem 0'}}>
        <a href={primary.href} className="btn btn-primary" style={{fontSize:'1.1rem', padding:'1rem 2rem'}}>
          {primary.label}
        </a>
        <a href={secondary.href} className="btn btn-secondary" style={{fontSize:'1.1rem', padding:'1rem 2rem'}}>
          {secondary.label}
        </a>
      </div>

      <h2>Как это работает</h2>
      <ol>
        <li>Нажмите «🚀 К челленджу». Если вы не в системе, будет авторизация через Telegram.</li>
        <li>Сразу попадаете в челлендж и каждый день получаете новое задание.</li>
        <li>После 14 дней загружаете своё доказательство шарообразности Земли.</li>
      </ol>
    </main>
  )
}