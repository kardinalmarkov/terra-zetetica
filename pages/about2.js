import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>О Terra Zetetica</title>
      </Head>

      {/* ────────── HERO ────────── */}
      <section className="wrapper mx-auto max-w-[840px] px-4 py-8 text-center">
        <img
          src="/images/constitution-cover.png"
          alt="Обложка Конституции Terra Zetetica"
          className="mx-auto mb-6 w-full max-w-[460px] rounded-xl shadow-lg"
        />

        <h1 className="text-3xl font-semibold mb-4">
          Terra Zetetica — государство свободного исследования
        </h1>

        <p className="leading-relaxed mb-6">
          Мы объединяем граждан через <strong>анклавы</strong> и&nbsp;
          <strong>DAO</strong>, действуя по&nbsp;
          <a
            href="https://gateway.pinata.cloud/ipfs/bafybeifu5az4vsahvd5e77kydyglb6bjguthof33hr7py2q7qol64zsnea"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Конституции v&nbsp;1.2
          </a>
          . Главный критерий&nbsp;— <span className="font-medium">служить людям и планете как минимум на 51 %</span>.
        </p>

        <a
          href="/public/1.2. Конституция Terra Zetetica.pdf"
          className="btn primary inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          ⬇️ Скачать PDF-версию
        </a>
      </section>

      {/* ────────── ЦЕННОСТИ ────────── */}
      <section className="wrapper mx-auto max-w-[840px] px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">Наши опорные ценности</h2>
        <ul className="list-disc ml-5 space-y-2 leading-relaxed">
          <li><strong>Истиноцентризм</strong>: наблюдаемая реальность выше догм.</li>
          <li><strong>Свобода воли</strong>: неприкосновенность мысли, слова, действия.</li>
          <li><strong>Зететический метод</strong>: проверка, эксперимент, личный опыт.</li>
          <li><strong>Порог 51 % служения</strong>: добровольная ориентация на пользу.</li>
          <li><strong>Децентрализация</strong>: решения — через DAO, а не через иерархию.</li>
        </ul>
      </section>

      {/* ────────── ИНДЕКС 51% ────────── */}
      <section className="wrapper bg-gray-50 py-10">
        <div className="mx-auto max-w-[840px] px-4">
          <h2 className="text-2xl font-semibold mb-3">📊 Индекс 51 %</h2>
          <p className="leading-relaxed mb-4">
            Ежемесячно мы публикуем процент токенов и человеко-часов, направленных на общественные проекты.
            Метрика хранится в IPFS и отображается в реальном времени.
          </p>
          <iframe
            src="https://metrics.tz/index51-widget"
            title="Индекс 51 %"
            className="mx-auto h-[220px] w-full max-w-[600px] rounded-lg border"
          />
        </div>
      </section>

      {/* ────────── ИСТОРИЯ КОНЦЕПТА ────────── */}
      <section className="wrapper mx-auto max-w-[840px] px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">История концепта «Под Куполом»</h2>

        <figure className="mb-5">
          <img
            src="/images/flat-earth.jpg"
            alt="Исторический макет альтернативной карты Земли под прозрачным куполом"
            className="rounded-lg shadow-md"
          />
          <figcaption className="mt-2 text-sm text-gray-600">
            Один из макетов плоской карты Земли с демонстрационным куполом (частная коллекция, 2023 г.)
          </figcaption>
        </figure>

        <p className="leading-relaxed">
          Модель Купола вдохновила первое сообщество Zetetic-практиков, но&nbsp;сама
          Terra Zetetica не утверждает единственную «правильную» картину мира.
          Мы оставляем <strong>право проверять</strong> любые гипотезы — от географии до квантовой
          физики. В последние годы интерес к «плоскоземельной» теме вырос не только
          в интернете: ряд национальных СМИ и даже представители академических
          институтов — включая <em>BBC Brazil</em> и Мексиканский национальный университет —
          брали интервью у учёных и энтузиастов, чтобы обсудить феномен альтернативных
          карт. Для Terra Zetetica это — лишь иллюстрация свободы наблюдения.
        </p>
      </section>

      {/* ────────── СТАТИСТИКА / МЕДИА ────────── */}
      <section className="wrapper bg-gray-50 py-10">
        <div className="mx-auto max-w-[840px] px-4">
          <h2 className="text-2xl font-semibold mb-4">Что об этом говорят статистика и власти?</h2>

          <ul className="list-disc ml-5 space-y-2 leading-relaxed">
            <li>🔍 Исследование <em>YouGov UK 2018</em>: 2 % респондентов уверены в альтернативной форме Земли, 12 % затруднились ответить.</li>
            <li>🇷🇺 Пресс-секретарь Роскосмоса в 2024 признал: «Мы следим за любыми научными дискуссиями, включая так называемую плоскую Землю».</li>
            <li>🇧🇷 В Бразилии министр образования поручил университетам «учиться объяснять основные модели Вселенной на понятном языке» после серии запросов от студентов-плоскоземельцев.</li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            Источники и PDF-сборник исследований доступны по&nbsp;
            <a
              href="https://gateway.pinata.cloud/ipfs/QmStatisticsBundleCID"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              этой ссылке
            </a>.
          </p>
        </div>
      </section>

      {/* ────────── CALL TO ACTION ────────── */}
      <section className="wrapper mx-auto max-w-[840px] px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-3">Присоединяйтесь!</h2>
        <p className="leading-relaxed mb-6">
          Получите Zetetic ID, зарегистрируйте анклав или внесите вклад в Фонд служения — и станьте частью государства свободного знания.
        </p>
        <a href="/join" className="btn primary">
          🚀 Стать гражданином
        </a>
      </section>
    </>
  );
}
