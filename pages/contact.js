import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Контакты | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Связаться с нами</h1>

        <p>Если у вас есть вопросы, предложения или идеи — заполните форму ниже. Мы рассмотрим ваше сообщение.</p>

        <form
          action="https://formspree.io/f/mbloweze"
          method="POST"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}
        >
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            required
            style={{ padding: '0.75rem' }}
          />
          <textarea
            name="message"
            placeholder="Ваше сообщение"
            rows={5}
            required
            style={{ padding: '0.75rem' }}
          />
          <button type="submit" className="btn primary" style={{ maxWidth: '200px' }}>
            Отправить
          </button>
        </form>

        <hr style={{ margin: '3rem 0' }} />

        <h2>Дополнительно</h2>
        <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
          <li>✅ Мы не собираем личные данные.</li>
          <li>✅ Все обращения регистрируются в системе, основанной на DAO.</li>
          <li>✅ Ответ может быть опубликован в разделе FAQ.</li>
        </ul>
      </main>
    </>
  );
}
