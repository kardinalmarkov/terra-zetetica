import Head from 'next/head'

export default function EnclavePage() {
  return (
    <main className="wrapper">
      <Head>
        <title>🧱 Анклавы | Terra Zetetica</title>
      </Head>

      <h1>🧱 Анклавы Terra Zetetica</h1>

      <p>Анклав — это автономная территория государства Terra Zetetica...</p>

      <h2>📌 Как зарегистрировать анклав?</h2>
      <ol>
        <li>Быть гражданином с действующим Z-ID</li>
        <li>Подготовить описание анклава</li>
        <li>Загрузить данные в IPFS</li>
        <li>Подать заявку через DAO</li>
      </ol>

      <h2>📄 Форма заявки</h2>
      <form action="https://formspree.io/f/mbloweze" method="POST">
        <input name="name" placeholder="Ваше имя" required />
        <textarea name="message" placeholder="Описание анклава" rows={6} required />
        <button type="submit">📬 Отправить заявку</button>
      </form>

      <h2>🧱 Мои анклавы</h2>
      <p>Здесь в будущем появятся анклавы, связанные с вашим Z-ID.</p>

      <h2>🧭 Карта анклавов</h2>
      <p>Интерактивная карта появится в следующем обновлении.</p>
    </main>
  )
}
