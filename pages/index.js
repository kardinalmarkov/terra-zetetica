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
        <p>
          <strong>Zetetic ID</strong> — это цифровой паспорт гражданина Terra Zetetica. Он заменяет собой устаревшую идею токенов.
        </p>
        <ul>
          <li>🗳 Участие в голосованиях DAO</li>
          <li>🎓 Доступ к обучающим материалам и внутренним ресурсам</li>
          <li>🎖 Подтверждение гражданства и регистрации анклава</li>
        </ul>
        <p>
          Zetetic ID сохраняется в IPFS и связан с личной волей и знанием гражданина.  
          Это не NFT и не спекулятивный актив — это инструмент свободы.
        </p>
        <img
          src="/images/passport-terra-zetetica.jpg"
          alt="Паспорт Zetetic ID"
          style={{
            width: '100%',
            maxWidth: '360px',
            margin: '1.5rem auto',
            display: 'block',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
      </Modal>

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
