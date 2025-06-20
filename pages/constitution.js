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
            📜 Конституция в IPFS
          </a>
        </p>

        <p>
          💾 <strong>Скачать PDF:</strong><br />

         <a
            className="btn primary"
            href="/constitution-terra-zetetica-1-2.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', margin: '1rem 0' }}
          >
            📜 Скачать Конституцию с сайта
          </a>

        </p>

        <h2 style={{ marginTop: '2.5rem' }}>⚖️ Международно-правовая основа</h2>
        <p>
          Образование и развитие Terra Zetetica осуществляется в соответствии с международными правовыми актами, признающими:
        </p>
        <ul style={{ lineHeight: '1.6' }}>
          <li>📘 <strong>Конвенция Монтевидео</strong> (1933) — определяет критерии государственности: население, территория, правительство и способность вступать в отношения с другими государствами.</li>
          <li>📘 <strong>Устав ООН</strong>, ст. 1(2) — закрепляет право народов на самоопределение и свободное развитие политического статуса.</li>
          <li>📘 <strong>Международный пакт о гражданских и политических правах</strong> — гарантирует каждому человеку право на признание его правосубъектности.</li>
          <li>📘 <strong>Резолюция 1514 (XV)</strong> Генеральной Ассамблеи ООН — декларирует прекращение колониализма и утверждает равные права на независимость.</li>
        </ul>


        <h2 style={{ marginTop: '2.5rem' }}>🧭 Миссия и основные принципы</h2>
        <p>
          Terra Zetetica утверждает право человека и сообщества на существование, организацию и развитие вне политических и научных догм. 
          Мы строим новое гражданское общество, основанное на знании, логике и ответственности.
        </p>
        <ul style={{ lineHeight: '1.6' }}>
          <li>🔹 <strong>Суверенитет личности</strong>: каждый гражданин обладает абсолютным правом на знание, территорию и самоопределение.</li>
          <li>🔹 <strong>Истиноцентризм:</strong> приоритет наблюдаемой реальности над догмой.</li>
          <li>🔹 <strong>Свобода:</strong> неприкосновенность воли, слов и действий каждого гражданина.</li>
          <li>🔹 <strong>Зететика:</strong> личный поиск знания через проверку и логику.</li>
          <li>🔹 <strong>Служение ≥ 51 %:</strong> сознательный выбор пользы для других и природы.</li>
          <li>🔹 <strong>DAO и децентрализация:</strong> решение вопросов через гражданское самоуправление.</li>
        </ul>

        <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Terra Zetetica — это не проект. Это народ. Это живое государство, возникающее из правды, свободы и исследовательского духа, действующее по законам Истины.
        </p>
      </main>
    </>
  );
}