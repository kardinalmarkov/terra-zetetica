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
        <span title="Нужна помощь с регистрацией? Обратитесь в чат или напишите в Контактах" style={{ cursor: 'help' }}>
          ❓
        </span>
      </>,
      <>
        Скачал и сохранил NFT-паспорт (PDF + CID){' '}
        <span
          title="Сохраните копию в безопасном месте, например, на IPFS или в личном хранилище"
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
          title="Скачайте шаблон флага в разделе «Материалы» на сайте"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      <>
        Снял фото/видео с места и отправил отчёт в архив проекта через форму в «Контактах»{' '}
        <span
          title="Форма отчёта доступна в разделе «Контакты»"
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
      <>
        Изучил возможности внедрения Z-coin в экономику анклава и сделал простой расчёт: «Сколько ZetaCoin к 2030?»{' '}
        <span
          title="Например: текущая эмиссия 1 000 000 Z, ежегодный рост 10 %, к 2030 получится ≈2 593 743 Z (1 000 000 × 1.1⁹)"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      <>
        Оценил потенциальный ВВП на душу населения: взял официальные данные РФ (~\$12 523) и РБ (~\$6 958) на 2023 год, сделал прогноз на 2030 год (+5 % ежегодно → РФ ≈\$17 600, РБ ≈\$9 800), и предположил «ВВП TZ-паспорт» при участии 10 000 граждан (например, \$200 000 на душу × 10 000 ≈ \$2 000 млн)
      </>,
      'Разработал план привлечения инвестиций: гранты, партнёрства с частными компаниями, выпуск локальных облигаций «TZ-Bond»',
      'Создал простую модель расходов и доходов анклава (укладка земледелия, облачные дата-центры, Z-маркетплейс)',
    ],
  },
  {
    section: '🧭 Участие и управление',
    subtitle: 'Как стать активным участником развития проекта',
    items: [
      'Принял участие в обсуждениях/опросах сообщества и внёс свои предложения в DAO',
      <>
        Ознакомился с текущими инициативами и предложил новую идею через форму в «Контактах»{' '}
        <span
          title="Выберите «Инициативы» в разделе «Контакты» для отправки своего предложения"
          style={{ cursor: 'help' }}
        >
          ❓
        </span>
      </>,
      'Следую дорожной карте TZ и отслеживаю статус задач (делюсь обратной связью в чате)',
    ],
  },
  {
    section: '📢 Информационное участие',
    subtitle: 'Как вы можете распространять идеи Terra Zetetica',
    items: [
      'Рассказал одному или нескольким знакомым о проекте и пригласил их в чат/паблик',
      'Подписан и активен в официальных группах (Telegram, Discord, другие соцсети)',
      'Опубликовал статью, видео или обзор о TZ на личных страницах или сторонних ресурсах',
      'Поделился информацией про TZ в своих социальных сетях и отметил официальные аккаунты',
      'Ответил новичку или помог человеку разобраться с регистрацией и получением Z-ID',
    ],
  },
  {
    section: '🎨 Креативный вклад',
    subtitle: 'Для творческих людей: от дизайна до инструкций',
    items: [
      'Нарисовал или сгенерировал постер, символику или мем про TZ и выложил в галерею «Материалы»',
      'Написал инструкцию (например, «Как оформить анклав» или «Как завести Z-ID») и опубликовал через форму в «Контактах»',
      'Создал полезный шаблон или визуализацию (карту анклава, инфографику) и выложил как открытый ресурс',
    ],
  },
  {
    section: '🤝 Взаимодействие',
    subtitle: 'Как расширять сеть и объединяться с другими проектами',
    items: [
      'Пригласил новых граждан в TZ (разослал личное приглашение, поделился реферальной ссылкой в соцсетях)',
      'Наладил контакт с другим похожим проектом или блогером для совместных инициатив',
      'Отправил предложение о сотрудничестве (грант, обмен ресурсами) через раздел «Контакты»',
      'Сделал добровольный вклад в развитие — перевёл крипто-донат, предоставил ресурсы или услуги',
      'Помогаю новичкам: менторю, консультирую вопросы по регистрации, анклавам, DAO',
    ],
  },
  {
    section: '🔥 Хранение духа',
    subtitle: 'Как не потерять мотивацию и оставаться в «зоне Истины»',
    items: [
      'Не поддаюсь пропаганде: держу Истину в центре — периодически проверяю источники информации',
      'Постоянно обучаюсь: наблюдаю, анализирую, делаю выводы — веду личный «Z-дневник»',
      'Воодушевляю других примером: живу как гражданин нового мира — делюсь опытом в чате',
    ],
  },
]

export default function Checklist() {
  // Состояния для отмеченных пунктов и пользовательских задач
  const [checked, setChecked] = useState([])
  const [customTasks, setCustomTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // Загрузка состояния из localStorage при старте
  useEffect(() => {
    const savedChecked = JSON.parse(localStorage.getItem('tz-checklist') || '[]')
    setChecked(savedChecked)

    const savedCustom = JSON.parse(localStorage.getItem('tz-custom-tasks') || '[]')
    setCustomTasks(savedCustom)
  }, [])

  // Функция переключения чекбокса
  function toggleItem(id) {
    const next = checked.includes(id)
      ? checked.filter(i => i !== id)
      : [...checked, id]
    setChecked(next)
    localStorage.setItem('tz-checklist', JSON.stringify(next))
  }

  // Добавление новой пользовательской задачи
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

  // Функция копирования URL в буфер (Поделиться прогрессом)
  function shareProgress() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(
        () => alert('Ссылка на ваш чек-лист скопирована в буфер обмена. Поделитесь с друзьями!'),
        () => alert('Не удалось скопировать ссылку, попробуйте вручную')
      )
    } else {
      alert('Ваш браузер не поддерживает копирование: скопируйте адрес вручную')
    }
  }

  return (
    <main
      className="wrapper"
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem 1rem',
        position: 'relative',
      }}
    >
      <Head>
        <title>Чек-лист гражданина | Terra Zetetica</title>
      </Head>

      <h1 style={{ marginBottom: '1rem' }}>✅ Чек-лист гражданина Terra Zetetica</h1>
      <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#333' }}>
        Отмечай галочками, добавляй свои задачи и возвращайся позже — всё сохранится в браузере!
      </p>

      {/* Кнопка «Поделиться прогрессом» */}
      <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
        <button
          onClick={shareProgress}
          className="btn outline"
          style={{ padding: '0.45rem 1rem' }}
        >
          📤 Поделиться прогрессом
        </button>
      </div>

      {/* Блок с пользовательскими задачами */}
      <section
        style={{
          marginBottom: '2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: '#fafafa',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>✏️ Своё задание</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            placeholder="Введите задачу..."
            style={{
              flexGrow: 1,
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={handleAddCustomTask}
            className="btn primary"
            style={{ padding: '0.45rem 1rem' }}
          >
            Добавить
          </button>
        </div>
        {customTasks.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {customTasks.map(task => (
              <li
                key={task.id}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleCustomTask(task.id)}
                  style={{ marginRight: '0.75rem' }}
                />
                <span
                  style={{
                    flexGrow: 1,
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? '#777' : '#111',
                  }}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteCustomTask(task.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#c0392b',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    lineHeight: '1',
                  }}
                  title="Удалить задачу"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Основные разделы чеклиста */}
      {checklistBlocks.map((block, i) => (
        <section key={i} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', color: '#222' }}>
            {block.section}
          </h2>
          {/* Подзаголовок (subtitle) */}
          <h3
            style={{
              fontStyle: 'italic',
              color: '#555',
              marginBottom: '0.75rem',
              fontSize: '1rem',
            }}
          >
            {block.subtitle}
          </h3>
          <ul style={{ listStyle: 'none', paddingLeft: '0', margin: 0 }}>
            {block.items.map((item, j) => {
              const id = `${i}-${j}`
              return (
                <li key={id} style={{ margin: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked.includes(id)}
                      onChange={() => toggleItem(id)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <span style={{ color: checked.includes(id) ? '#555' : '#111' }}>
                      {item}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777', textAlign: 'center' }}>
        <p>
          🧭 Ты — часть смены парадигмы. Всё начинается с одного шага.
          <br />
          Supra Veritas Ordo.
        </p>
      </footer>
    </main>
  )
}
