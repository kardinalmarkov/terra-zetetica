// pages/dom.js
import Head   from 'next/head'
import useSWR from 'swr'

const fetcher = u => fetch(u).then(r => r.ok ? r.json() : null)

export default function Dom () {
  const { data: me } = useSWR('/api/me', fetcher)
  // если нет куки tg → /lk, иначе сразу в /challenge
  const hrefPrimary   = me?.user ? '/challenge' : '/lk'
  const labelPrimary  = me?.user ? '🚀 К челленджу' : '🔑 Авторизоваться'
  const hrefSecondary = me?.user
    ? '/lk?tab=profile'          // личный кабинет
    : '/lk?tab=passport'         // сразу на регистрацию
  const labelSecondary = me?.user
    ? '📊 Личный кабинет'
    : '📝 Зарегистрироваться'

  return (
    <main style={{maxWidth:860, margin:'0 auto', padding:'2rem 1rem'}}>
      <Head>
        <title>🏠 «Докажи шар — получи дом» • Terra Zetetica</title>
      </Head>

      <h1>🏠 «Докажи шар — получи дом»</h1>
      <p>14 дней заданий по Плоской Земле — докажите, что шар, и выиграйте дом в Европе.</p>

      <div style={{display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', margin:'2rem 0'}}>
        <a href={hrefPrimary}
           className="btn btn-primary"
           style={{fontSize:'1.1rem', padding:'1rem 2rem'}}>
          {labelPrimary}
        </a>
        <a href={hrefSecondary}
           className="btn btn-secondary"
           style={{fontSize:'1.1rem', padding:'1rem 2rem'}}>
          {labelSecondary}
        </a>
      </div>

      <h2>Как это работает</h2>
      <ol>
        <li>Нажимаете кнопку выше — авторизация через Telegram (или сразу в челлендж, если уже в системе).</li>
        <li>Вам ежедневно открывается новый материал и вопрос.</li>
        <li>По окончании 14 дней — финальная проверка и победа!</li>
      </ol>
    </main>
  )
}
