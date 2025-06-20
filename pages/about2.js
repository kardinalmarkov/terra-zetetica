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
        Сегодня мы видим <strong>смену парадигмы</strong>: от слепого доверия «официальной науке» к модели, 
        где <strong>каждый человек — исследователь</strong>. Terra Zetetica — первое государство, 
        построенное целиком на этом принципе.
      </p>


      {/* --- Челлендж «Докажи шар — получи дом» (выше по странице) --- */}
      <section
        id="challenge"
        style={{
          margin: '2.5rem 0',
          padding: '1.5rem',
          borderLeft: '6px solid #ffbf00',
          background: '#fff8e6',
          borderRadius: '8px',
        }}
      >
        <h2 style={{ marginTop: 0 }}>🏠 Челлендж «Докажи шар — получи дом»</h2>
        <p>
          Государство Terra Zetetica открывает публичный вызов: <strong>докажите экспериментально шарообразность Земли</strong> и
          получите <strong>дом в Европе</strong>. Задача челленджа —
          популяризировать зететический метод и запустить собственное мышление у тех, кто ещё
          полагается на догмы. 
          <Link href="/dom" target="_blank" rel="noopener noreferrer"> Читать условия&nbsp;↗</Link>

        </p>
      </section>

      <p>
        <strong>Это реальное государство</strong>, основанное на Конституции, паспортной системе, DAO‑управлении и 
        сети зарегистрированных анклавов. Мы используем <strong>зететический метод</strong> — 
        наблюдение, логику и эксперимент — вместо догмы.
      </p>




{/* --- Кнопка скачивания Конституции и стать гражданином --- */}
<p style={{ textAlign: 'center', margin: '2rem 0' }}>
  💾 <strong>Скачать PDF‑версию Конституции v1.2 (19‑06‑2025)</strong><br />
  <a
    className="btn primary"
    href="/constitution-terra-zetetica-1-2.pdf"
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'inline-block', margin: '1rem 0.5rem' }}
  >
    📜 Скачать Конституцию
  </a>
  <Link
    href="/apply"
    className="btn primary"
    style={{ display: 'inline-block', margin: '1rem 0.5rem' }}
  >
    🪪 Стать гражданином
  </Link>
</p>


      {/* --- Анклавы --- */}

    <h2>Физическая территория: анклавы Terra Zetetica</h2>
      <p>
        Сегодня в России и Белоруссии действуют <strong>первые физические анклавы</strong>. 
        Это не просто объединения — это <strong>участки недвижимости и земли</strong>, официально заявленные гражданами, 
        зарегистрированные в DAO и сохранённые в IPFS.
      </p>
      <p>
        <strong>Анклав — это полноценная часть территории</strong> государства: жильё, хозяйственная зона, общественное пространство и флаг Terra Zetetica.
      </p>


      {/* ---------- СМЕНА ПАРАДИГМЫ: ЦИФРЫ ---------- */}
      <h2>Смена парадигмы уже идёт</h2>
      <p>
        Недоверие к единой «научной» картине мира растёт во всём мире; 
        цифры ниже — лишь маркер глубинного запроса общества на самостоятельное мышление.
      </p>

      <ul>
        <li>
          🇷🇺 <strong>3% </strong> россиян уверены, что Земля плоская (ВЦИОМ, 2018). 
          Это более <strong>4,4 миллиона человек</strong>. 👉 <a href="https://vz.ru/news/2018/7/27/934460.html" target="_blank">Источник (ВЗГЛЯД)</a>
        </li>
        <li>
          🇷🇺 <strong>2018 г.</strong> — официальные российские государственные СМИ открыто публикуют материалы, 
          признающие научные исследования и факты по плоской Земле. 👉 <a href="https://tass.ru/press-relizy/5077491" target="_blank">Источник (TASS, официальный релиз)</a>
        </li>
        <li>
          🇷🇺 <strong>35%</strong> опрошенных считают, что Солнце вращается вокруг Земли (ВЦИОМ, 2022). 
          👉 <a href="https://www.vedomosti.ru/society/news/2022/08/02/934109-35-rossiyan-schitayut-chto-solntse-vraschaetsya-vokrug-zemli" target="_blank">Источник (Ведомости)</a>
        </li>
        <li>
          🇺🇸 <strong>10% </strong> американцев также уверены в альтернативной геомодели. 
          Это <strong>33 миллиона человек</strong>. 👉 <a href="https://carsey.unh.edu/publication/conspiracy-vs-science-survey-us-public-beliefs" target="_blank">Carsey Institute</a>
        </li>
      </ul>

      <p>
        Аналитики оценивают мировое сообщество сторонников альтернативных космологий в <strong>100 – 150 млн человек</strong>. 
        Это огромный пласт граждан, готовых к новой культуре знания.
      </p>


      {/* --- Факты / структура --- */}
      <h2>Факты и структура</h2>
      <ul>
        <li>✅ Запущен <strong>Zetetic ID</strong> — цифровой паспорт гражданина</li>
        <li>✅ Документы верифицируются через <strong>IPFS</strong></li>
        <li>✅ <strong>DAO</strong>: граждане управляют государством напрямую</li>
        <li>✅ <strong>Созданы первые физические анклавы</strong> с территорией, признанной государством Terra Zetetica</li>

      </ul>

      {/* --- Ключевые технологии --- */}
      <h2>Ключевые технологии</h2>
      <ul>
        <li><strong>DAO</strong> — прямое голосование граждан через блокчейн без посредников.</li>
        <li><strong>IPFS</strong> — неизменяемое хранение Конституции, паспортов и архивов.</li>
      </ul>

      {/* --- Прогноз --- */}
      <h2>Прогноз развития численности (2026 – 2040)</h2>
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
        Terra Zetetica — не идея, а реальность, формирующаяся на наших глазах. Присоединяйтесь!
      </p>

    </main>
  );
}
