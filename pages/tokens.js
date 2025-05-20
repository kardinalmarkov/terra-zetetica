import Head from 'next/head';

export default function Tokens() {
  return (
    <>
      <Head><title>Zetetic ID | Terra Zetetica</title></Head>
      <main className="wrapper" style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem', lineHeight: '1.7' }}>
        <h1>🆔 Что такое Zetetic ID?</h1>

        <p>
          <strong>Zetetic ID</strong> — это цифровой идентификатор граждан Terra Zetetica. Он заменяет собой концепцию токена и открывает реальные возможности:
        </p>
        <ul>
          <li>🗳 Участие в голосованиях DAO</li>
          <li>🎓 Доступ к обучающим и внутренним материалам</li>
          <li>🎖 Подтверждение гражданства и регистрации анклава</li>
        </ul>

        <p>
          Zetetic ID не является токеном или NFT. Это подлинный элемент управления — он сохраняется в IPFS, связан с вашей волей и знанием, а не с блокчейн-спекуляцией.
        </p>

        <img
          src="/images/passport-terra-zetetica.jpg"
          alt="Паспорт гражданина Terra Zetetica"
          style={{
            width: '100%',
            maxWidth: '420px',
            height: 'auto',
            margin: '2rem auto',
            borderRadius: '12px',
            display: 'block',
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
          }}
        />

        <p style={{ fontWeight: '600' }}>
          Паспорт Terra Zetetica — это не символ, а инструмент гражданской зрелости.  
          Zetetic ID — ваш пропуск в государство будущего.
        </p>
      </main>
    </>
  );
}
