// pages/about.js
import Head from 'next/head'
import Link from 'next/link'

export default function About() {
  return (
    <main
      className="wrapper"
      style={{
        textAlign: 'justify',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '2rem 1rem',
        lineHeight: '1.7',
      }}
    >
      <Head>
        <title>О государстве — Terra Zetetica</title>
      </Head>

      {/* --- HERO изображение макета под Куполом --- */}
      <img
        src="/images/flat-earth.jpg"
        alt="Исторический макет под куполом"
        style={{
          width: '100%',
          maxWidth: '520px',
          display: 'block',
          margin: '0 auto 2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}
      />

      <h1>О государстве Terra Zetetica</h1>

      <p>
        В XX веке народ без территории, армии и международного признания основал Израиль. Это стало возможным благодаря внутренней идентичности, общей цели и воле к самоопределению.
      </p>
      <p>
        Сегодня мы становимся свидетелями рождения <strong>нового типа государства — Terra Zetetica</strong>. Это не концепт, не утопия, не цифровой аватар.
      </p>
      <p>
        <strong>Это реальное государство</strong>, основанное на Конституции, паспортной системе, DAO‑управлении, сети физических анклавов и общности мировоззрения. Наука больше не может быть догмой; Terra Zetetica утверждает право на наблюдение, логику и самостоятельное знание через <strong>зететическую методологию</strong>.
      </p>

      {/* --- Кнопка скачивания Конституции --- */}
      <p style={{ textAlign: 'center', margin: '2rem 0' }}>
        💾 <strong>Скачать PDF‑версию Конституции v1.2 (19‑06‑2025)</strong><br />
        <a
          className="btn primary"
          href="/constitution-terra-zetetica-1-2.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: '1rem' }}
        >
          📜 Скачать с сайта
        </a>
      </p>

      {/* --- Анклавы --- */}

    <h2>Физическая территория: анклавы Terra Zetetica</h2>
      <p>
        Сегодня в России и Беларуси действуют <strong>первые физические анклавы</strong>. 
        Это не просто объединения — это <strong>участки недвижимости и земли</strong>, официально заявленные гражданами, 
        зарегистрированные в DAO и сохранённые в IPFS.
      </p>
      <p>
        <strong>Анклав — это полноценная часть территории государства.</strong> Он может включать жильё, хозяйственную зону, общественное пространство и флаг Terra Zetetica.
      </p>

      {/* --- Статистика и позиции СМИ --- */}
      <h2>Гражданская база: Россия и мир</h2>
      <ul>
        <li>
          <strong>🇷🇺 2018 г.</strong> — по опросу ВЦИОМ, 3% россиян считают, что Земля плоская. 
          Это более <strong>4,4 миллиона человек</strong>. 👉 <a href="https://vz.ru/news/2018/7/27/934460.html" target="_blank">Источник (ВЗГЛЯД)</a>
        </li>
        <li>
          <strong>🇷🇺 2018 г.</strong> — официальные российские государственные СМИ открыто публикуют материалы, 
          признающие научные исследования по плоской Земле. 👉 <a href="https://tass.ru/press-relizy/5077491" target="_blank">Источник (TASS, официальный релиз)</a>
        </li>
        <li>
          <strong>🇷🇺 2022 г.</strong> — по новому исследованию ВЦИОМ, 35% россиян считают, что Солнце вращается вокруг Земли. 
          👉 <a href="https://www.vedomosti.ru/society/news/2022/08/02/934109-35-rossiyan-schitayut-chto-solntse-vraschaetsya-vokrug-zemli" target="_blank">Источник (Ведомости)</a>
        </li>
        <li>
          <strong>🇺🇸 США</strong> — по данным Carsey Institute, около 10% американцев считают, что Земля плоская. 
          Это <strong>33 миллиона человек</strong>. 👉 <a href="https://carsey.unh.edu/publication/conspiracy-vs-science-survey-us-public-beliefs" target="_blank">Carsey Institute</a>
        </li>
      </ul>
      <p><strong>Мировой прогноз:</strong> 100 – 150 млн человек симпатизируют альтернативным космологиям.</p>


      {/* --- Факты / структура --- */}
      <h2>Факты и структура</h2>
      <ul>
        <li>✅ Запущен <strong>Zetetic ID</strong> — цифровой паспорт гражданина</li>
        <li>✅ Документы верифицируются через <strong>IPFS</strong></li>
        <li>✅ <strong>DAO</strong>: граждане управляют государством напрямую</li>
        <li>✅ <strong>Созданы первые физические анклавы</strong> с территорией, признанной государством Terra Zetetica и зарегистрированной на глобальном уровне</li>

      </ul>

      {/* --- Ключевые технологии --- */}
      <h2>Ключевые технологии</h2>
      <ul>
        <li><strong>DAO</strong> — прямое голосование граждан через смарт‑контракты.</li>
        <li><strong>IPFS</strong> — неизменяемое хранение Конституции, паспортов и архивов.</li>
      </ul>

      {/* --- Прогноз --- */}
      <h2>Прогноз развития (2026 – 2040)</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Год</th><th>Развитие</th><th>Значимость</th></tr>
          </thead>
          <tbody>
            <tr><td>2026</td><td>10+ анклавов · 100 000 граждан</td><td>Ядро сети в 5+ странах</td></tr>
            <tr><td>2030</td><td>3 000 анклавов · 50 млн граждан</td><td>≈ Лихтенштейн + Сан‑Марино</td></tr>
            <tr><td>2035</td><td>15 000 анклавов · 70 млн граждан</td><td>Площадь &gt; Люксембурга</td></tr>
            <tr><td>2040</td><td>100 000 анклавов · 250 млн граждан</td><td>Соизмеримо с Израилем</td></tr>
          </tbody>
        </table>
      </div>

      {/* --- Челлендж --- */}
      <p>
        🏠 <Link href="/dom">Челлендж «Докажи шар — получи дом»</Link> открыт для всех.
      </p>

      {/* --- Гражданство --- */}
      <h2>Гражданство</h2>
      <img
        src="/images/passport-terra-zetetica.jpg"
        alt="Паспорт Terra Zetetica"
        style={{ width: '100%', maxWidth: '460px', margin: '1rem auto', display: 'block', borderRadius: '12px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}
      />
      <p>
        Гражданство Terra Zetetica не требует отказа от текущих паспортов; оно подтверждает принадлежность к сообществу свободы и знания.
      </p>

      <p style={{ fontWeight: '600', marginTop: '2rem' }}>
        Terra Zetetica — это не просто идея. Это реальность, формирующаяся на наших глазах.
        Присоединяйтесь к нам и станьте частью нового государства, основанного на истине и стремлении к знанию.
      </p>

    </main>
  );
}
