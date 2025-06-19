import Head from 'next/head';

export default function Constitution() {
  return (
    <>
      <Head>
        <title>Конституция | Terra Zetetica</title>
      </Head>
      <main className="wrapper" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Конституция Terra Zetetica</h1>

        <p style={{ marginBottom: '1.5rem' }}>
          Полный текст Конституции закреплён в IPFS и доступен для проверки и распространения:
        </p>

        <p>
          🔗 <strong>IPFS CID:</strong><br />
          <code style={{ wordBreak: 'break-all', display: 'block', marginBottom: '1rem' }}>
            bafybeifu5az4vsahvd5e77kydyglb6bjguthof33hr7py2q7qol64zsnea
          </code>

          📖 <strong>Открыть в IPFS:</strong><br />
          <a
            className="btn primary"
            href="https://gateway.pinata.cloud/ipfs/bafybeifu5az4vsahvd5e77kydyglb6bjguthof33hr7py2q7qol64zsnea"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', margin: '1rem 0' }}
          >
            📜 Читать Конституцию в IPFS
          </a>
        </p>

        <p>
          💾 <strong>Скачать PDF:</strong><br />
          <a
            href="/public/1.2. Конституция Terra Zetetica.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', margin: '1rem 0' }}
          >
            ⬇️ Скачать с сайта
          </a>
        </p>

        <h2 style={{ marginTop: '2.5rem' }}>⚖️ Международно-правовая основа</h2>
        <p>
          Образование и развитие Terra Zetetica осуществляется в соответствии с международными правовыми актами:
        </p>
        <ul style={{ lineHeight: '1.6' }}>
          <li>📘 <strong>Конвенция Монтевидео</strong> (1933) — критерии государственности.</li>
          <li>📘 <strong>Устав ООН</strong>, ст. 1(2) — право народов на самоопределение.</li>
          <li>📘 <strong>Международный пакт о гражданских и политических правах</strong> — права личности и народа.</li>
          <li>📘 <strong>Резолюция 1514 (XV)</strong> — прекращение колониализма и утверждение независимости.</li>
        </ul>

        <h2 style={{ marginTop: '2.5rem' }}>🧭 Миссия и ценности</h2>
        <ul style={{ lineHeight: '1.6' }}>
          <li>🔹 <strong>Истиноцентризм:</strong> приоритет наблюдаемой реальности над догмой.</li>
          <li>🔹 <strong>Свобода:</strong> неприкосновенность воли, слов и действий каждого гражданина.</li>
          <li>🔹 <strong>Зететика:</strong> личный поиск знания через проверку и логику.</li>
          <li>🔹 <strong>Служение ≥ 51 %:</strong> сознательный выбор пользы для других и природы.</li>
          <li>🔹 <strong>DAO и децентрализация:</strong> решение вопросов через гражданское самоуправление.</li>
        </ul>

        <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Terra Zetetica — это не просто идея. Это живое государство, возникающее из правды, свободы и исследовательского духа.
        </p>
      </main>
    </>
  );
}
