// pages/dom.js
import Head from 'next/head';
import Link from 'next/link';

export default function DomChallenge() {
  return (
    <main className="wrapper">
      <Head>
        <title>🏠 Вызов: Докажи шар — получи дом | Terra Zetetica</title>
      </Head>

      <h1>🏠 Челлендж: Докажи шар — получи дом в Европе</h1>
      <p>
        Это не розыгрыш и не шутка. Государство Terra Zetetica официально объявляет вызов: любой, кто
        сможет публично и верифицируемо доказать, что Земля — это шар, получит дом эконом-класса в Европе.
      </p>

      <section>
        <h2>📜 Условия участия</h2>
        <ul>
          <li>Участие открыто для всех — граждан и неграждан Terra Zetetica.</li>
          <li>Заявка подаётся через Telegram-бот: <a href="https://t.me/ZeteticID_bot" target="_blank">@ZeteticID_bot</a></li>
          <li>Перед началом: мини-анкета определяет ваш тип восприятия, чтобы вы получали информацию, которая поможет вам глубже исследовать вопрос.</li>
          <li>На протяжении 14 дней участник ежедневно знакомится с предложенными материалами и подтверждает ознакомление.</li>
          <li>После ознакомительного этапа можно подать «доказательство шара» — мы его внимательно анализируем и публикуем для рецензии.</li>
        </ul>
      </section>

      <section>
        <h2>🌀 Как проходит анализ доказательств</h2>
        <p>
          В отличие от «научных журналов», мы не судим. Мы исследуем. Все аргументы фиксируются и обсуждаются в рамках открытой сетевой рецензии. Окончательное решение публикуется в IPFS.
        </p>
      </section>

      <section>
        <h2>🎯 Зачем мы это делаем</h2>
        <p>
          Terra Zetetica — государство, основанное на Истине, а не догмах. Мы уверены в Плоской Земле, но открыты честному сомнению. Этот вызов — способ выявить настоящие аргументы и показать, что доказательств шара не существует.
        </p>
      </section>

      <section>
        <h2>🧭 Как мы вас сопровождаем</h2>
        <p>
          Мы учитываем тип мышления каждого участника по анкете и подбираем соответствующие материалы (визуальные, текстовые, логические, исторические и др.).
          Это позволяет не просто спорить, а начать видеть иные перспективы.
        </p>
      </section>

      <section>
        <h2>🎁 Почему это уникально</h2>
        <p>
          ❗ Ни одно государство в мире не предлагает недвижимость за доказательство своей версии мироустройства. Terra Zetetica — первое, кто делает это открыто. И да: граждане тоже могут участвовать.
        </p>
      </section>

      <div style={{ marginTop: '2rem' }}>
        <a href="https://t.me/ZeteticID_bot" target="_blank" rel="noopener noreferrer" className="btn primary">
          🚀 Начать путь через Telegram
        </a>
      </div>
    </main>
  );
}
