// pages/dom.js   — файл целиком
import Head     from 'next/head'
import useSWR   from 'swr'

const fetcher = u => fetch(u).then(r => r.ok ? r.json() : null)

export default function Dom () {
  const { data: me } = useSWR('/api/me', fetcher)
  const href  = me ? '/challenge'         : '/lk'
  const label = me ? '🚀 К челленджу'      : '🔑 Войти и начать'

  return (
    <main style={{maxWidth:860,margin:'0 auto',padding:'2rem 1rem'}}>
      <Head><title>🏠 Дом за «доказательство шара» | Terra Zetetica</title></Head>

      <h1>🏠 «Докажи шар — получи дом»</h1>
      <p>14 дней материалов о Плоской Земле. Победа — дом в Европе.</p>

      <h2>Как это работает</h2>
      <ol>
        <li>Нажимаете кнопку {label} (авторизация Telegram).</li>
        <li>Сразу попадаете в челлендж и каждый день получаете новое задание.</li>
        <li>После 14 дней можете загрузить своё доказательство «шара».</li>
      </ol>

      <p style={{textAlign:'center',margin:'3rem 0'}}>
        <a href={href} className="btn btn-primary" style={{fontSize:'1.2rem'}}>
          {label}
        </a>
      </p>
    </main>
  )
}
