// pages/help-us.js
import Head from 'next/head'
import { useState, useEffect } from 'react'

// tasks.js  (или вставьте прямо в help-us.js)
const allTasks = [
  /* ────────────  ⭐ ПРОСТЫЕ  (1-3 ZETA, до 15 мин) ──────────── */
  { id: 1,  text: 'Поставить лайк 👍 на пост TZ во ВКонтакте', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть пост', 'Нажать «Мне нравится»', 'Готово'] },
  { id: 2,  text: 'Поставить ⭐ в репозитории GitHub (terra-zetetica)', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Зайти на GitHub', 'Открыть репозиторий', 'Нажать «Star»'] },
  { id: 3,  text: 'Подписаться на Telegram-канал TZ', time: 3,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть t.me/terra_zetetica', 'Нажать «Join»', 'Сделать скрин как доказательство'] },
  { id: 4,  text: 'Поделиться ссылкой на сайт TZ в WhatsApp группе', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Скопировать ссылку terra-zetetica.org', 'Вставить в чат', 'Отправить сообщение'] },
  { id: 5,  text: 'Сделать репост в VK истории о плоской Земле', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Найти историю', 'Нажать «Поделиться»', 'Опубликовать на своей странице'] },
  { id: 6,  text: 'Добавить terra-zetetica.org в закладки браузера', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть сайт', 'Нажать Ctrl+D / «⭐»', 'Сохранить закладку'] },
  { id: 7,  text: 'Оставить эмодзи-реакцию в чате TZ', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Зайти в чат', 'Выбрать любое сообщение', 'Поставить реакцию'] },
  { id: 8,  text: 'Пригласить 3 друзей в Telegram-чат TZ', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Открыть чат', 'Нажать «Добавить участников»', 'Выбрать минимум трёх'] },
  { id: 9,  text: 'Сохранить обои “Flat Earth” и поставить на рабочий стол', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Скачать картинку', 'Открыть «Фон рабочего стола»', 'Установить обои'] },
  { id: 10, text: 'Отправить разработчикам баг-репорт (1 строка)', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Найти баг на сайте', 'Написать краткое описание', 'Отправить через форму обратной связи'] },
  { id: 11, text: 'Сделать сторис в Instagram о TZ с хэштегом #TerraZ', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Создать сторис', 'Добавить хэштег #TerraZ', 'Опубликовать'] },
  { id: 12, text: 'Проголосовать в текущем опросе DAO (через бота)', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Открыть бот', 'Найти активный опрос', 'Нажать вариант ответа'] },
  { id: 13, text: 'Отправить эмодзи 🌍 в общий чат “Я за TZ!”', time: 2,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть чат', 'Написать 🌍', 'Отправить'] },
  { id: 14, text: 'Сделать скриншот сайта и переслать другу', time: 10, complexity: 'simple', zeta: 1,
    checklist: ['Открыть сайт', 'Сделать скрин', 'Отправить другу в мессенджере'] },
  { id: 15, text: 'Внести правку в Wiki-док TZ (орфография)', time: 15, complexity: 'simple', zeta: 3,
    checklist: ['Перейти в GitHub Wiki', 'Исправить опечатку', 'Сохранить изменения'] },
  { id: 16, text: 'Поставить 👍 под видео на Rutube канале TZ', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть видео', 'Нажать «Нравится»', 'Сделать скрин'] },
  { id: 17, text: 'Сохранить сайт TZ в “Почитать позже” (Mobile)', time: 5,  complexity: 'simple', zeta: 1,
    checklist: ['Открыть меню браузера', 'Нажать «Читать позже»', 'Показать скрин'] },
  { id: 18, text: 'Отправить одну идею улучшения через форму идей', time: 15, complexity: 'simple', zeta: 2,
    checklist: ['Открыть /ideas', 'Заполнить поле', 'Отправить'] },
  { id: 19, text: 'Сделать реакцию 🔥 на комментарий другого гражданина', time: 5, complexity: 'simple', zeta: 1,
    checklist: ['Зайти в комментарии', 'Выбрать сообщение', 'Поставить 🔥'] },
  { id: 20, text: 'Заполнить mini-опрос “Почему мне интересна TZ”', time: 10, complexity: 'simple', zeta: 2,
    checklist: ['Открыть Google-форму', 'Ответить на 3 вопроса', 'Отправить'] },

  /* ────────────  🌟 СРЕДНИЕ (5-10 ZETA, 15-60 мин) ──────────── */
  { id: 21, text: 'Создать тематический мем о плоской Земле', time: 40, complexity: 'medium', zeta: 5,
    checklist: ['Открыть Canva', 'Сделать картинку + подпись', 'Опубликовать в чате'] },
  { id: 22, text: 'Написать короткий пост (≈200 слов) на VC.ru о TZ', time: 60, complexity: 'medium', zeta: 8,
    checklist: ['Авторизоваться на VC', 'Сделать черновик 200 слов', 'Опубликовать и прислать ссылку'] },
  { id: 23, text: 'Перевести страницу “Конституция” на английский', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Скачать текст', 'Перевести раздел', 'Pull-request в репозиторий'] },
  { id: 24, text: 'Смонтировать 30-секундный TikTok «Почему TZ»', time: 90, complexity: 'medium', zeta: 6,
    checklist: ['Снять 2-3 клипа', 'Смонтировать в CapCut', 'Загрузить с хэштегом #TerraZ'] },
  { id: 25, text: 'Сделать 5 стикеров для Telegram-пакета TZ', time: 60, complexity: 'medium', zeta: 5,
    checklist: ['Нарисовать/найти PNG', 'Загрузить в @stickers', 'Опубликовать ссылку'] },
  { id: 26, text: 'Собрать FAQ из 10 вопросов и ответов', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Собрать частые вопросы', 'Написать ответы', 'Добавить в docs/faq.md'] },
  { id: 27, text: 'Сделать инфографику «Как получить Z-ID»', time: 50, complexity: 'medium', zeta: 5,
    checklist: ['Открыть Figma/Canva', 'Нарисовать 3 шага', 'Экспортировать PNG'] },
  { id: 28, text: 'Организовать голосовой чат в Telegram (15 мин) и позвать 10 слушателей', time: 45, complexity: 'medium', zeta: 5,
    checklist: ['Назначить время', 'Сделать анонс', 'Провести эфир'] },
  { id: 29, text: 'Записать аудио-подкаст 3 мин про личный опыт', time: 45, complexity: 'medium', zeta: 5,
    checklist: ['Записать voice-note', 'Смонтировать', 'Отправить файл'] },
  { id: 30, text: 'Создать краткий гайд “Как репостить в VK правильно”', time: 60, complexity: 'medium', zeta: 5,
    checklist: ['Сделать текстовый документ', 'Добавить скрины', 'Залить в Google Docs'] },
  { id: 31, text: 'Перевести главную страницу на казахский язык', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Скопировать текст', 'Сделать перевод', 'Залить pull-request'] },
  { id: 32, text: 'Настроить RSS-фид сайта в Telegram-боте', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Создать бота', 'Подключить rss2tg', 'Прислать скрин работы'] },
  { id: 33, text: 'Сделать 5 GIF-стикеров движка плоской Земли', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Смоделировать в Blender/GIF', 'Оптимизировать <2 МБ', 'Загрузить'] },
  { id: 34, text: 'Подготовить мини-лекцию (слайды 5 шт) для студентов', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Создать Google Slides', '5 слайдов: ввод → вывод', 'Прислать ссылку'] },
  { id: 35, text: 'Обновить раздел “Дорожная карта” (Roadmap)', time: 60, complexity: 'medium', zeta: 5,
    checklist: ['Проверить устаревшие пункты', 'Внести новые даты', 'Коммит в repo'] },
  { id: 36, text: 'Нарисовать партию комиксов (3 кадра) о TZ', time: 90, complexity: 'medium', zeta: 8,
    checklist: ['Набросать раскадровку', 'Отрисовать', 'Опубликовать PNG'] },
  { id: 37, text: 'Записать видео-гайд “Как получить Z-ID за 2 мин”', time: 75, complexity: 'medium', zeta: 6,
    checklist: ['Скрин-рекордер', 'Дикторский текст', 'Загрузка на сайт'] },
  { id: 38, text: 'Сделать опрос в VK “Верите ли вы в плоскую Землю?”', time: 30, complexity: 'medium', zeta: 5,
    checklist: ['Создать опрос', 'Прикрепить к посту', 'Собрать скрин результатов'] },
  { id: 39, text: 'Настроить автопостинг RSS-фида в VK группу', time: 60, complexity: 'medium', zeta: 6,
    checklist: ['Выбрать сервис (ifttt/ zapier)', 'Добавить RSS', 'Тестовый пост'] },
  { id: 40, text: 'Запустить email-рассылку «Z-Digest» (пилотный выпуск)', time: 120, complexity: 'medium', zeta: 10,
    checklist: ['Собрать 5 новостей', 'Сверстать письмо', 'Отправить через Mailchimp'] },

  /* ────────────  🚀 СЛОЖНЫЕ (15-20 ZETA, ≥ 4 ч) ──────────── */
  { id: 41, text: 'Перевести весь сайт на английский язык', time: 360, complexity: 'hard', zeta: 20,
    checklist: ['Скачать строки i18n', 'Перевести полностью', 'Pull-request'] },
  { id: 42, text: 'Настроить GitHub Actions для автодеплоя', time: 240, complexity: 'hard', zeta: 15,
    checklist: ['Создать workflow', 'Добавить секреты', 'Проверить билд'] },
  { id: 43, text: 'Собрать интерактивную карту анклавов (Google Maps API)', time: 360, complexity: 'hard', zeta: 20,
    checklist: ['Получить API-ключ', 'Сделать markers.json', 'Интегрировать на страницу'] },
  { id: 44, text: 'Полный редизайн главной страницы (Figma → React)', time: 480, complexity: 'hard', zeta: 20,
    checklist: ['Сделать макет', 'Сверстать компонент', 'Залить PR'] },
  { id: 45, text: 'Записать 3 урока “Введение в зететику” (видео 5 мин)', time: 480, complexity: 'hard', zeta: 20,
    checklist: ['Сценарий 3 тем', 'Съёмка и монтаж', 'Загрузка на Rutube'] },
  { id: 46, text: 'Разработать Telegram-бот “Квест-менеджер”', time: 420, complexity: 'hard', zeta: 20,
    checklist: ['Создать бота BotFather', 'Node.js/grammY код', 'Запуск на Heroku'] },
  { id: 47, text: 'Организовать офлайн-митап (20 человек, помещение + стрим)', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Забронировать зал', 'Разослать приглашения', 'Провести трансляцию'] },
  { id: 48, text: 'Запустить краудфандинг-кампанию на Boomstarter', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Подготовить видео', 'Описать цели', 'Собрать 1-ю тысячу ₽'] },
  { id: 49, text: 'Создать мобильное PWA-приложение “Z-ID Wallet”', time: 720, complexity: 'hard', zeta: 20,
    checklist: ['React + Service Worker', 'QR-сканер Z-ID', 'Деплой в Netlify'] },
  { id: 50, text: 'Написать white-paper TZ (3000 слов, PDF)', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Собрать структуру', 'Написать 3 главы', 'Вёрстка в LaTeX'] },

  /* ДОПОЛНИТЕЛЬНЫЕ СЛОЖНЫЕ ДО 65 – 100 */
  { id: 51, text: 'Подготовить VR-тур по виртуальному анклаву', time: 420, complexity: 'hard', zeta: 20,
    checklist: ['Unreal Engine демо', 'Экспорт WebXR', 'Ссылка в чат'] },
  { id: 52, text: 'Сделать курс Solidity + Z-Token (3 урока)', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Скрипты смарт-контрактов', 'Презентации', 'Запись screencast'] },
  { id: 53, text: 'Настроить CI для lint + unit-tests сайта', time: 300, complexity: 'hard', zeta: 15,
    checklist: ['Добавить ESLint', 'Jest тесты', 'Push PR'] },
  { id: 54, text: 'Оптимизировать изображения (WebP + lazy-load) по всему сайту', time: 300, complexity: 'hard', zeta: 15,
    checklist: ['Преобразовать PNG→WebP', 'Добавить next/image', 'Проверить lighthouse'] },
  { id: 55, text: 'Миграция сайта на TypeScript', time: 720, complexity: 'hard', zeta: 20,
    checklist: ['Установить tsconfig', 'Поэтапно переименовать файлы', 'Исправить типы'] },
  { id: 56, text: 'Разработать плагин браузера «Flat-Earth Overlay»', time: 600, complexity: 'hard', zeta: 20,
    checklist: ['Manifest v3', 'Canvas overlay', 'Публикация в Chrome Web Store'] },
  { id: 57, text: 'Создать серию уроков Python-скриптов для IPFS', time: 480, complexity: 'hard', zeta: 20,
    checklist: ['5 скриптов', 'README', 'Запись видео-гайдов'] },
  { id: 58, text: 'Полноценный редизайн логотипа TZ (vector + guideline)', time: 360, complexity: 'hard', zeta: 15,
    checklist: ['Исследование', 'Sketch/Figma', 'Гайдбук PDF'] },
  { id: 59, text: 'Внедрить i18n (rus+eng+kaz) на всех страницах', time: 480, complexity: 'hard', zeta: 20,
    checklist: ['next-i18next', 'Создать json файлы', 'Проверить переключение'] },
  { id: 60, text: 'Организовать “Zetetic Hackathon” (48 часов, 5 команд)', time: 720, complexity: 'hard', zeta: 20,
    checklist: ['Партнёрство площадки', 'Регистрация участников', 'Онлайн стрим демо-дня'] },

  /* 61-100 — аналогично наполните (средние / сложные идеи: PWA-приложения, NFT-коллекция, боты, маркетинговые акции, R&D-статьи…). */
]
export default allTasks


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
