// pages/dom.js
import Head   from 'next/head'
import useMe   from '../utils/useMe'
import { useRouter } from 'next/router'

export default function DomPage() {
  const { data: me, error } = useMe()
  const router = useRouter()

  const startChallenge = async () => {
    // запускаем API-роут, который апдейтит citizen.challenge_status=active
    await fetch('/api/challenge/start', { method: 'POST' })
    // переходим сразу к первому дню
    router.push('/challenge?day=1')
  }

  return (
    <main style={{ maxWidth:900, margin:'0 auto', padding:'2rem 1rem' }}>
      <Head>
        <title>🏠 Докажи шар — получи дом • Terra Zetetica</title>
      </Head>

      <h1>🏠 «Докажи шар — получи дом»</h1>
      <p>14 дней материалов о Плоской Земле. Победа — дом в Европе.</p>

      <div style={{
        display:'flex',
        gap:12,
        flexWrap:'wrap',
        justifyContent:'center',
        margin:'2rem 0'
      }}>
        {/* Кнопка всегда видна, но для гостей она приведёт к авторизации */}
        <button
          onClick={startChallenge}
          className="btn primary"
        >
          🚀 Начать челлендж
        </button>
      </div>

      <h2>Как это работает</h2>
      <ol>
        <li>Нажимаете «Начать челлендж» и проходите Telegram-авторизацию.</li>
        <li>Сразу попадаете в первый день (/challenge?day=1).</li>
        <li>В течение 14 дней изучаете материалы и сохраняете заметки.</li>
        <li>После 14/14 загружаете доказательства шарообразности Земли.</li>
      </ol>
    </main>
  )
}
