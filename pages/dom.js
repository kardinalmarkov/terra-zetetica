// pages/dom.js
import Head from 'next/head'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => (r.ok ? r.json() : null))

export default function DomChallenge () {
  const { data: me } = useSWR('/api/me', fetcher)
  const href   = me ? '/challenge' : '/lk'
  const label  = me ? '🚀 Перейти к челленджу' : '🔑 Войти и зарегистрироваться'

  return (
    <main style={{maxWidth:900,margin:'0 auto',padding:'2rem 1rem'}}>
      <Head><title>🏠 Дом за «доказательство шара» | Terra Zetetica</title></Head>


      <h1 style={{ textAlign:'center' }}>🏠 Челлендж: Докажи шар — получи дом в Европе</h1>

      <p>
        Государство <strong>Terra Zetetica</strong> объявляет открытый вызов: любой, кто
        публично и проверяемо докажет, что Земля — <em>шар</em>, получает
        дом эконом-класса в Европе. Это не розыгрыш и не шутка.
      </p>

      <h2>📜 Условия участия</h2>
      <ul>
        <li>Участвовать могут все желающие — граждане и неграждане TZ.</li>
        <li>Регистрация проходит через <strong>Личный кабинет</strong> (кнопка ниже).</li>
        <li>Перед стартом мини-анкета определяет ваш тип восприятия, чтобы
            материалы подсвечивались в подходящей форме.</li>
        <li>14 дней — ознакомительный этап; далее можно подать своё «доказательство шара».</li>
      </ul>

      <h2>🌀 Как проверяют доказательства</h2>
      <p>
        Мы фиксируем все аргументы и проводим открытую сетевую рецензию.
        Финальное заключение публикуется в IPFS — навсегда и без цензуры.
      </p>

      <h2>🎯 Зачем мы это делаем</h2>
      <p>
        Terra Zetetica базируется на поиске <strong>Истины</strong>, а не на догмах.
        Мы уверены в Плоской Земле, но открыты честному сомнению.
        Вызов помогает собрать и систематизировать реальные аргументы.
      </p>

      <div style={{ textAlign:'center', margin:'3rem 0' }}>
        <a href="/lk" className="btn primary" style={{
          background:'#6c63ff', color:'#fff', padding:'1rem 2rem',
          borderRadius:8, fontSize:'1.1rem', textDecoration:'none'
        }}>
          🚀 Перейти в Личный кабинет и зарегистрироваться
        </a>
      </div>

    </main>
  )
}
