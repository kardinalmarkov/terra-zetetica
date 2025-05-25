// pages/help-us.js
import Head from 'next/head'

const tasks = [
  // Простые (⭐ 1–3 ZETA)
  { id: 1,  text: 'Репостнуть пост Terra Zetetica в ВКонтакте',                 time: '10′', zeta: 1, complexity: 'simple' },
  { id: 2,  text: 'Поделиться сторис о TZ в Instagram',                       time: '15′', zeta: 1, complexity: 'simple' },
  { id: 3,  text: 'Рассылкой в WhatsApp отправить друзьям ссылку на сайт TZ', time: '10′', zeta: 1, complexity: 'simple' },
  { id: 4,  text: 'Оставить комментарий и оценить 5★ в нашем Telegram-канале', time: '5′',  zeta: 1, complexity: 'simple' },
  { id: 5,  text: 'Написать в личку знакомому про TZ и попросить обратно поделиться', time: '10′', zeta: 1, complexity: 'simple' },
  { id: 6,  text: 'Добавить Terra Zetetica в избранное браузера и описать друзьям', time: '5′', zeta: 1, complexity: 'simple' },
  { id: 7,  text: 'Поделиться ссылкой на сайт TZ в чатах мессенджеров',        time: '10′', zeta: 1, complexity: 'simple' },
  { id: 8,  text: 'Написать короткий отзыв (<50-слов) на любой соцсети',         time: '20′', zeta: 2, complexity: 'simple' },
  { id: 9,  text: 'Пригласить 3 друзей в наш чат-бот в Telegram',               time: '10′', zeta: 1, complexity: 'simple' },
  { id: 10, text: 'Поставить лайк 👍 на Facebook-странице TZ',                  time: '2′',  zeta: 1, complexity: 'simple' },

  // Средние (🌟 5–10 ZETA)
  { id: 11, text: 'Создать группу TZ в VK и пригласить в неё 20 человек',      time: '1 ч',   zeta: 5, complexity: 'medium' },
  { id: 12, text: 'Перевести блог-пост о плоской Земле на русский язык',        time: '1.5 ч', zeta: 5, complexity: 'medium' },
  { id: 13, text: 'Подготовить инфографику “Как стать гражданином TZ”',        time: '2 ч',   zeta: 5, complexity: 'medium' },
  { id: 14, text: 'Сделать короткое видео (30″) о преимуществах TZ',          time: '2 ч',   zeta: 5, complexity: 'medium' },
  { id: 15, text: 'Написать гайд “Как оформить анклав” в формате PDF',         time: '2 ч',   zeta: 5, complexity: 'medium' },
  { id: 16, text: 'Перевести сайт TZ на украинский (главная страница)',       time: '3 ч',   zeta: 8, complexity: 'medium' },
  { id: 17, text: 'Нарисовать 5 стикеров/эмодзи для чата TZ в Telegram',       time: '2 ч',   zeta: 5, complexity: 'medium' },
  { id: 18, text: 'Организовать AMA-сессию в Telegram-группе (анонс + модерация)', time: '3 ч', zeta: 5, complexity: 'medium' },
  { id: 19, text: 'Подготовить и отправить пресс-релиз в 3 региональных СМИ',  time: '3 ч',   zeta: 8, complexity: 'medium' },
  { id: 20, text: 'Запустить рассылку «Zetetic Digest» на Mailchimp (шаблон)', time: '2 ч',   zeta: 5, complexity: 'medium' },

  // Сложные (🚀 15–20 ZETA)
  { id: 21, text: 'Перевести весь сайт TZ на английский язык',                time: '6 ч',   zeta: 20, complexity: 'hard' },
  { id: 22, text: 'Настроить CI/CD (GitHub Actions) для автодеплоя сайта',     time: '4 ч',   zeta: 15, complexity: 'hard' },
  { id: 23, text: 'Разработать шаблон анклава в формате GitHub Pages',         time: '5 ч',   zeta: 20, complexity: 'hard' },
  { id: 24, text: 'Создать интерактивную карту анклавов на Google Maps API',  time: '6 ч',   zeta: 20, complexity: 'hard' },
  { id: 25, text: 'Сменить дизайн сайта на новый (Figma → React)',            time: '8 ч',   zeta: 20, complexity: 'hard' },
  { id: 26, text: 'Разработать мини-приложение “Уведомления о новых задачах”',  time: '6 ч',   zeta: 15, complexity: 'hard' },
  { id: 27, text: 'Провести офлайн-ивент flat-earth клуба (аренда, оборудование)', time: '10 ч', zeta: 20, complexity: 'hard' },
  { id: 28, text: 'Подготовить видео-курсы “Основы зететики” (3 урока по 5 мин)', time: '12 ч', zeta: 20, complexity: 'hard' },
  { id: 29, text: 'Настроить бот-конструктор в Telegram для автоматической выдачи задач', time: '8 ч', zeta: 20, complexity: 'hard' },
  { id: 30, text: 'Организовать краудфандинг-кампанию на Boomstarter',        time: '15 ч',  zeta: 20, complexity: 'hard' },

  // ... и так далее до 100, по той же схеме: конкретно, просто, без выдуманных «NearSky» и «Z-метрологии».
]

export default function HelpUs() {
  const levels = [
    { key: 'simple', title: '⭐ Простые (1–3 ZETA)' },
    { key: 'medium', title: '🌟 Средние (5–10 ZETA)' },
    { key: 'hard',   title: '🚀 Сложные (15–20 ZETA)' },
  ]

  return (
    <>
      <Head>
        <title>Внести вклад | Terra Zetetica</title>
      </Head>
      <main className="wrapper">
        <h1>Внести вклад в Terra Zetetica</h1>
        <p>Выберите раздел и задачу — получите ZETA за реальный вклад!</p>

        {levels.map(({ key, title }) => (
          <section key={key} className="section">
            <h2>{title}</h2>
            <div className="tasks-list">
              {tasks.filter(t => t.complexity === key).map(t => (
                <div key={t.id} className="task-card">
                  <div className="task-header">
                    <span className="task-id">{t.id}.</span>
                    <span className="task-text">{t.text}</span>
                  </div>
                  <div className="task-meta">
                    <span className="task-time">⏱ {t.time}</span>
                    <span className="badge">+{t.zeta} ZETA</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="report">
          <h2>📬 Отчёт о выполненной задаче</h2>
          <p>Заполните форму: укажите Telegram-ID, номера задач и ссылки на материалы.</p>
          <form
            action="https://formspree.io/f/твой_формспри_ид"
            method="POST"
            className="report-form"
          >
            <input name="telegram_id" placeholder="Telegram-ID" required />
            <input name="task_ids"    placeholder="Номера задач" required />
            <input name="links"       placeholder="Ссылки на материалы" required />
            <input name="file_link"   placeholder="Ссылка на файлы (Drive/Dropbox)" />
            <button type="submit">Отправить отчёт</button>
          </form>
        </section>
      </main>

      <style jsx>{`
        .wrapper {
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        h1 { margin-bottom: 0.5rem; }
        .section { margin-top: 2rem; }
        .tasks-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .tasks-list { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 960px) {
          .tasks-list { grid-template-columns: 1fr 1fr 1fr; }
        }
        .task-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1rem;
        }
        .task-header {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .task-id { font-weight: bold; }
        .task-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }
        .badge {
          background: #e0f7fa;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: bold;
        }
        .report {
          margin-top: 3rem;
          padding: 2rem;
          background: #f1f8e9;
          border-radius: 8px;
        }
        .report-form {
          display: grid;
          gap: 1rem;
          max-width: 600px;
        }
        .report-form input {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .report-form button {
          width: fit-content;
          padding: 0.75rem 1.5rem;
          background: #4caf50;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
