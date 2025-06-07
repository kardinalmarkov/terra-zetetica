import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function MyPath() {
  const [dailyLog, setDailyLog] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('insider_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setDailyLog(parsed.dailyLog || []);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Мой Путь — Terra Zetetica</title>
      </Head>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>📊 Мой Путь</h1>

        {dailyLog.length === 0 ? (
          <p>Нет сохранённых данных. Завершай дни в практике, чтобы видеть динамику.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {dailyLog.map((log, i) => (
              <li key={i} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
                <h3>📅 {log.date}</h3>
                <p><strong>Служение другим:</strong> {log.checkedItems?.positive?.length || 0} / 5</p>
                <p><strong>Служение себе:</strong> {log.checkedItems?.negative?.length || 0} / 5</p>
                <p><strong>Наблюдатель:</strong> {log.checkedItems?.observer?.length || 0} / 5</p>
                {log.insight && (
                  <p style={{ marginTop: '1rem' }}>
                    💡 <em>{log.insight}</em>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
