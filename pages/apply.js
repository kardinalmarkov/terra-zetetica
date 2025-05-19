// pages/apply.js
import Head from 'next/head';

export default function Apply() {
  return (
    <main className="wrapper" style={{ padding: '2rem', maxWidth: '720px' }}>
      <Head>
        <title>Гражданство Terra Zetetica</title>
        <meta name="description" content="Как получить паспорт гражданина Terra Zetetica через Telegram-бота @ZeteticID_bot" />
      </Head>
      <h1>📘 Как стать гражданином Terra Zetetica</h1>
      
      <p>
        Добро пожаловать в проект <b>Terra Zetetica</b> — независимое цифровое сообщество с собственными принципами, атрибутикой и паспортной системой.
      </p>

      <h2>🪪 Получение паспорта</h2>
      <p>Процедура полностью автоматизирована и осуществляется через Telegram-бота:</p>

      <p>
        👉 <a href="https://t.me/ZeteticID_bot" target="_blank" rel="noopener noreferrer">@ZeteticID_bot</a>
      </p>

      <ol>
        <li>Перейдите по ссылке и нажмите <b>Start</b> или напишите команду <code>/start</code></li>
        <li>Затем напишите команду <code>/passport</code> для оформления паспорта</li>
        <li>Бот автоматически загрузит ваше имя и фото из Telegram и создаст уникальный Zetetic ID</li>
        <li>Паспорт будет сгенерирован в формате PDF и выслан вам прямо в чат</li>
        <li>Ваш паспорт будет опубликован в IPFS и доступен для верификации по ссылке</li>
      </ol>

      <h2>🔍 Проверка паспорта</h2>
      <p>
        Каждый паспорт можно проверить по CID через специальную форму верификации:
        <br />
        <a href="https://terra-zetetica.org/verify_template/verify.html" target="_blank" rel="noopener noreferrer">
          ➤ Верификация паспорта
        </a>
      </p>

      <h2>📥 Повторная печать карты</h2>
      <p>
        Если вы уже получали паспорт ранее, просто используйте команду <code>/reprint</code> — бот повторно отправит вам ID-карту гражданина.
      </p>

      <h2>ℹ️ Важно</h2>
      <ul>
        <li>Ваши данные не публикуются без вашего участия — только CID, имя и цифровой ID</li>
        <li>Каждый паспорт навсегда сохраняется в IPFS — это ваш вклад в Zetetic-сообщество</li>
      </ul>
    </main>
  );
}
