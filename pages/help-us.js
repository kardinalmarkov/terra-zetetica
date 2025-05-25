// pages/help-us.js
import Head from 'next/head'
import { useState, useEffect } from 'react'

const allTasks = [
  /* ────────────  ⭐ ПРОСТЫЕ  (1–3 ZETA, до 15 мин) ──────────── */
  { id: 1,  text: 'Поставить лайк 👍 на пост TZ во ВКонтакте',       time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть пост', 'Нажать «Мне нравится»', 'Готово'] },
  { id: 2,  text: 'Поставить ⭐ в репозитории GitHub (terra-zetetica)', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Зайти на GitHub', 'Открыть репозиторий', 'Нажать «Star»'] },
  { id: 3,  text: 'Подписаться на Telegram-канал TZ',               time: 3,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть t.me/terra_zetetica', 'Нажать «Join»', 'Скриншот'] },
  { id: 4,  text: 'Поделиться ссылкой на сайт TZ в WhatsApp группе', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Скопировать ссылку', 'Вставить в группу', 'Отправить'] },
  { id: 5,  text: 'Сделать репост в VK-истории о плоской Земле',     time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Найти историю', 'Нажать «Поделиться»', 'Опубликовать'] },
  { id: 6,  text: 'Добавить terra-zetetica.org в закладки',          time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть сайт', 'Нажать Ctrl+D', 'Подтвердить'] },
  { id: 7,  text: 'Оставить эмодзи-реакцию в чате TZ',               time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Зайти в чат', 'Выбрать сообщение', 'Поставить реакцию'] },
  { id: 8,  text: 'Пригласить 3 друзей в Telegram-чат TZ',           time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Открыть чат', 'Нажать «Добавить»', 'Выбрать 3 контакта'] },
  { id: 9,  text: 'Сохранить обои “Flat Earth” на рабочий стол',      time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Скачать картинку', 'Открыть свойства фона', 'Установить'] },
  { id: 10, text: 'Отправить разработчикам баг-репорт (1 строка)',    time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Найти баг', 'Коротко описать', 'Отправить через форму'] },
  // … простые до id:20

  /* ────────────  🌟 СРЕДНИЕ (5–10 ZETA, 15–60 мин) ──────────── */
  { id: 21, text: 'Создать мем о плоской Земле в Canva',                time: 40, complexity: 'medium', zeta: 5,
    checklist: ['Открыть Canva', 'Нарисовать мем', 'Сохранить PNG'] },
  { id: 22, text: 'Написать пост (~200 слов) на Хабр о TZ',             time: 60, complexity: 'medium', zeta: 8,
    checklist: ['Авторизоваться', 'Написать текст', 'Опубликовать'] },
  // … средние до id:40

  /* ────────────  🚀 СЛОЖНЫЕ (15–20 ZETA, ≥ 4 ч) ──────────── */
  { id: 41, text: 'Перевести весь сайт на английский',                  time: 360, complexity: 'hard', zeta: 20,
    checklist: ['Скачать i18n-файлы', 'Перевести', 'PR в GitHub'] },
  // … сложные до id:60
  // и далее вплоть до 100, по той же схеме
]

export default function HelpUs() {
  const [favorites, setFavorites] = useState([])
  const [filterMax, setFilterMax] = useState(120)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
      setFavorites(JSON.parse(localStorage.getItem('tz-favs') || '[]'))
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
        <p>Фильтр по длительности и «избранное» через ⭐.</p>

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
          <section key={key}>
            <h2>{title}</h2>
            <div className="tasks-list">
              {filtered
                .filter(t => t.complexity === key)
                .map(t => (
                  <div key={t.id} className="task-card">
                    <div className="task-header">
                      {t.id}. {t.text}
                      <button onClick={() => toggleFav(t.id)}>
                        {favorites.includes(t.id) ? '★' : '☆'}
                      </button>
                    </div>
                    <div className="task-meta">
                      ⏱ {t.time <= 60 ? `${t.time}′` : `${Math.floor(t.time/60)} ч`}  
                      +{t.zeta} ZETA
                      {currentUrl && (
                        <span className="share">
                          <a
                            href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(t.text)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >Telegram</a>
                          {' | '}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(t.text + ' ' + currentUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >WhatsApp</a>
                        </span>
                      )}
                    </div>
                    <details>
                      <summary>Что нужно сделать</summary>
                      <ul>
                        {t.checklist.map((step, i) => <li key={i}>{step}</li>)}
                      </ul>
                    </details>
                  </div>
                ))}
            </div>
          </section>
        ))}

        <section className="report">
          <h2>Отчёт о выполненных задачах</h2>
          <form action="https://formspree.io/f/твой_ид" method="POST">
            <input name="z_id" placeholder="Z-ID" required />
            <input name="task_ids" placeholder="Задачи (через запятую)" required />
            <input name="links" placeholder="Ссылки" required />
            <textarea name="comment" placeholder="Комментарий (опционально)" />
            <button type="submit">Отправить</button>
          </form>
        </section>
      </main>

      <style jsx>{`
        .wrapper { max-width: 960px; margin: auto; padding: 2rem 1rem; }
        .filter { margin: 1rem 0; }
        .tasks-list { display: grid; gap: 1rem; }
        @media (min-width:600px) { .tasks-list { grid-template-columns:1fr 1fr } }
        .task-card { border:1px solid #ddd; padding:1rem; border-radius:4px; }
        .task-header { display:flex; justify-content:space-between; }
        .task-meta { font-size:.9rem; margin-top:.5rem; }
        .share a { margin-left:.5rem; font-size:.8rem; }
        .report { margin-top:2rem; padding:1rem; background:#f9f9f9; border-radius:4px; }
        form { display:grid; gap:1rem; max-width:600px; }
        input, textarea { padding:.75rem; border:1px solid #ccc; border-radius:4px; }
        button { padding:.75rem 1.5rem; background:#4caf50; color:#fff; border:none; border-radius:4px; }
      `}</style>
    </>
  )
}
