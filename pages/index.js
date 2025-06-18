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
             Суверенное государство,<br />
            с децентрализованным управлением
          </p>
          <div className="actions">
            <a href="/apply" className="btn primary">Стать гражданином</a>
            <button
              onClick={() => setTokensOpen(true)}
              className="btn secondary"
            >
              Что такое Zetetic ID?
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isTokensOpen}
        onClose={() => setTokensOpen(false)}
        title="Что такое Zetetic ID?"
      >
        <div style={{ padding: '0.5rem 1rem', lineHeight: '1.7' }}>
          <p><strong>Zetetic ID</strong> — это цифровой паспорт гражданина Terra Zetetica.</p>
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
            <li>🪪 Подтверждает ваше гражданство и права</li>
            <li>🔐 Хранится в IPFS как неизменяемый цифровой документ</li>
            <li>🗳 Используется для голосования в DAO</li>
            <li>🔑 Даёт доступ к внутренним системам платформы</li>
          </ul>
          <p>
            Это не просто документ — это заявление о пробуждении и праве на Истину.  
            Вы можете получить его уже сегодня.
          </p>
        </div>
      </Modal>
    </>
  );
}
