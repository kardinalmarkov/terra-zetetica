import Head from 'next/head';
import { useRef, useState } from 'react';

const tracks = [
  { title: 'Фальшивая луна', src: 'https://archive.org/download/8_20250522_202505/1.mp3' },
  { title: 'Лунный свет', src: 'https://archive.org/download/8_20250522_202505/2.mp3' },
  { title: 'Кон-Тики: Плоская Земля', src: 'https://archive.org/download/8_20250522_202505/3.mp3' },
  { title: 'ПЗ: Звёздный путь №1', src: 'https://archive.org/download/8_20250522_202505/4.mp3' },
  { title: 'ПЗ: Звёздный путь №2', src: 'https://archive.org/download/8_20250522_202505/5.mp3' },
  { title: 'ПЗ: Звёздный путь №3', src: 'https://archive.org/download/8_20250522_202505/6.mp3' },
  { title: 'Антарктида №1', src: 'https://archive.org/download/8_20250522_202505/7.mp3' },
  { title: 'Антарктида №2', src: 'https://archive.org/download/8_20250522_202505/8.mp3' }
];

export default function Music() {
  const audioRefs = useRef([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  const handlePlay = (index) => {
    if (currentTrack !== null && currentTrack !== index) {
      audioRefs.current[currentTrack]?.pause();
      audioRefs.current[currentTrack].currentTime = 0;
    }
    setCurrentTrack(index);
  };

  const handleEnded = (index) => {
    const next = index + 1;
    if (next < tracks.length) {
      audioRefs.current[next]?.play();
      setCurrentTrack(next);
    } else {
      setCurrentTrack(null);
    }
  };

  return (
    <>
      <Head>
        <title>Музыка | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🎙 Музыка Terra Zetetica</h1>
        <p style={{ marginBottom: '2rem' }}>
          Авторские композиции, вдохновлённые Зететикой. Выбирайте трек — и наслаждайтесь:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {tracks.map((track, i) => (
            <div key={i} style={{
              padding: '1rem',
              borderRadius: '8px',
              background: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{track.title}</h3>
              <audio
                ref={(el) => audioRefs.current[i] = el}
                controls
                src={track.src}
                onPlay={() => handlePlay(i)}
                onEnded={() => handleEnded(i)}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
