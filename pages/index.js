import { useState } from 'react';
import Head from 'next/head';
import Modal from '../components/Modal';

export default function Home() {
  const [isPassportOpen, setPassportOpen] = useState(false);

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
              onClick={() => setPassportOpen(true)}
              className="btn outline"
            >
              Что такое Zetetic ID?
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isPassportOpen}
        onClose={() => setPassportOpen(false)}
        title="Что такое Zetetic ID?"
      >
        <p><strong>Zetetic ID</strong> — это цифровой паспорт гражданина Terra Zetetica.</p>
        <ul>
          <li>🪪 Подтверждает ваше гражданство и права</li>
          <li>🌐 Хранится в IPFS как неизменяемый цифровой документ</li>
          <li>🗳 Используется для голосования в DAO</li>
          <li>🔐 Даёт доступ к внутренним системам платформы</li>
        </ul>
        <p>
          Это не просто документ — это заявление о пробуждении и праве на Истину.  
          Вы можете получить его уже сегодня.
        </p>
      </Modal>
    </>
  );
}
