// pages/help-us.js
import Head from 'next/head'

const complexityLabels = {
  simple: { label: '⭐ Простая', zeta: '1–3 ZETA' },
  medium: { label: '🌟 Средняя', zeta: '5–10 ZETA' },
  hard:   { label: '🚀 Сложная', zeta: '15–20 ZETA' },
};

const tasks = [
  { id: 1,   text: 'Репостить анонсы TZ в ВКонтакте', time: '10 мин', complexity: 'simple', zeta: 1 },
  { id: 2,   text: 'Создать и вести группу TZ в VK', time: '1 час',   complexity: 'medium', zeta: 5 },
  { id: 3,   text: 'Постить истории в Instagram с фактами о TZ', time: '15 мин', complexity: 'simple', zeta: 1 },
  { id: 4,   text: 'Запустить региональный Telegram-канал TZ', time: '20 мин', complexity: 'simple', zeta: 1 },
  { id: 5,   text: 'Перевести сайт проекта на русский', time: '2 ч',     complexity: 'hard',   zeta: 10 },
  { id: 6,   text: 'Написать гостевой пост на vc.ru или Habr', time: '3 ч', complexity: 'hard',   zeta: 8 },
  { id: 7,   text: 'Снять 30-сек видео «Почему я в TZ»', time: '30 мин', complexity: 'medium', zeta: 2 },
  { id: 8,   text: 'Сделать инфографику «Как работает DAO TZ»', time: '1 ч', complexity: 'medium', zeta: 3 },
  { id: 9,   text: 'Организовать офлайн-встречу flat-earth сообщества', time: '4 ч', complexity: 'hard', zeta: 15 },
  { id: 10,  text: 'Подготовить и разослать пресс-релиз в локальные СМИ', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 11,  text: 'Запустить подкаст о плоской Земле и TZ', time: '3 ч', complexity: 'hard', zeta: 10 },
  { id: 12,  text: 'Сделать подборку мемов про TZ', time: '1 ч', complexity: 'simple', zeta: 1 },
  { id: 13,  text: 'Перевести Конституцию TZ на татарский или башкирский', time: '3 ч', complexity: 'hard', zeta: 8 },
  { id: 14,  text: 'Запустить email-рассылку «Zetetic Digest»', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 15,  text: 'Сделать аудио-гид по сайту TZ (60 сек)', time: '1 ч', complexity: 'medium', zeta: 3 },
  { id: 16,  text: 'Настроить GitHub Actions для автодеплоя сайта', time: '2 ч', complexity: 'hard', zeta: 10 },
  { id: 17,  text: 'Написать статью о ZetaCoin для VK-блога', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 18,  text: 'Подготовить «шаблон анклава» в формате PDF', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 19,  text: 'Организовать конкурс логотипов анклава', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 20,  text: 'Собрать интервью с первыми гражданами TZ', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 21,  text: 'Запустить челлендж #ЯвTZ в TikTok', time: '1 ч', complexity: 'simple', zeta: 2 },
  { id: 22,  text: 'Разместить афиши TZ в локальных кафе/коворкингах', time: '2 ч', complexity: 'simple', zeta: 2 },
  { id: 23,  text: 'Сделать видеогайд «Как подключить MetaMask»', time: '1 ч', complexity: 'medium', zeta: 5 },
  { id: 24,  text: 'Организовать мини-лекцию в университете', time: '3 ч', complexity: 'hard', zeta: 15 },
  { id: 25,  text: 'Создать карту анклавов TZ в Google Maps', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 26,  text: 'Разработать чат-бота для VK с квизами по TZ', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 27,  text: 'Подготовить кейс-стади для LinkedIn', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 28,  text: 'Запустить VR-тур по анклаву (прототип)', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 29,  text: 'Организовать AMA-сессию в Telegram', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 30,  text: 'Сделать подборку статей про зететику', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 31,  text: 'Нарисовать набор NFT-марок TZ', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 32,  text: 'Создать демо-бота для отчётов в Discord', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 33,  text: 'Организовать флешмоб «Выйди из Матрицы»', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 34,  text: 'Запустить Telegram-игру «Завоюй анклав»', time: '6 ч', complexity: 'hard', zeta: 15 },
  { id: 35,  text: 'Перевести сайт TZ на украинский', time: '3 ч', complexity: 'hard', zeta: 8 },
  { id: 36,  text: 'Разработать «Z-метрологию» (единицы TZ)', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 37,  text: 'Создать «NearSky» стрим-камеру на IPFS', time: '6 ч', complexity: 'hard', zeta: 15 },
  { id: 38,  text: 'Провести фото-репортаж из действующего анклава', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 39,  text: 'Написать методичку «Как стать Zetetic-послом»', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 40,  text: 'Организовать «книжный клуб» по Zetetic-литературе', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 41,  text: 'Запустить серию комиксов о плоской Земле', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 42,  text: 'Провести краудфандинг-кампанию в РФ', time: '4 ч', complexity: 'hard', zeta: 15 },
  { id: 43,  text: 'Создать учебное видео «Что такое IPFS-паспорт»', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 44,  text: 'Разработать браузерный плагин «Flat-Earth»', time: '8 ч', complexity: 'hard', zeta: 20 },
  { id: 45,  text: 'Провести серию сторис «20 дней в TZ»', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 46,  text: 'Организовать крауд-ревью научных статей', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 47,  text: 'Сделать веб-форму предложений по анклавам', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 48,  text: 'Создать «путеводитель по зоне TZ» в PDF', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 49,  text: 'Организовать локальный митап «Zetetic Nights»', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 50,  text: 'Разработать иконки для TZ-приложения', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 51,  text: 'Запустить канал TZ на Яндекс.Дзен', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 52,  text: 'Написать серию постов о DeFi-потенциале TZ', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 53,  text: 'Провести вебинар «Как работает Z-Coin»', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 54,  text: 'Организовать тест-нет майнинг ZETA', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 55,  text: 'Создать и вести чат-бот «Новости ZETA-курса»', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 56,  text: 'Написать гайд «Как создать свой анклав»', time: '2 ч', complexity: 'medium', zeta: 5 },
  { id: 57,  text: 'Организовать сбор средств на оборудование анклава', time: '4 ч', complexity: 'hard', zeta: 15 },
  { id: 58,  text: 'Провести онлайн-экспедицию «За края купола»', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 59,  text: 'Сделать серию иллюстраций «Плоская Земля»', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 60,  text: 'Запустить Telegram-канал «Zetetic Science»', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 61,  text: 'Перевести основную документацию TZ на казахский', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 62,  text: 'Серией сторис рассказать о Z-метрологии', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 63,  text: 'Организовать челлендж по созданию стихов о TZ', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 64,  text: 'Написать обзор «Как работает DAO» для Dev.to', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 65,  text: 'Сделать гайд-видео «Как редактировать карту TZ»', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 66,  text: 'Разработать мобильный прототип Z-ID', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 67,  text: 'Организовать фото-охоту за «местами силы» TZ', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 68,  text: 'Подготовить и провести курс «Zetetic Research»', time: '8 ч', complexity: 'hard', zeta: 20 },
  { id: 69,  text: 'Создать VR-модель «купол над Землей»', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 70,  text: 'Организовать серию подкастов о Z-банке', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 71,  text: 'Запустить селфи-флешмоб «Я в TZ» в Snapchat', time: '1 ч', complexity: 'simple', zeta: 2 },
  { id: 72,  text: 'Разработать шаблон NFT-паспорта TZ', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 73,  text: 'Снять интервью-ролик с основателем TZ', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 74,  text: 'Запустить челлендж по крауд-ревью статей', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 75,  text: 'Создать серию мемов про «Анклавы TZ»', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 76,  text: 'Организовать хакатон по DApp для TZ', time: '8 ч', complexity: 'hard', zeta: 20 },
  { id: 77,  text: 'Перевести сайт TZ на башкирский', time: '3 ч', complexity: 'hard', zeta: 8 },
  { id: 78,  text: 'Создать и вести чат «Zetetic Help» в VK', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 79,  text: 'Разработать и опубликовать блок-чейн гайд', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 80,  text: 'Организовать выставку карт TZ в галерее', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 81,  text: 'Сделать серию учебных видео по z-методу', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 82,  text: 'Подготовить и запустить VR-посольство TZ', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 83,  text: 'Написать и разослать презентацию для инвесторов', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 84,  text: 'Организовать местный Meetup TZ в вашем городе', time: '4 ч', complexity: 'medium', zeta: 5 },
  { id: 85,  text: 'Запустить квест-игру «Найди землю TZ»', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 86,  text: 'Разработать иконки для социальной сети TZ', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 87,  text: 'Создать Telegram-бота для голосований', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 88,  text: 'Провести серию уроков для школьников о TZ', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 89,  text: 'Организовать «День открытых дверей» анклава', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 90,  text: 'Создать и вести телеграм-канал «Z-метро»', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 91,  text: 'Написать и презентовать Whitepaper TZ', time: '8 ч', complexity: 'hard', zeta: 20 },
  { id: 92,  text: 'Запустить серию обучающих стримов по Solidity', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 93,  text: 'Организовать совместный проект с вузом', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 94,  text: 'Сделать подборку отзывов граждан TZ', time: '2 ч', complexity: 'simple', zeta: 3 },
  { id: 95,  text: 'Запустить чат-бот для VK-группы TZ', time: '4 ч', complexity: 'hard', zeta: 10 },
  { id: 96,  text: 'Организовать акцию «Я вышел из глобуса» офлайн', time: '5 ч', complexity: 'hard', zeta: 15 },
  { id: 97,  text: 'Создать и вести канал «Z-DIY технологии»', time: '3 ч', complexity: 'medium', zeta: 5 },
  { id: 98,  text: 'Провести онлайн-экспедицию за куполом', time: '6 ч', complexity: 'hard', zeta: 20 },
  { id: 99,  text: 'Создать комикс «Приключения Zetetic»', time: '4 ч', complexity: 'hard', zeta: 15 },
  { id: 100, text: 'Организовать Globe-Breaking Marathon', time: '8 ч', complexity: 'hard', zeta: 20 },
];

export default function HelpUs() {
  return (
    <>
      <Head>
        <title>Внести вклад | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Внести вклад в Terra Zetetica</h1>
        <p>Выбери задачу и получи ZETA за свой вклад!</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              {['#', 'Задача', 'Время', 'Сложность', 'Награда'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #ddd' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.id}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.text}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.time}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  {complexityLabels[task.complexity].label}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{task.zeta} ZETA</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ marginTop: '2rem' }}>Легенда по сложности</h2>
        <ul>
          {Object.values(complexityLabels).map(({ label, zeta }) => (
            <li key={label}>{label} — {zeta}</li>
          ))}
        </ul>

        <section style={{ marginTop: '3rem', padding: '2rem', background: '#f9f9f9', borderRadius: 8 }}>
          <h2>📬 Отчёт о выполненной задаче</h2>
          <p>Укажи свой Telegram-ID, номер задания и ссылки на подготовленные материалы. Мы проверим и начислим ZETA.</p>
          <form 
            action="https://formspree.io/f/mbloweze" 
            method="POST" 
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 600 }}
          >
            <input type="text" name="telegram_id" placeholder="Telegram-ID (число)" required style={{ padding:'0.75rem' }}/>
            <input type="text" name="task_ids" placeholder="Номера заданий (через запятую)" required style={{ padding:'0.75rem' }}/>
            <input type="url"  name="links" placeholder="Ссылки на материалы" required style={{ padding:'0.75rem' }}/>
            <input type="url"  name="file_link" placeholder="Ссылка на Google Drive/Dropbox (если есть)" style={{ padding:'0.75rem' }}/>
            <button type="submit" className="btn primary" style={{ maxWidth:200 }}>Отправить отчёт</button>
          </form>
        </section>
      </main>
    </>
  )
}
