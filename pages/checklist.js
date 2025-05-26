// pages/checklist.js
import Head from 'next/head'
import { useState, useEffect } from 'react'

const checklist = [
  { section: '✅ ЧЕК-ЛИСТ ГРАЖДАНИНА TERRA ZETETICA', items: [
    'Получил Zetetic ID и паспорт через @ZeteticID_bot',
    'Прочитал Конституцию Terra Zetetica',
    'Подтвердил свою приверженность Истине и зететике',
    'Разместил свои документы в IPFS или запросил помощь'
  ]},
  { section: '🏠 Анклав и территория', items: [
    'Обозначил свой анклав (комната, участок, дом и т.д.)',
    'Зарегистрировал его через DAO или через сообщество',
    'Установил символику (флаг, табличка, карта)',
    'Снял фото/видео и отправил отчёт в архив проекта'
  ]},
  { section: '🧭 Участие и управление', items: [
    'Принял участие в обсуждениях/опросах сообщества',
    'Ознакомился с инициативами и предложил свою',
    'Следую проектным планам и делюсь идеями'
  ]},
  { section: '📢 Информационное участие', items: [
    'Рассказал 1+ знакомому о проекте',
    'Подписан и активен в официальных группах',
    'Опубликовал статью, видео или обзор',
    'Поделился информацией в соцсетях',
    'Ответил новичку или помог разобраться'
  ]},
  { section: '🎨 Креативный вклад', items: [
    'Нарисовал или сгенерировал постер, символику, мем',
    'Написал инструкцию (как оформил анклав, как завести Z-ID и т.д.)',
    'Создал полезный шаблон или идею (карточка, визуализация и т.п.)'
  ]},
  { section: '🤝 Взаимодействие', items: [
    'Пригласил новых граждан',
    'Вышел на связь с другим проектом или блогером',
    'Отправил предложение о сотрудничестве',
    'Сделал добровольный вклад в развитие',
    'Помогаю новичкам, менторю или консультирую'
  ]},
  { section: '🔥 Хранение духа', items: [
    'Не поддаюсь пропаганде — держу Истину в центре',
    'Постоянно обучаюсь — наблюдаю, анализирую, делаю выводы',
    'Воодушевляю других примером — живу как гражданин нового мира'
  ]}
]

export default function Checklist() {
  const [checked, setChecked] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tz-checklist') || '[]')
    setChecked(saved)
  }, [])

  function toggle(index) {
    const next = checked.includes(index)
      ? checked.filter(i => i !== index)
      : [...checked, index]
    setChecked(next)
    localStorage.setItem('tz-checklist', JSON.stringify(next))
  }

  return (
    <main className="wrapper" style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Head>
        <title>Чек-лист гражданина | Terra Zetetica</title>
      </Head>
      <h1>✅ Чек-лист гражданина Terra Zetetica</h1>
      <p>Отмечай галочками и возвращайся позже — сохранится в браузере!</p>

      {checklist.map((block, i) => (
        <section key={i} style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '1rem 0' }}>{block.section}</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {block.items.map((item, j) => {
              const id = `${i}-${j}`
              return (
                <li key={id} style={{ margin: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checked.includes(id)}
                      onChange={() => toggle(id)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <footer style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#777' }}>
        <p>🧭 Ты — часть смены парадигмы. Всё начинается с одного шага.<br />Supra Veritas Ordo.</p>
      </footer>
    </main>
  )
}
