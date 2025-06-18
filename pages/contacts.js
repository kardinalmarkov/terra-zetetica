import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const [topic, setTopic] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    // Валидацию можно добавить здесь, если понадобится.
    // Форма по-прежнему отправляется на Formspree.
  }

  return (
    <>
      <Head>
        <title>Контакты | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Заголовок и пояснение */}
        <h1>📬 Связаться с нами</h1>
        <p style={{ marginBottom: '1rem', color: '#444', fontSize: '1.05rem' }}>
          Если у вас есть вопросы, предложения или идеи — заполните форму ниже. 
          Мы рассматриваем каждое обращение и отвечаем в течение 1–2 рабочих дней.
        </p>

        {/* Блок «Наши мессенджеры и соцсети» */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Наши мессенджеры и соцсети</h2>
          <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>
              ✅ <a href="https://t.me/TerraZetChat" target="_blank" rel="noopener noreferrer">
                Telegram-чат (в процессе содания): <strong>@TerraZetChat</strong>
              </a> – для оперативного общения и вопросов
            </li>
            <li>
              ✅ <a href="https://t.me/TerraZetetica" target="_blank" rel="noopener noreferrer">
                Telegram-канал (в процессе содания): <strong>@TerraZetetica</strong>
              </a> – для официальных объявлений и новостей
            </li>
            <li>
              ✅ <a href="/enclaves" target="_blank" rel="noopener noreferrer">
                Раздел анклавов – инструкции по созданию и актуальный список
              </a>
            </li>
            <li>
              ✅ <a href="/checklist" target="_blank" rel="noopener noreferrer">
                Ваш список дел: «Чек-лист гражданина»
              </a>
            </li>
          </ul>
        </section>

        <hr style={{ margin: '2rem 0', borderColor: '#e5e7eb' }} />

        {/* Секция «Тема обращения» */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>⚙️ Тема обращения</h2>
          <p style={{ marginBottom: '0.5rem', fontStyle: 'italic', color: '#555' }}>
            Выберите, о чём вы хотите написать. Это поможет нам быстрее направить ваше сообщение.
          </p>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            name="topic"
            style={{
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            <option value="" disabled>— Выберите тему —</option>
            <option value="Общий вопрос">❓ Общий вопрос</option>
            <option value="Предложение по анклаву">🏘 Предложение по анклаву</option>
            <option value="Техническая проблема">🚧 Техническая проблема</option>
            <option value="Дом за шар">🏠 Дом за шар / Челлендж</option>
            <option value="Отчёт об анклаве">📸 Отчёт об анклаве</option>
            <option value="Другое">✉️ Другое</option>
          </select>
        </section>

        {/* Форма обратной связи */}
        <form
          action="https://formspree.io/f/mbloweze"
          method="POST"
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}
        >
          {/* Скрытое поле для передачи темы */}
          <input type="hidden" name="topic" value={topic} />

          {/* Поле «Ваше имя (и Z-ID)» */}
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '0.25rem' }}>
              👤 Ваше имя (и Z-ID)
            </span>
            <input
              type="text"
              name="name"
              placeholder="Например, Ivan Z-12345"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          {/* Поле «Email (необязательно)» */}
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '0.25rem' }}>
              ✉️ Email (необязательно, если хотите получить ответ)
            </span>
            <input
              type="email"
              name="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* Поле «Ваше сообщение» */}
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '0.25rem' }}>
              ✍️ Ваше сообщение
            </span>
            <textarea
              name="message"
              placeholder="Опишите ваш вопрос или прикрепите ссылку (Dropbox, Google Drive и т. д.)"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn primary" style={{ maxWidth: '200px', alignSelf: 'flex-start' }}>
            Отправить сообщение
          </button>
        </form>

        <hr style={{ margin: '2rem 0', borderColor: '#e5e7eb' }} />

        {/* Секция «Отчёты об анклаве» */}
        <section>
          <h2>📢 Как отправить отчёт об анклаве</h2>
          <p style={{ color: '#555', fontSize: '1rem', marginBottom: '0.5rem' }}>
            Если вы житель анклава и хотите прислать фото / видеоотчёт:
          </p>
          <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>📸 Снимите видео или сделайте фото своего анклава.</li>
            <li>📝 В форме выше выберите тему «Отчёт об анклаве».</li>
            <li>🔗 Прикрепите ссылку (Google Drive/Dropbox/Яндекс.Диск и т. п.) в поле «Ваше сообщение».</li>
            <li>📨 Нажмите «Отправить сообщение». В письме укажите короткое описание (название анклава, координаты, проблемы, пожелания).</li>
            <li>💾 Все присланные отчёты автоматически сохраняются в нашем DAO-архиве (в разработке).</li>
          </ul>
        </section>
      </main>
    </>
  )
}
