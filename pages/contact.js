import Head from 'next/head'


export default function Contacts() {
  return (
    <>
      <Head>
        <title>Контакты | Terra Zetetica</title>
      </Head>
      <form
  action="https://formspree.io/f/mbloweze"
  method="POST"
  className="contact-form"
>
  <label>
    Ваш e-mail
    <input type="email" name="email" required />
  </label>
  <label>
    Сообщение
    <textarea name="message" rows={4} required />
  </label>
  <button type="submit">Отправить</button>
</form>


        <h1>Контакты</h1>
        <p>Напишите нам — мы на связи!</p>

        <form
          action="https://formspree.io/f/mbloweze"
          method="POST"
          style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            type="email"
            name="email"
            placeholder="Ваш e-mail"
            required
            style={{ padding: '.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <textarea
            name="message"
            rows={4}
            placeholder="Сообщение"
            required
            style={{ padding: '.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" className="btn primary">
            Отправить
          </button>
        </form>
    </>
  )
}
