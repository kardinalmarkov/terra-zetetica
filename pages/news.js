// pages/news.js
import Head from 'next/head'

const videos = [
  'b800908bda2146b3b85a0fc8578ee90f', // пример – можно расширять массив
  '17ad14b303ee426f8052e5816b1ee234', // ← добавлено
]

export default function News() {
  return (
    <main className="wrapper">
      <Head>
        <title>Новости | Terra Zetetica</title>
      </Head>

      <h1>Новости Terra Zetetica</h1>
      <p>Последние объявления, видеоролики и события нашего государства.</p>

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
