// pages/materials.js
import Head from 'next/head';

const materials = [
  {
    key: 'photo',
    icon: '📸',
    title: 'Фото: Анклавы Terra Zetetica',
    description: 'Первый фотоснимок физического анклава в Беларуси',
    driveLink: 'https://drive.google.com/drive/folders/1HcETdfZEZOtg9Dm0idmQSTnd9DdAXk9C?usp=sharing',
  },
  {
    key: 'video',
    icon: '🎥',
    title: 'Видео: Промо 2025',
    description: 'Короткий ролик о создании первого анклава',
    embed: `<iframe width="560" height="315" src="https://app.heygen.com/embeds/9d421401b0574669994e38b410c84e66" title="HeyGen video player" frameborder="0" allow="encrypted-media; fullscreen;" allowfullscreen></iframe>`,
    driveLink: 'https://drive.google.com/drive/folders/1gFT-J1gcxM1kLkB6MY4Sj8pWwdBwmafF?usp=sharing',
  },
  {
    key: 'experiment',
    icon: '🧪',
    title: 'Эксперименты: DAO-голосование',
    description: 'Фото и видео реального теста голосования через DAO',
    driveLink: 'https://drive.google.com/drive/folders/12pDXKYIK_Ho_ujBZSbjbwvQ0vI0z0KCY?usp=sharing',
  },
  {
    key: 'document',
    icon: '📜',
    title: 'Документы: Конституция',
    description: 'Полный текст Конституции Terra Zetetica',
    driveLink: 'https://drive.google.com/drive/folders/1J2nx_BqfFnLWP9hzsbiauuMzJ-pJYJxt?usp=sharing',
  },
  {
    key: 'audio',
    icon: '🎙',
    title: 'Музыка',
    description: 'Фальшивая луна.mp3',
    audioSrc: '/media/1.mp3',
    driveLink: 'https://drive.google.com/drive/folders/1NB0CZftSTvnlYGrFd92KjmjF84vQ48OY?usp=sharing',
  },
];

export default function Materials() {
  return (
    <>
      <Head>
        <title>Материалы | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>Материалы Terra Zetetica</h1>
        <p>
          Ниже — по одному примеры из каждой категории. Для полного архива переходите по ссылке «Смотреть
          всё».
        </p>

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
                <h3 style={{ margin: '0 0 .5rem' }}>
                  {m.icon} {m.title}
                </h3>
                <p style={{ margin: '0 0 1rem', color: '#555' }}>{m.description}</p>

                {m.key === 'video' && (
                  <div
                    style={{ marginBottom: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: m.embed }}
                  />
                )}

                {m.key === 'audio' && (
                  <audio
                    controls
                    src={m.audioSrc}
                    style={{
                      width: '100%',
                      marginBottom: '1rem',
                    }}
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

        <section id="contribute" style={{ marginTop: '4rem' }}>
          <h2>Предложить свой материал</h2>
          <form
            action="https://formspree.io/f/your-form-id"
            method="POST"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Ваше имя"
              required
              style={{ padding: '0.75rem', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Ваш Email"
              required
              style={{ padding: '0.75rem', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <select
              name="category"
              required
              style={{ padding: '0.75rem', borderRadius: 4, border: '1px solid #ccc' }}
            >
              <option value="">Категория материала</option>
              <option value="photo">Фото</option>
              <option value="video">Видео</option>
              <option value="experiment">Эксперименты</option>
              <option value="document">Документы</option>
              <option value="audio">Аудио</option>
            </select>
            <input
              type="text"
              name="title"
              placeholder="Название / Краткое описание"
              required
              style={{ padding: '0.75rem', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <input
              type="url"
              name="url"
              placeholder="Ссылка на файл (Google Drive, YouTube и т.п.)"
              required
              style={{ padding: '0.75rem', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <textarea
              name="comment"
              placeholder="Комментарий (необязательно)"
              rows={3}
              style={{ padding: '0.75rem', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="agreement" required />
              Я подтверждаю, что имею право поделиться этим материалом.
            </label>
            <button
              type="submit"
              className="btn primary"
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: 4,
                backgroundColor: '#ffcc00',
                cursor: 'pointer',
                fontWeight: 500,
                maxWidth: 200,
              }}
            >
              Отправить
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
