import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const [topic, setTopic] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    // Здесь можно добавить валидацию полей перед отправкой
    // или логику отправки в DAO, если понадобится.
    // Пока форма отправляется на Formspree.
  }

  return (
    <>
      <Head>
        <title>Контакты | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>📬 Связаться с нами</h1>
        <p style={{ marginBottom: '1rem', color: '#444', fontSize: '1.05rem' }}>
          Если у вас есть вопросы, предложения или идеи — заполните форму ниже. 
          Мы рассматриваем каждое обращение и отвечаем в течение 1–2 рабочих дней.
        </p>

        {/* Блок с основными каналами связи */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>Наши мессенджеры и соцсети</h2>
          <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>✅ <a href="https://t.me/TerraZetChat" target="_blank" rel="noopener noreferrer">
              Telegram-чат: <strong>@TerraZetChat</strong>
            </a> — для оперативного общения и вопросов</li>
            <li>✅ <a href="https://t.me/TerraZetetica" target="_blank" rel="noopener noreferrer">
              Telegram-канал: <strong>@TerraZetetica</strong>
            </a> — для официальных объявлений и новостей</li>
            <li>✅ <a href="/checklist" target="_blank" rel="noopener noreferrer">
              Ваш список дел: <strong>Чек-лист гражданина</strong>
            </a> — если хотите сразу отметить выполнение пунктов
            </li>
          </ul>
        </section>

        <hr style={{ margin: '2rem 0', borderColor: '#e5e7eb' }} />

        <section style={{ marginBottom: '2rem' }}>
          <h2>🛠 Тема обращения</h2>
          <p style={{ marginBottom: '0.5rem', fontStyle: 'italic', color: '#555' }}>
            Выберите, о чём вы хотите написать. Это поможет нам быстрее направить ваше сообщение в нужный отдел.
          </p>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
          >
            <option value="" disabled>— Выберите тему —</option>
            <option value="Общий вопрос">❓ Общий вопрос</option>
            <option value="Предложение по анклаву">🏘 Предложение по анклаву</option>
            <option value="Техническая проблема">⚙️ Техническая проблема</option>
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
          {/* Скрытое поле topic, его тоже отправить на сервер */}
          <input type="hidden" name="topic" value={topic} />

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '0.25rem' }}>🔖 Тема</span>
            <select
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="" disabled>— Что вы хотите отправить? —</option>
              <option value="Общий вопрос">❓ Общий вопрос</option>
              <option value="Предложение по анклаву">🏘 Предложение по анклаву</option>
              <option value="Техническая проблема">⚙️ Техническая проблема</option>
              <option value="Отчёт об анклаве">📸 Отчёт об анклаве</option>
              <option value="Другое">✉️ Другое</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '0.25rem' }}>👤 Ваше имя <span style={{ color: '#999', fontSize: '0.9rem' }}>(можно псевдоним)</span></span>
            <input
              type="text"
              name="name"
              placeholder="Например, Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '0.25rem' }}>✉️ Email <span style={{ color: '#999', fontSize: '0.9rem' }}>(необязательно, если хотите получить ответ)</span></span>
            <input
              type="email"
              name="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '0.25rem' }}>✍️ Ваше сообщение</span>
            <textarea
              name="message"
              placeholder="Опишите, что вам нужно или пришлите файлы (ссылки на облако)"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </label>

          <button type="submit" className="btn primary" style={{ maxWidth: '200px', alignSelf: 'flex-start' }}>
            Отправить сообщение
          </button>
        </form>

        <hr style={{ margin: '2rem 0', borderColor: '#e5e7eb' }} />

        {/* Инструкции по отправке отчётов об анклаве */}
        <section>
          <h2>📢 Отчёты об анклаве</h2>
          <p style={{ color: '#555', fontSize: '1rem', marginBottom: '0.5rem' }}>
            Если вы житель анклава и хотите отправить фото/видеоотчёт:
          </p>
          <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>📸 Снимите видео или сделайте фото своего анклава.</li>
            <li>📝 Заполните форму выше, выбрав тему «Отчёт об анклаве».</li>
            <li>🗂 Прикрепите ссылку (например, Dropbox/Google Drive/Яндекс.Диск) в поле «Ваше сообщение».</li>
            <li>📨 Нажмите «Отправить сообщение». В письме укажите: название анклава и краткое описание (координаты, проблемы, пожелания).</li>
            <li>💾 Все присланные отчёты автоматически сохраняются в нашем DAO-архиве.</li>
          </ul>
        </section>

        <hr style={{ margin: '2rem 0', borderColor: '#e5e7eb' }} />

        {/* Дополнительная информация */}
        <section>
          <h2>ℹ️ Дополнительно</h2>
          <p style={{ color: '#555', fontSize: '1rem' }}>
            Также вы можете загружать шаблоны:
          </p>
          <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>📄 <a href="/materials#flag-template" target="_blank" rel="noopener noreferrer" title="Скачать шаблон флага">
              Шаблон флага анклава (раздел «Материалы»)
            </a></li>
            <li>🗺️ <a href="/materials#map-template" target="_blank" rel="noopener noreferrer" title="Скачать шаблон картографии">
              Шаблон карты под наложение анклава (раздел «Материалы»)
            </a></li>
          </ul>
          <p style={{ marginTop: '1rem', color: '#777', fontSize: '0.90rem' }}>
            ✅ Мы не собираем лишних данных и не передаём их третьим лицам.<br />
            ✅ Все обращения регистрируются в системе, основанной на DAO, и обрабатываются гражданами-волонтёрами.<br />
            ✅ Ответ по вашему запросу может быть опубликован в разделе FAQ.
          </p>
        </section>
      </main>
    </>
  )
}
