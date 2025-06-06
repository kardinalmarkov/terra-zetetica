// pages/apply.js
import Head from 'next/head';

export default function Apply() {
  return (
    <main className="wrapper" style={{ padding: '2rem', maxWidth: '720px' }}>
      <Head>
        <title>Получить гражданство — Terra Zetetica</title>
      </Head>

      <h1>Получить гражданство Terra Zetetica</h1>

      <p><strong>Terra Zetetica</strong> — это суверенное государство, основанное на Истине, со своей Конституцией, территорией, символикой и паспортной системой.</p>

      <p><strong>Государство Terra Zetetica</strong> основано в полном соответствии с международными нормами ООН, включая Устав и Конвенцию Монтевидео. Мы утверждаем право на самоопределение и объединение за пределами искусственных границ.</p>

      <h2>🪪 Паспорт Terra Zetetica</h2>

      <p>Каждый, кто принимает Конституцию и следует зететическим принципам, получает:</p>
      <ul>
        <li><strong>Паспорт Terra Zetetica</strong>, включающий <strong>Zetetic ID (ZID)</strong> — уникальный идентификатор гражданина, надёжно сохранённый в IPFS</li>
        <li><strong>ID-карту</strong> — дополнительный визуальный документ, который можно демонстрировать при необходимости</li>
        <li>Участие в формировании государства и доступ к DAO</li>
        <li>Возможность получения титулов, анклавов и участия в экспедициях</li>
      </ul>

      <h2>📥 Как получить документы</h2>
      <p>Перейдите в Telegram:</p>
      <p><a href="https://t.me/ZeteticID_bot">@ZeteticID_bot</a></p>
      <p>Следуйте инструкции. Паспорт и карта будут выданы автоматически.</p>

      <h2>📌 Почему это важно</h2>
      <ul>
        <li>Это первый шаг к официальному гражданству нового государства</li>
        <li>Документы навсегда сохранены в IPFS — децентрализованной мировой сети</li>
        <li>Их можно использовать для участия в проектах, делегациях, верификации и предъявлении</li>
      </ul>

      <h2>🧬 Версия 1.0</h2>
      <p>Это первая версия паспорта. В следующих:</p>
      <ul>
        <li>NFT-паспорта с DAO-голосованием</li>
        <li>Физические ID-карты с голограммами и микрочипами (при наличии согласия гражданина)</li>
        <li>Индивидуальные титулы, зоны, цифровые токены</li>
      </ul>

      <h2>🔍 Проверка паспорта</h2>
      <p>
        Каждый паспорт можно проверить по CID через специальную форму верификации:
        <br />
        <a href="https://terra-zetetica.org/verify_template/verify.html" target="_blank" rel="noopener noreferrer">
          ➤ Верификация паспорта
        </a>
      </p>
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Дополнительные преимущества гражданства
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            💎 <strong>Персональная дивидендная пенсия</strong>
          </li>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            🛡️ <strong>Безналоговое гражданство + паспорт-щит</strong>
          </li>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            🎓 <strong>DAO-стипендии до $10,000</strong>
          </li>
          <li style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            🌱 <strong>Земельный титул Основателя анклава</strong>
          </li>
        </ul>
      </section>

      <p><strong>Terra Zetetica — это не просто идея. Это рождение нового мира. И ты — его гражданин.</strong></p>
    </main>
  );
}
