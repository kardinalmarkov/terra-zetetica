// pages/news.js
import Head from 'next/head'

const videos = [
  '5b64fe1e1a054fe3a9acbbe080d5b66e', // пример – можно расширять массив
  'f0bb066500524cc8949d1f6e97e6a326', // ← добавлено
]

export default function News() {
  return (
    <main className="wrapper">
      <Head>
        <title>Новости | Terra Zetetica</title>
      </Head>

      <h1>Новости Terra Zetetica</h1>
      <p>Последние объявления, видеоролики и события нашего государства.</p>
      
      {/* ----------------------------------------------------------- */}
      <article style={{background:'#F8F9FA',padding:'1.5rem 1rem',borderRadius:8,margin:'2rem 0'}}>
        <h2 style={{marginTop:0}}>🏠 Челлендж «Докажи шар — получи дом!»</h2>
        <p>
          Мы запустили 14‑дневный образовательный марафон. Изучи каждый модуль, нажимай
          <em>«Я осознанно изучил»</em> и через 2 недели попробуй представить своё
          <strong>доказательство шарообразности Земли</strong>. Сумеешь убедить — мы
          подарим тебе дом! 🙌
        </p>
        <p>
          Стартовать можно уже сейчас → <Link href="/dom"><a>страница&nbsp;челленджа</a></Link>
        </p>
      </article>
      {/* ----------------------------------------------------------- */}

      {videos.map(id => (
        <div key={id} style={{ margin: '2rem 0', position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={`https://app.heygen.com/embeds/${id}`}
            title="HeyGen video player"
            allow="encrypted-media; fullscreen;"
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 8
            }}
          />
        </div>
      ))}

      {/* TODO: сюда легко вставить компонент «PostList» с бек-API */}
    </main>
  )
}
