// pages/help-us.js
import Head from 'next/head'
import { useState, useEffect } from 'react'

const allTasks = [
  /* ────────────  ⭐ ПРОСТЫЕ  (1–3 ZETA, до 15′) ──────────── */
  { id: 1,  text: 'Поставить лайк 👍 на пост TZ во ВКонтакте', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть пост во ВКонтакте', 'Нажать «Мне нравится»', 'Готово'] },
  { id: 2,  text: 'Поставить ⭐ в репозитории GitHub (terra-zetetica)', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Зайти на GitHub', 'Открыть репозиторий terra-zetetica', 'Нажать «Star»'] },
  { id: 3,  text: 'Подписаться на Telegram-канал TZ', time: 3,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть t.me/terra_zetetica', 'Нажать «Join»', 'Сделать скриншот'] },
  { id: 4,  text: 'Поделиться ссылкой на сайт TZ в WhatsApp-группе', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Скопировать ссылку terra-zetetica.org', 'Вставить в чат', 'Отправить сообщение'] },
  { id: 5,  text: 'Сделать репост в VK-истории о плоской Земле', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Найти историю в VK', 'Нажать «Поделиться»', 'Опубликовать на своей странице'] },
  { id: 6,  text: 'Добавить terra-zetetica.org в закладки браузера', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть сайт', 'Нажать Ctrl +D (или значок ☆)', 'Сохранить закладку'] },
  { id: 7,  text: 'Оставить эмодзи-реакцию в чате TZ', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть чат TZ', 'Выбрать любое сообщение', 'Поставить эмодзи'] },
  { id: 8,  text: 'Пригласить 3 друзей в Telegram-чат TZ', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Открыть чат TZ', 'Нажать «Добавить участников»', 'Выбрать минимум 3 друзей'] },
  { id: 9,  text: 'Сохранить обои “Flat Earth” и поставить на рабочий стол', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Скачать картинку', 'Открыть настройки фона', 'Установить обои'] },
  { id: 10, text: 'Отправить баг-репорт (1 строчка) через форму сайта', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Найти баг на сайте', 'Написать краткое описание', 'Отправить через форму'] },
  { id: 11, text: 'Сделать сторис в Instagram о TZ с хэштегом #TerraZ', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Создать сторис', 'Добавить хэштег #TerraZ', 'Опубликовать'] },
  { id: 12, text: 'Проголосовать в текущем опросе DAO через бота', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Открыть Telegram-бота TZ', 'Найти активный опрос', 'Нажать вариант ответа'] },
  { id: 13, text: 'Отправить эмодзи 🌍 в общий чат “Я за TZ!”', time: 2,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть общий чат', 'Написать эмодзи 🌍', 'Отправить'] },
  { id: 14, text: 'Сделать скриншот сайта и переслать другу', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Открыть сайт TZ', 'Сделать скриншот', 'Отправить другу'] },
  { id: 15, text: 'Исправить опечатку в GitHub-Wiki TZ', time: 15, complexity: 'simple', zeta: 3,
    checklist: ['Перейти в репозиторий GitHub Wiki', 'Найти опечатку', 'Сделать PR с правкой'] },
  { id: 16, text: 'Поставить 👍 под видео на Rutube-канале TZ', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть Rutube-канал', 'Найти видео', 'Нажать «Нравится»'] },
  { id: 17, text: 'Сохранить сайт TZ в «Читать позже» (мобильный)', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть меню браузера', 'Выбрать «Читать позже»', 'Показать скриншот'] },
  { id: 18, text: 'Предложить идею улучшения через форму идей', time: 15, complexity: 'simple', zeta: 2,
    checklist: ['Открыть /ideas на сайте', 'Заполнить форму', 'Нажать «Отправить»'] },
  { id: 19, text: 'Поставить реакцию 🔥 на комментарий гражданина', time: 5, complexity: 'simple', zeta: 1,
    checklist: ['Перейти в обсуждение', 'Найти комментарий', 'Поставить 🔥'] },
  { id: 20, text: 'Заполнить мини-опрос «Почему мне интересна TZ»', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Перейти по ссылке в чате', 'Ответить на 3 вопроса', 'Отправить форму'] },

  /* ────────────  🌟 СРЕДНИЕ  (5–10 ZETA, 15–60′) ──────────── */
  { id: 21, text: 'Создать мем о плоской Земле в Canva', time: 40, complexity: 'medium', zeta: 5,
    checklist: ['Открыть Canva', 'Сделать мем', 'Сохранить и опубликовать'] },
  { id: 22, text: 'Написать пост (≈200 слов) на VC.ru о TZ', time: 60, complexity: 'medium', zeta: 8,
    checklist: ['Авторизоваться на VC.ru', 'Написать текст ~200 слов', 'Опубликовать и дать ссылку'] },
  { id: 23, text: 'Перевести раздел “Конституция” на английский', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Скачать текст конституции', 'Перевести', 'Сделать PR в GitHub'] },
  { id: 24, text: 'Смонтировать 30″ TikTok «Почему я в TZ»', time: 90, complexity: 'medium', zeta: 6,
    checklist: ['Снять 2–3 клипа', 'Смонтировать в CapCut', 'Загрузить с #TerraZ'] },
  { id: 25, text: 'Нарисовать 5 стикеров для Telegram-пакета', time: 60, complexity: 'medium', zeta: 5,
    checklist: ['Нарисовать PNG', 'Загрузить ботом @stickers', 'Получить ссылку'] },
  { id: 26, text: 'Собрать FAQ: 10 вопросов и ответов', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Собрать вопросы', 'Написать ответы', 'Добавить в docs/faq.md'] },
  { id: 27, text: 'Сделать инфографику «Как получить Z-ID»', time: 50, complexity: 'medium', zeta: 5,
    checklist: ['Открыть Figma/Canva', 'Нарисовать 3 шага', 'Экспорт PNG'] },
  { id: 28, text: 'Организовать голосовой чат в Telegram (15′) и собрать 10 слушателей', time: 45, complexity: 'medium', zeta: 5,
    checklist: ['Назначить время', 'Анонс в чате', 'Провести эфир'] },
  { id: 29, text: 'Записать 3-мин подкаст о личном опыте в TZ', time: 45, complexity: 'medium', zeta: 5,
    checklist: ['Записать voice-note', 'Смонтировать аудио', 'Отправить файл'] },
  { id: 30, text: 'Создать гайд «Как репостить в VK»', time: 60, complexity: 'medium', zeta: 5,
    checklist: ['Сделать doc', 'Добавить скрины', 'Залить в Google Docs'] },
  { id: 31, text: 'Перевести главную страницу на казахский', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Скопировать текст', 'Перевести', 'PR в GitHub'] },
  { id: 32, text: 'Подключить RSS-фид сайта к Telegram-боту', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Создать бота', 'Настроить rss2tg', 'Скрин работы'] },
  { id: 33, text: 'Сделать 5 GIF-стикеров «Плоская Земля»', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Смоделировать в Blender', 'Экспорт GIF <2 МБ', 'Загрузить'] },
  { id: 34, text: 'Подготовить мини-лекцию (5 слайдов) для студентов', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Создать Google Slides', '5 слайдов: ввод→вывод', 'Ссылка в чат'] },
  { id: 35, text: 'Обновить раздел «Дорожная карта»', time: 60, complexity: 'medium', zeta: 5,
    checklist: ['Проверить устаревшие пункты', 'Добавить новые', 'PR в GitHub'] },
  { id: 36, text: 'Нарисовать 3-кадровый комикс о TZ', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Набросать эскиз', 'Отрисовать', 'Опубликовать PNG'] },
  { id: 37, text: 'Записать видео-гайд «Как получить Z-ID за 2′»', time: 75, complexity: 'medium', zeta: 6,
    checklist: ['Запустить screen-recorder', 'Дикторский текст', 'Загрузка'] },
  { id: 38, text: 'Провести опрос “Верите ли в плоскую Землю?” в VK', time: 30, complexity: 'medium', zeta: 5,
    checklist: ['Создать опрос', 'Прикрепить к посту', 'Скрин результатов'] },
  { id: 39, text: 'Настроить автопостинг RSS в VK-группу', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Выбрать IFTTT/Zapier', 'Добавить RSS', 'Тестовый пост'] },
  { id: 40, text: 'Запустить пилот e-mail рассылку «Z-Digest»', time: 120, complexity: 'medium', zeta: 10,
    checklist: ['Собрать 5 новостей', 'Сверстать письмо', 'Отправить через Mailchimp'] },

  /* ────────────  🚀 СЛОЖНЫЕ  (15–20 ZETA, ≥4 ч) ──────────── */
  { id: 41, text: 'Перевести весь сайт на английский', time: 360, complexity: 'hard', zeta: 20,
    checklist: ['Экспорт i18n-файлов', 'Перевод', 'PR в GitHub'] },
  { id: 42, text: 'Настроить GitHub Actions для автодеплоя', time: 240, complexity: 'hard', zeta: 15,
    checklist: ['Создать workflow', 'Добавить секреты', 'Тестовый билд'] },
  { id: 43, text: 'Интерактивная карта анклавов (Google Maps API)', time: 360, complexity: 'hard', zeta: 20,
    checklist: ['Получить API-ключ', 'Собрать markers.json', 'Интеграция'] },
  { id: 44, text: 'Редизайн главной страницы (Figma → React)', time: 480, complexity: 'hard', zeta: 20,
    checklist: ['Сделать макет', 'Сверстать компонент', 'PR'] },
  { id: 45, text: 'Записать 3 видео-урока “Введение в зететику”', time: 480, complexity: 'hard', zeta: 20,
    checklist: ['Написать сценарий', 'Съёмка и монтаж', 'Загрузка на Rutube'] },
  { id: 46, text: 'Разработать Telegram-бот «Квест-менеджер»', time: 420, complexity: 'hard', zeta: 20,
    checklist: ['Создать бота', 'Написать код (grammY)', 'Запустить на Heroku'] },
  { id: 47, text: 'Организовать офлайн-митап (20 чел, стрим)', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Забронировать зал', 'Разослать приглашения', 'Провести трансляцию'] },
  { id: 48, text: 'Краудфандинг-кампания на Boomstarter', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Подготовить видео', 'Описать цели', 'Запустить сбор'] },
  { id: 49, text: 'Создать PWA-приложение «Z-ID Wallet»', time: 720, complexity: 'hard', zeta: 20,
    checklist: ['React+SW', 'QR-сканер', 'Деплой на Netlify'] },
  { id: 50, text: 'Написать white-paper TZ (3000 слов)', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Собрать структуру', 'Написать главы', 'Верстка в LaTeX'] },
  // … до 100 по той же схеме
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
        <p>Фильтр по длительности и пометка «избранное» через ⭐.</p>

        <div className="filter">
          <label>Максимальное время: {filterMax <= 60 ? `${filterMax}′` : `${Math.floor(filterMax/60)} ч`}</label>
          <input
            type="range"
            min={5}
            max={720}
            step={5}
            value={filterMax}
            onChange={e => setFilterMax(+e.target.value)}
          />
        </div>

        {levels.map(({ key, title }) => (
          <section key={key}>
            <h2>{title}</h2>
            <div className="tasks-list">
              {filtered.filter(t => t.complexity === key).map(t => (
                <div key={t.id} className="task-card">
                  <div className="task-header">
                    <span>{t.id}. {t.text}</span>
                    <button
                      className={`fav ${favorites.includes(t.id) ? 'active' : ''}`}
                      onClick={() => toggleFav(t.id)}
                      aria-label="Избранное"
                    >★</button>
                  </div>
                  <div className="task-meta">
                    ⏱ {t.time <= 60 ? `${t.time}′` : `${Math.floor(t.time/60)} ч`}  
                    +{t.zeta} ZETA
                    {currentUrl && (
                      <span className="share">
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(t.text)}`}
                          target="_blank" rel="noopener noreferrer"
                        >Telegram</a>
                        {' | '}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(t.text + ' ' + currentUrl)}`}
                          target="_blank" rel="noopener noreferrer"
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
          <form action="https://formspree.io/f/ВАШ_ИД" method="POST" className="report-form">
            <input name="z_id" placeholder="Z-ID" required />
            <input name="task_ids" placeholder="Номера задач (через запятую)" required />
            <input name="links" placeholder="Ссылки на материалы" required />
            <textarea name="comment" placeholder="Комментарий (опционально)" />
            <button type="submit">Отправить отчёт</button>
          </form>
        </section>
      </main>

      <style jsx>{`
        .wrapper { max-width: 960px; margin: auto; padding: 2rem 1rem; }
        .filter { margin: 1rem 0; }
        .tasks-list { display: grid; gap: 1rem; }
        @media (min-width: 600px) { .tasks-list { grid-template-columns: 1fr 1fr } }
        .task-card { border:1px solid #ddd; padding:1rem; border-radius:4px; background:#fff; }
        .task-header { display:flex; justify-content:space-between; align-items:center; }
        .fav { background:none; border:none; font-size:1.5rem; color:#ccc; cursor:pointer; padding:0; }
        .fav:hover, .fav.active { color:gold; }
        .task-meta { font-size:.9rem; margin-top:.5rem; display:flex; align-items:center; gap:.5rem; }
        .share a { margin-left:.5rem; font-size:.8rem; text-decoration:none; color:#0077cc; }
        details { margin-top:.5rem; }
        summary { cursor:pointer; font-weight:bold; }
        .report { margin-top:2rem; padding:1.5rem; background:#f9f9f9; border-radius:4px; }
        .report-form { display:grid; gap:1rem; max-width:600px; }
        input, textarea { padding:.75rem; border:1px solid #ccc; border-radius:4px; width:100%; }
        button { padding:.75rem 1.5rem; background:#4caf50; color:#fff; border:none; border-radius:4px; cursor:pointer; }
      `}</style>
    </>
  )
}
