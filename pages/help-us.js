// pages/help-us.js
import Head from 'next/head'
import { useState, useEffect } from 'react'

const allTasks = [
  // Простые (⭐ до 15′)
  { id: 1,  text: 'Репостнуть пост Terra Zetetica в ВКонтакте',       time: 10,  complexity: 'simple', zeta: 1, checklist: [
      'Зайти в ВКонтакте',
      'Найти пост @terra-zetetica',
      'Нажать «Поделиться»'
    ]
  },
  { id: 2,  text: 'Поделиться сторис о TZ в Instagram',             time: 15,  complexity: 'simple', zeta: 1, checklist: [
      'Открыть Instagram',
      'Найти нашу страницу',
      'Поделиться в сторис'
    ]
  },
  { id: 3,  text: 'Рассылкой в WhatsApp отправить ссылку на сайт TZ', time: 10, complexity: 'simple', zeta: 1, checklist: [
      'Открыть WhatsApp',
      'Выбрать чат',
      'Вставить ссылку и отправить'
    ]
  },
  // … (еще простые задания до id 10)
  
  // Средние (🌟 15′–60′)
  { id: 11, text: 'Создать группу TZ в VK и пригласить 20 человек', time: 60, complexity: 'medium', zeta: 5, checklist: [
      'Зарегистрироваться в VK',
      'Создать группу «Terra Zetetica»',
      'Пригласить друзей'
    ]
  },
  { id: 12, text: 'Перевести главный блог-пост на русский язык',    time: 90, complexity: 'medium', zeta: 5, checklist: [
      'Скопировать текст',
      'Перевести',
      'Отправить правки в репозиторий'
    ]
  },
  // … (еще средние задания до id 20)

  // Сложные (🚀 больше 1 ч)
  { id: 21, text: 'Перевести весь сайт на английский',              time: 360, complexity: 'hard', zeta: 20, checklist: [
      'Скачать PO-файлы',
      'Перевести строки',
      'Собрать и проверить'
    ]
  },
  { id: 22, text: 'Настроить автодеплой (GitHub Actions)',           time: 240, complexity: 'hard', zeta: 15, checklist: [
      'Создать workflow файл',
      'Настроить секреты',
      'Протестировать'
    ]
  },
  // … (еще сложные задания до id 30)

  // Повторите по аналогии до 100 заданий
]

export default function HelpUs() {
  const [favorites, setFavorites] = useState([])
  const [filterMax, setFilterMax] = useState(120)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
      const saved = JSON.parse(localStorage.getItem('tz-favs') || '[]')
      setFavorites(saved)
    }
  }, [])

  function toggleFav(id) {
    const next = favorites.includes(id)
      ? favorites.filter(x => x !== id)
      : [...favorites, id]
    setFavorites(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('tz-favs', JSON.stringify(next))
    }
  }

  const filtered = allTasks.filter(t => t.time <= filterMax)
  const levels = [
    { key: 'simple', title: '⭐ Простые (до 15′)' },
    { key: 'medium', title: '🌟 Средние (15′–60′)' },
    { key: 'hard',   title: '🚀 Сложные (больше 1 ч)' },
  ]

  return (
    <>
      <Head>
        <title>Внести вклад | Terra Zetetica</title>
      </Head>
      <main className="wrapper">
        <h1>Внести вклад в Terra Zetetica</h1>
        <p>Отфильтруйте по времени и отметьте ⭐ понравившиеся задания.</p>

        <div className="filter">
          <label>
            Максимальное время: {filterMax <= 60 ? `${filterMax}′` : `${Math.floor(filterMax/60)} ч`}
          </label>
          <input
            type="range"
            min={10}
            max={480}
            step={5}
            value={filterMax}
            onChange={e => setFilterMax(+e.target.value)}
          />
        </div>

        {levels.map(({ key, title }) => (
          <section key={key} className="section">
            <h2>{title}</h2>
            <div className="tasks-list">
              {filtered
                .filter(t => t.complexity === key)
                .map(t => (
                  <div key={t.id} className="task-card">
                    <div className="task-header">
                      <span className="task-id">{t.id}.</span>
                      <span className="task-text">{t.text}</span>
                      <button className="fav" onClick={() => toggleFav(t.id)}>
                        {favorites.includes(t.id) ? '★' : '☆'}
                      </button>
                    </div>
                    <div className="task-meta">
                      <span>
                        ⏱ {t.time <= 60 ? `${t.time}′` : `${Math.floor(t.time/60)} ч`}
                      </span>
                      <span className="badge">+{t.zeta} ZETA</span>
                      {currentUrl && (
                        <div className="share">
                          <a
                            href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(t.text)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Telegram
                          </a>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(t.text + ' ' + currentUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                    <details>
                      <summary>Что нужно сделать</summary>
                      <ul>
                        {t.checklist.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
            </div>
          </section>
        ))}

        <section className="report">
          <h2>📬 Отчёт о выполненной задаче</h2>
          <p>Заполните форму: укажите Z-ID, номера задач, ссылки на материалы и комментарий.</p>
          <form
            action="https://formspree.io/f/твой_формспри_ид"
            method="POST"
            className="report-form"
          >
            <input name="z_id" placeholder="Z-ID (номер)" required />
            <input name="task_ids" placeholder="Номера задач (через запятую)" required />
            <input name="links" placeholder="Ссылки на материалы" required />
            <input name="file_link" placeholder="Ссылка на файлы (Drive/Dropbox)" />
            <textarea name="comment" placeholder="Комментарий (опционально)" />
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
        .filter {
          margin: 1rem 0;
        }
        .tasks-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .tasks-list {
            grid-template-columns: 1fr 1fr;
          }
        }
        .task-card {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 1rem;
        }
        .task-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fav {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
        }
        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        .badge {
          background: #e0f7fa;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        .share a {
          margin-left: 0.5rem;
          font-size: 0.8rem;
          text-decoration: none;
          color: #0077cc;
        }
        details {
          margin-top: 0.5rem;
        }
        summary {
          cursor: pointer;
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
        .report-form input,
        .report-form textarea {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
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
