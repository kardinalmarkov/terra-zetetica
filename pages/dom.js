// pages/dom.js
import Head from 'next/head'
import Link from 'next/link'     // ← раньше импорта не было!
import useMe from '../utils/useMe'
import { useRouter } from 'next/router'

export default function Dom() {
  const { data: me } = useMe()
  const router = useRouter()

  return (
    <main style={{ maxWidth:860, margin:'0 auto', padding:'2rem 1rem' }}>
      <Head><title>🏠 Докажи шар — получи дом • Terra Zetetica</title></Head>

      <h1>🏠 Докажи шар — получи дом</h1>
      <p style={{ fontSize:'1.2rem' }}>
        Добро пожаловать в уникальный челлендж от нового государства <strong>Terra Zetetica</strong>.
        За 14 дней вы получите доступ к аргументам, наблюдениям и альтернативным взглядам на устройство мира.
      </p>

      <p style={{ fontSize:'1.2rem' }}>
        Всё, что от вас требуется: <strong>внимательно изучить</strong> материалы и затем — <strong>попробовать опровергнуть</strong>.
        Если вы действительно докажете шарообразность Земли на основе объективных, проверяемых данных — <strong>вы получаете дом в Европе.</strong>
      </p>


      <div style={{ display:'flex', flexWrap:'wrap', gap:12,
        justifyContent:'center', margin:'2rem 0'
      }}>


        <button
          className="btn primary"
          onClick={async ()=>{
            await fetch('/api/challenge/start', { method:'POST' })
            router.push('/challenge?day=1')
          }}>
          🚀 Начать челлендж
        </button>

        <a href="/lk?tab=progress" className="btn btn-secondary"
           style={{ fontSize:'1.1rem', padding:'1rem 2rem' }}>
          📊 Личный кабинет
        </a>
      </div>


      <h2>🛠 Как это работает</h2>
      <ol style={{ fontSize:'1.1rem' }}>
        <li>Нажмите «🚀 Начать челлендж» и пройдите Telegram-авторизацию.</li>
        <li>В течение 14 дней вы будете получать уникальные аргументы и факты от исследователей Terra Zetetica.</li>
        <li>После завершения 14-дневного изучения вы получите доступ к форме для загрузки доказательств шарообразности Земли. Вы сможете это сделать в любое удобное для вас время.</li>
        <li>Если ваши материалы проходят верификацию — <strong>вы получаете недвижимость</strong> от нашего государства.</li>
      </ol>

      <h2>🎯 Почему мы это делаем</h2>
      <p style={{ fontSize:'1.1rem' }}>
        Потому что <strong>уверены в реальности плоской Земли</strong>.  
        И мы готовы пойти до конца, чтобы честно это доказать — даже через такой мощный вызов.
      </p>
      <p style={{ fontSize:'1.1rem' }}>
        Это не игра. Это ваш шанс посмотреть на мир без фильтров и иллюзий.  
        <strong>Вы готовы доказать обратное?</strong>
      </p>
    </main>
  )
}
