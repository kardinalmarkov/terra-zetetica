// pages/checklist.js
import Head from 'next/head'
import { useState, useEffect } from 'react'

const checklistBlocks = [
  {
    section: '🚀 Стартовый минимум',
    subtitle: 'Первое, что должен сделать любой новичок',
    items: [
      <>
        Зарегистрировался в{' '}
        <a
          href="https://t.me/ZeteticID_bot"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0066cc' }}
        >
          @ZeteticID_bot
        </a>{' '}
        и получил Z-ID{' '}
        <span
          title="Если возникнут сложности с регистрацией, напишите в чат проекта"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      <>
        Скачал и сохранил NFT-паспорт (PDF + CID){' '}
        <span
          title="Сохраните файл в личном хранилище (IPFS/локальный диск), чтобы не потерять доступ"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      <>
        Присоединился к официальному чату{' '}
        <a
          href="https://t.me/TerraZetChat"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0066cc' }}
        >
          TerraZetChat
        </a>{' '}
        и паблику{' '}
        <a
          href="https://t.me/TerraZetetica"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0066cc' }}
        >
          TerraZetetica
        </a>
      </>,
    ],
  },
  {
    section: '🏘️ Локальная активность',
    subtitle: 'Что можно и нужно делать жителям анклавов',
    items: [
      'Обозначил свой анклав (комната, участок, дом и т.д.) и зарегистрировал его в DAO или через сообщество',
      <>
        Установил символику (флаг, табличка, карта) на своём анклаве{' '}
        <span
          title="Шаблоны флага можно скачать в разделе «Материалы»"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      <>
        Снял фото/видео с места и отправил отчёт в архив проекта через форму в разделе «Контакты»{' '}
        <span
          title="Форма отчёта находится в «Контактах» → «Отправить отчёт анклава»"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      'Организовал первую локальную встречу граждан анклава (онлайн или офлайн) и опубликовал результаты в чате',
      'Разместил базовую информацию о своём анклаве в системе (координаты, краткое описание, контактные данные)',
    ],
  },
  {
    section: '📈 Инвестиции и экономика',
    subtitle: 'Для тех, кто хочет развивать экономику анклава',
    items: [
      'Изучил возможность внедрения Z-coin в экономику анклава и сделал примерный расчёт роста эмиссии (например, 10 000 Z → +10 % ежегодно → ≈23 600 Z за 8 лет)',
      'Проанализировал конкурирующие токены и подобрал выгодную модель распределения (форжирование, майнинг, стейкинг)',
      'Разработал план привлечения инвестиций: гранты, спонсоры, локальные DAO-мероприятия',
      'Составил таблицу доходов/расходов анклава (земледелие, дата-центры, Z-маркетплейс)',
    ],
  },
  {
    section: '🧭 Участие и управление',
    subtitle: 'Как стать активным участником развития проекта',
    items: [
      'Принял участие в обсуждениях/опросах сообщества и внёс свои предложения в DAO',
      <>
        Ознакомился с текущими инициативами и предложил новую идею через форму «Инициативы» в разделе «Контакты»{' '}
        <span
          title="В разделе «Контакты» → «Инициативы» можно оставить заявку"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      'Следую дорожной карте Terra Zetetica и отслеживаю статус задач (делюсь обратной связью в чате)',
    ],
  },
  {
    section: '📢 Информационное участие',
    subtitle: 'Как распространять идеи Terra Zetetica',
    items: [
      'Рассказал 1–2 знакомым о проекте и пригласил их в чат/паблик',
      'Подписан и активен в официальных группах (Telegram, Discord, другие социальные сети)',
      'Опубликовал статью, видео или обзор о TZ на личных страницах или сторонних ресурсах',
      'Поделился информацией про TZ в соцсетях с упоминанием официальных аккаунтов',
      'Помог новичкам: ответил на их вопросы по регистрации, Z-ID и участию в анклаве',
    ],
  },
  {
    section: '🎨 Креативный вклад',
    subtitle: 'Для творческих людей: от дизайна до инструкций',
    items: [
      'Нарисовал или сгенерировал постер, символику или мем про TZ и загрузил в раздел «Материалы»',
      'Написал инструкцию («Как оформить анклав» или «Как получить Z-ID») и отправил через форму в «Контакты»',
      'Создал шаблон или визуализацию (инфографику, карту анклава) и поделился ссылкой в чате',
    ],
  },
  {
    section: '🤝 Взаимодействие',
    subtitle: 'Как расширять сеть и объединяться с другими проектами',
    items: [
      'Пригласил новых граждан в TZ (рассылкой или через социальные сети)',
      'Наладил контакт с похожим проектом или блогером для совместных инициатив',
      'Отправил предложение о сотрудничестве (гранты, обмен ресурсами) через раздел «Контакты»',
      'Сделал добровольный вклад: пожертвовал ресурсы, услуги или Z-coin',
      'Менторю новичков: консультирую по вопросам регистрации, анклавов, DAO',
    ],
  },
  {
    section: '🔥 Хранение духа',
    subtitle: 'Как не потерять мотивацию и оставаться в «зоне Истины»',
    items: [
      'Не поддаюсь пропаганде: периодически проверяю официальные источники информации',
      'Постоянно обучаюсь: наблюдаю, анализирую, делаю выводы — веду личный «Z-дневник»',
      'Воодушевляю других примером: живу как гражданин нового мира и делюсь опытом в чате',
    ],
  },
]

export default function Checklist() {
  const [checked, setChecked] = useState([])
  const [customTasks, setCustomTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // Загрузка сохранённых данных из localStorage
  useEffect(() => {
    const savedChecked = JSON.parse(localStorage.getItem('tz-checklist') || '[]')
    setChecked(savedChecked)

    const savedCustom = JSON.parse(localStorage.getItem('tz-custom-tasks') || '[]')
    setCustomTasks(savedCustom)
  }, [])

  // Переключатель чекбокса
  function toggleItem(id) {
    const next = checked.includes(id)
      ? checked.filter(i => i !== id)
      : [...checked, id]
    setChecked(next)
    localStorage.setItem('tz-checklist', JSON.stringify(next))
  }

  // Добавление пользовательской задачи
  function handleAddCustomTask() {
    const text = newTask.trim()
    if (!text) return
    const id = `custom-${Date.now()}`
    const updated = [...customTasks, { id, text, done: false }]
    setCustomTasks(updated)
    localStorage.setItem('tz-custom-tasks', JSON.stringify(updated))
    setNewTask('')
  }

  // Переключение состояния пользовательской задачи
  function toggleCustomTask(id) {
    const updated = customTasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    )
    setCustomTasks(updated)
    localStorage.setItem('tz-custom-tasks', JSON.stringify(updated))
  }

  // Удаление пользовательской задачи
  function deleteCustomTask(id) {
    const updated = customTasks.filter(task => task.id !== id)
    setCustomTasks(updated)
    localStorage.setItem('tz-custom-tasks', JSON.stringify(updated))
  }

  return (
    <main className="wrapper">
      <Head>
        <title>Чек-лист гражданина | Terra Zetetica</title>
      </Head>

      <h1>✅ Чек-лист гражданина Terra Zetetica</h1>
      <p>
        Отмечай галочками, добавляй свои задачи и возвращайся позже — всё сохранится в браузере!
      </p>

      {/* Блок «Своё задание» */}
      <section className="custom-tasks">
        <h2>✏️ Своё задание</h2>
        <div className="custom-input-wrapper">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Введите задачу..."
          />
          <button className="btn primary" onClick={handleAddCustomTask}>
            Добавить
          </button>
        </div>

        {customTasks.length > 0 && (
          <ul className="custom-tasks-list">
            {customTasks.map(task => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleCustomTask(task.id)}
                  />
                  <span className={task.done ? 'done' : ''}>{task.text}</span>
                </label>
                <button
                  className="delete-btn"
                  onClick={() => deleteCustomTask(task.id)}
                  title="Удалить задачу"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Основные разделы чек-листа */}
      {checklistBlocks.map((block, i) => (
        <section key={i} className="block-section">
          <h2>{block.section}</h2>
          <h3>{block.subtitle}</h3>
          <ul className="block-list">
            {block.items.map((item, j) => {
              const id = `${i}-${j}`
              return (
                <li key={id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checked.includes(id)}
                      onChange={() => toggleItem(id)}
                    />
                    <span className={checked.includes(id) ? 'done' : ''}>
                      {item}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <footer className="checklist-footer">
        <p>🧭 Ты — часть смены парадигмы. Всё начинается с одного шага.<br />Supra Veritas Ordo.</p>
      </footer>
    </main>
  )
}
