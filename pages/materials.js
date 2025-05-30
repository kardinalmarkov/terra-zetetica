import Head from 'next/head';

const materials = [
  {
    key: 'photo',
    icon: '📸',
    title: 'Фото',
    description: 'Фотографии от наших граждан',
    videoSrc: '/media/photo-preview-clip.mp4',
    poster: '/images/photo-preview.jpg', // добавьте изображение
    driveLink: 'https://drive.google.com/drive/folders/1HcETdfZEZOtg9Dm0idmQSTnd9DdAXk9C?usp=sharing',
  },
  {
    key: 'video',
    icon: '🎥',
    title: 'Видео: Промо 2025',
    description: 'О государстве Terra Zetetica',
    embedSrc: 'https://app.heygen.com/embeds/9d421401b0574669994e38b410c84e66',
    driveLink: 'https://drive.google.com/drive/folders/1gFT-J1gcxM1kLkB6MY4Sj8pWwdBwmafF?usp=sharing',
  },
  {
    key: 'experiment',
    icon: '🧪',
    title: 'Эксперименты',
    description: 'Проведённые гражданами',
    previewSrc: '/images/experiment-preview.jpg',
    driveLink: 'https://drive.google.com/drive/folders/12pDXKYIK_Ho_ujBZSbjbwvQ0vI0z0KCY?usp=sharing',
  },
  {
    key: 'document',
    icon: '📜',
    title: 'Документы',
    description: 'Различные книги/материалы',
    previewSrc: '/images/document-preview.jpg',
    driveLink: 'https://drive.google.com/drive/folders/1J2nx_BqfFnLWP9hzsbiauuMzJ-pJYJxt?usp=sharing',
  },
  {
    key: 'audio',
    icon: '🎙',
    title: 'Музыка',
    description: '',
    audioList: [
      { title: 'Фальшивая луна', src: '/media/1.mp3' },
      { title: 'Лунный свет', src: '/media/2.mp3' },
    ],
    driveLink: 'https://www.terra-zetetica.org/music',
  }
];

export default function Materials() {
  return (
    <>
      <Head>
        <title>Материалы | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Материалы Terra Zetetica</h1>
        <p>Ниже — по одному примеру из каждой категории. Для полного архива переходите по ссылке «Смотреть всё».</p>

        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          {materials.map((m) => (
            <div
              key={m.key}
              className="card"
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 .5rem' }}>{m.icon} {m.title}</h3>
                <p style={{ margin: '0 0 1rem', color: '#555' }}>{m.description}</p>

                {/* Видео в <video> */}
                {m.videoSrc && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%',
                      marginBottom: '1rem',
                      overflow: 'hidden',
                      backgroundColor: '#000',
                    }}
                  >
                <video
                  src={m.videoSrc}
                  poster={m.poster}
                  controls
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                  </div>
                )}

                {/* Видео в iframe */}
                {m.embedSrc && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%',
                      marginBottom: '1rem',
                      overflow: 'hidden',
                    }}
                  >
                    <iframe
                      src={m.embedSrc}
                      title={m.title}
                      frameBorder="0"
                      allow="encrypted-media; fullscreen;"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </div>
                )}

                {/* Изображение */}
                {m.previewSrc && !m.videoSrc && (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '56.25%',
                      marginBottom: '1rem',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={m.previewSrc}
                      alt={m.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}

                {/* Аудио */}
                {/* Аудио: несколько треков */}
                {m.audioList && (
                  <div style={{ marginBottom: '1rem' }}>
                    {m.audioList.map((track, idx) => (
                      <div key={idx} style={{ marginBottom: '0.75rem' }}>
                        <strong>{track.title}</strong>
                        <audio
                          controls
                          src={track.src}
                          style={{ width: '100%', marginTop: '0.25rem' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                 {/* Один трек */}
                {m.audioSrc && !m.audioList && (
                  <audio
                    controls
                    src={m.audioSrc}
                    style={{ width: '100%', marginBottom: '1rem' }}
                  />
                )}

                <a
                  href={m.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#0066cc', fontWeight: 500 }}
                >
                  Смотреть всё ▶
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
