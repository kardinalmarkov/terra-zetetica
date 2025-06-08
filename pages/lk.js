// pages/lk.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parse } from 'cookie';
import { supabase } from '@/lib/supabase';

export default function Lk({ user }) {
  const router = useRouter();
  const [citizen, setCitizen] = useState(null);

  // если нет cookie — редирект на главную
  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }
    // подгружаем запись из Supabase
    supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Ошибка загрузки гражданина:', error);
        } else {
          setCitizen(data);
        }
      });
  }, [user]);

  const handleLogout = async () => {
    // вызываем API, которое сбросит куку
    await fetch('/api/logout');
    router.replace('/');
  };

  if (!user || !citizen) {
    return (
      <main className="wrapper">
        <p>Загрузка...</p>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Личный кабинет | Terra Zetetica</title>
      </Head>
      <main className="wrapper">
        <button onClick={handleLogout} style={{ marginBottom: 20 }}>Выйти</button>

        {/* Приветствие */}
        <h1>👤 Личный кабинет</h1>
        <p>Здравствуйте, {user.first_name} {user.last_name}! 🇷🇺</p>

        {/* 1. Профиль */}
        <section style={{ marginTop: 30 }}>
          <h2>🙏 Профиль</h2>
          <img
            src={user.photo_url}
            alt="avatar"
            style={{ width: 120, borderRadius: '50%', marginBottom: 10 }}
          />
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Телеграм имя:</strong> @{user.username || '—'}</p>
          <p>
            <strong>Статус:</strong>{' '}
            {citizen.status === 'valid'
              ? '✅ Гражданин Terra Zetetica'
              : '❓ Не гражданин'}
          </p>
        </section>

        {/* 2. Паспорт / Челлендж */}
        <section style={{ marginTop: 30 }}>
          <h2>📜 Паспорт / 🏠 Челлендж</h2>
          <p><strong>Z-ID:</strong> {citizen.zetetic_id || '—'}</p>
          <p>
            <strong>IPFS:</strong>{' '}
            {citizen.ipfs_url
              ? <a href={citizen.ipfs_url} target="_blank">ссылка</a>
              : '—'}
          </p>
          <p><strong>Статус челленджа:</strong> {citizen.challenge_status || '—'}</p>
        </section>

        {/* 3. Прогресс (заглушка) */}
        <section style={{ marginTop: 30 }}>
          <h2>📈 Мой прогресс</h2>
          <p>Здесь будет отображаться ваш ежедневный прогресс по челленджу.</p>
        </section>
      </main>
    </>
  );
}

// этот `getServerSideProps` нужен, чтобы забрать куку и разобрать её до рендера
export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const user = cookies.user ? JSON.parse(cookies.user) : null;
  return { props: { user } };
}
