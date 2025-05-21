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
          Полный текст Конституции закреплён в неизменяемом виде и размещён в децентрализованном IPFS-хранилище:
          <br />
          <code style={{ wordBreak: 'break-all', display: 'block', marginTop: '0.5rem' }}>
            https://gateway.pinata.cloud/ipfs/bafybeiexp532nzeuxwatndcnt2dhxphhb6ncfdwjulddjkppkie2zcgw5q
          </code>
        </p>

        <a
          className="btn primary"
          href="https://gateway.pinata.cloud/ipfs/bafybeiexp532nzeuxwatndcnt2dhxphhb6ncfdwjulddjkppkie2zcgw5q"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', margin: '1rem 0' }}
        >
          📜 Открыть текст Конституции в IPFS
        </a>

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
          <li>🔹 <strong>Зететическая методология</strong>: мы заменяем догму исследованием, наблюдением и логикой.</li>
          <li>🔹 <strong>Цифровая гражданственность</strong>: Zetetic ID как выражение принадлежности к свободному народу и новая модель идентичности.</li>
          <li>🔹 <strong>Децентрализованное управление</strong>: DAO — как высшая форма гражданского волеизъявления.</li>
          <li>🔹 <strong>Этика и добровольность</strong>: отказ от насилия и принуждения, ориентация на свободный договор и уважение к иному.</li>
        </ul>

        <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
          Terra Zetetica — это не проект. Это народ. Это государство, возникающее из свободы мысли, действующее по законам Истины.
        </p>
      </main>
    </>
  );
}
