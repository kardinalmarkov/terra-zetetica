import Head from 'next/head';

const roadmap = [
  {
    quarter: '2025 Q2–Q3',
    items: [
      { label: 'Конституция', status: '✅' },
      { label: 'NFT-Паспорт v1.0', status: '✅' },
      { label: 'Первые анклавы', status: '✅' },
      { label: 'CID-реестр документов', status: '✅' },
      { label: 'Сайт + GitHub', status: '🔄' },
      { label: 'Флаг, герб, девиз', status: '🔄' },
    ],
  },
  {
    quarter: 'Q4 2025 – Q2 2026',
    items: [
      'Автоматизация Z-ID',
      '10 анклавов, интерактивная карта',
      'Базовое DAO (Snapshot)',
      'Цифровые ID и титулы',
      'Академия Зететики (курсы)',
      'Discord / Telegram / форум',
    ],
  },
  {
    quarter: '2026',
    items: [
      'Дипломатия (ООН, UNPO)',
      'Конференции и форумы',
      '2-я редакция Конституции (DAO-правки)',
      'Исследования ЗаКуполья (DAO-экспедиции)',
      'Цифровые голосования (zk-ID)',
      'Центральный анклав (земля)',
    ],
  },
];

export default function Roadmap() {
  return (
    <main className="wrapper">
      <Head>
        <title>Дорожная карта | Terra Zetetica</title>
      </Head>

      <h1>🌐 Дорожная карта Terra Zetetica</h1>
      <p>Версия: 2025–2026</p>

      {roadmap.map(({ quarter, items }) => (
        <section key={quarter} style={{ marginTop: '2rem' }}>
          <h2>{quarter}</h2>
          <ul>
            {items.map((it, i) => (
              <li key={i}>
                {typeof it === 'string' ? it : `${it.status} ${it.label}`}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
