import Head from 'next/head';

const tracks = [
  { title: 'Фальшивая луна', src: '/media/1.mp3' },
  { title: 'Лунный свет', src: '/media/2.mp3' },
  { title: 'Кон-Тики: Плоская Земля', src: '/media/3.mp3' },
  { title: 'ПЗ: Звёздный путь №1', src: '/media/4.mp3' },
  { title: 'ПЗ: Звёздный путь №2', src: '/media/5.mp3' },
  { title: 'ПЗ: Звёздный путь №3', src: '/media/6.mp3' },
  { title: 'Антарктида №1', src: '/media/7.mp3' },
  { title: 'Антарктида №2', src: '/media/8.mp3' }
];

export default function Music() {
  return (
    <>
      <Head>
        <title>Музыка | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🎙 Музыка Terra Zetetica</h1>
        <p>Авторские композиции, вдохновлённые Зететикой:</p>

        {tracks.map((track, i) => (
          <div key={i} style={{ margin: '1.5rem 0' }}>
            <h3 style={{ marginBottom: '.5rem' }}>{track.title}</h3>
            <audio controls src={track.src} style={{ width: '100%' }} />
          </div>
        ))}
      </main>
    </>
  );
}
