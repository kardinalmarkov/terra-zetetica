import Head from 'next/head'

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

      <img
        src="/images/flat-earth.jpg"
        alt="Плоская Земля"
        style={{
          width: '100%',
          maxWidth: '520px',
          height: 'auto',
          marginBottom: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />


      <h1>О государстве Terra Zetetica</h1>

      <p>
        В XX веке народ без территории, армии и международного признания основал Израиль. 
        Это стало возможно благодаря внутренней идентичности, общей цели и воле к самоопределению.
      </p>

      <p>
        Сегодня мы становимся свидетелями рождения нового типа государства — <strong>Terra Zetetica</strong>.
        Это не концепт, не утопия, не цифровой аватар.
      </p>

      <p>
        <strong>Это реальное государство</strong>, основанное на Конституции, паспорте, управлении, территории и общности мировоззрения.
        Наука больше не может быть догмой. Terra Zetetica утверждает право народа на наблюдение, логику и самостоятельное знание — через <strong>Зететическую методологию</strong>.
      </p>

      <h2>Физическая территория: анклавы Terra Zetetica</h2>
      <p>
        Сегодня в России и Беларуси действуют <strong>первые физические анклавы</strong>. 
        Это не просто объединения — это <strong>участки недвижимости и земли</strong>, официально заявленные гражданами, 
        зарегистрированные в DAO и сохранённые в IPFS.
      </p>
      <p>
        <strong>Анклав — это полноценная часть территории государства.</strong> Он может включать жильё, хозяйственную зону, общественное пространство и флаг Terra Zetetica.
      </p>

      <h2>Гражданская база: Россия и мир</h2>
      <ul>
        <li>
          <strong>Россия, 2018 год</strong> — по опросу ВЦИОМ, 3% россиян считают, что Земля плоская. 
          Это более <strong>4,4 миллиона человек</strong>. 👉 <a href="https://vz.ru/news/2018/7/27/934460.html" target="_blank">Источник (ВЗГЛЯД)</a>
        </li>
        <li>
          <strong>Россия, 2018 год</strong> — официальные российские государственные СМИ открыто публикуют материалы, 
          признающие научные исследования по плоской Земле. 👉 <a href="https://tass.ru/press-relizy/5077491" target="_blank">Источник (TASS, официальный релиз)</a>
        </li>
        <li>
          <strong>Россия, 2022 год</strong> — по новому исследованию ВЦИОМ, 35% россиян считают, что Солнце вращается вокруг Земли. 
          👉 <a href="https://www.vedomosti.ru/society/news/2022/08/02/934109-35-rossiyan-schitayut-chto-solntse-vraschaetsya-vokrug-zemli" target="_blank">Источник (Ведомости)</a>
        </li>
        <li>
          <strong>США</strong> — по данным Carsey Institute, около 10% американцев считают, что Земля плоская. 
          Это <strong>33 миллиона человек</strong>. 👉 <a href="https://carsey.unh.edu/publication/conspiracy-vs-science-survey-us-public-beliefs" target="_blank">Carsey Institute</a>
        </li>
      </ul>
      <p><strong>Мировой прогноз:</strong> согласно различным социологическим опросам, выступлениям Flat Earth International Conference и оценкам исследователей, <strong>общее число сторонников альтернативной, в том числе зететической, модели Земли — от 100 до 150 миллионов человек.</strong>.</p>

      <h2>Факты и структура</h2>
      <ul>
        <li>✅ Запущен <strong>ZeteticID</strong>: выдача паспорта и идентификатора гражданина</li>
        <li>✅ <strong>Верификация через IPFS</strong>: документы защищены и доступны навсегда</li>
        <li>✅ <strong>Портал Terra-Zetetica.org</strong> с ключевыми разделами</li>
        <li>✅ <strong>DAO</strong>: граждане управляют государством напрямую</li>
        <li>✅ <strong>Созданы первые физические анклавы</strong> с территорией, признанной государством Terra Zetetica и зарегистрированной на глобальном уровне</li>
      </ul>

      <h2>Ключевые технологии</h2>

      <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.7' }}>
        <li>
          <strong>DAO (Decentralized Autonomous Organization)</strong> — каждый гражданин голосует напрямую за решения и инициативы через защищённые смарт-контракты.  
          Это конец представительской власти — управление принадлежит народу.
        </li>
        <li>
          <strong>IPFS (InterPlanetary File System)</strong> — децентрализованное хранилище, где Конституция, паспорта и документы Terra Zetetica хранятся как неизменяемые цифровые сущности, неподвластные никакой юрисдикции.
        </li>
      </ul>


      <h2>Прогноз развития (2026–2040)</h2>

      {/* 
        📌 Таблица с 3 столбцами:
        — 1-й: год,
        — 2-й: ключевые показатели (анклавы, граждане, площадь),
        — 3-й: комментарий / значимость.
        Упрощено и адаптировано для мобильных экранов.
      */}

      <div style={{ overflowX: 'auto' }}>
        <table className="growth-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>Год</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Развитие</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Значимость</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>2026</td>
              <td style={{ padding: '8px' }}>
                — 10+ анклавов<br />
                — 100 000 граждан<br />
                — площадь: стартовая
              </td>
              <td style={{ padding: '8px' }}>
                Первые анклавы. Начало сети автономий в 5+ странах
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>2030</td>
              <td style={{ padding: '8px' }}>
                — 3 000+ анклавов<br />
                — 50 млн граждан<br />
                — 100 000+ га
              </td>
              <td style={{ padding: '8px' }}>
                Сопоставимо с Мальтой + Лихтенштейном + Сан-Марино
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>2035</td>
              <td style={{ padding: '8px' }}>
                — 15 000 анклавов<br />
                — 70 млн граждан<br />
                — 300 000 га
              </td>
              <td style={{ padding: '8px' }}>
                Больше Люксембурга. Население — как Франция
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>2040</td>
              <td style={{ padding: '8px' }}>
                — 100 000 анклавов<br />
                — 250 млн граждан<br />
                — 1 500 000 га
              </td>
              <td style={{ padding: '8px' }}>
                Сопоставимо с Израилем. Больше 45% стран по территории
              </td>
            </tr>
          </tbody>
        </table>
      </div>



    <ul style={{ marginTop: '2rem', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
      <li>
        <strong>Каждый анклав</strong> — это не просто участок, а <strong>самоуправляемая единица</strong>, живущая по Конституции <strong>Terra Zetetica</strong>;
      </li>
      <li>
        <strong>Средний анклав</strong> включает <strong>~1,5 домохозяйства и 10–50 соток земли</strong>, зарегистрированных через DAO и IPFS;
      </li>
      <li>
        <strong>Гражданство:</strong> с паспортом и <strong>Zetetic ID</strong>, <strong>без потери существующего гражданства</strong>;
      </li>
      <li>
        К 2040 году <strong>Terra Zetetica</strong> будет <strong>сравнима с Израилем по территории</strong> и <strong>с Индонезией по численности населения</strong>.
      </li>
    </ul>
      <h2>Гражданство</h2>

      <img
        src="/images/passport-terra-zetetica.jpg"
        alt="Паспорт гражданина Terra Zetetica"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: 'auto',
          marginBottom: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />

      <p>
        <strong>Гражданство Terra Zetetica не требует отказа от других гражданств.</strong><br />
        Оно существует параллельно, утверждая вашу принадлежность к сообществу, построенному на знании, свободе и зететической Истине.
      </p>

      <p>
        <strong>Zetetic ID</strong> — это знак разумного пробуждения. 
        Это не просто паспорт, это — признание своего права на Истину и управление своей судьбой.
      </p>

      <p style={{ fontWeight: '600', marginTop: '2rem' }}>
        Terra Zetetica — это не просто идея. Это реальность, формирующаяся на наших глазах.  
        Присоединяйтесь к нам и станьте частью нового государства, основанного на истине и стремлении к знанию.
      </p>
    </main>
  );
}
