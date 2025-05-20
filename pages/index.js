import { useState } from 'react';
import Head from 'next/head';
import Modal from '../components/Modal';

export default function Home() {
  const [isTokensOpen, setTokensOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Добро пожаловать в Terra Zetetica</title>
      </Head>

      <section className="hero">
        <div className="inner">
          <h1>
            Добро пожаловать<br />
            в <span>Terra Zetetica</span>
          </h1>
          <p className="tagline">
            Утопия сетевого государства,<br />
            построенная на блокчейне
          </p>
          <div className="actions">
            <a href="/apply" className="btn primary">Стать гражданином</a>
            <button
              onClick={() => setTokensOpen(true)}
              className="btn outline"
            >
              Что такое токены?
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isTokensOpen}
        onClose={() => setTokensOpen(false)}
        title="Что такое токены?"
      >
        <p>
          ZTC — цифровой токен гражданства Terra Zetetica. Он будет использоваться для:
        </p>
        <ul>
          <li>🔹 Голосований в DAO</li>
          <li>🔹 Наград и бонусов</li>
          <li>🔹 Доступа к эксклюзивным функциям платформы</li>
        </ul>
        <p>Запуск токена планируется во 2-й версии проекта.</p>
      </Modal>
    </>
  );
}
