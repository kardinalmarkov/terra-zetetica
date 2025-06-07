import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function MyPath() {
  const [dailyLog, setDailyLog] = useState([]);

  const observerQuotes = [
    '«Ты можешь наблюдать вечно. Но только когда действуешь — ты входишь в игру.»',
    '«Невыбор — это тоже выбор. Он возвращает тебя в начало.»',
    '«Ты не можешь пройти в 4D без Воли или Сердца. Только поляризация ведёт к переходу.»',
    '«Наблюдение без действия — ещё не Путь. Путь — это Воля.»',
    '«Ты видишь паттерны — но ты их ещё не преобразовал.»'
  ];

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
          <>
            {/* 📊 График динамики */}
            <div style={{ display: 'flex', gap: '6px', margin: '2rem 0', alignItems: 'flex-end', height: '100px' }}>
              {dailyLog.map((log, i) => {
                const pos = log.checkedItems?.positive?.length || 0;
                const neg = log.checkedItems?.negative?.length || 0;
                const obs = log.checkedItems?.observer?.length || 0;
                const total = pos + neg + obs || 1;

                const posPct = (pos / total) * 100;
                const obsPct = (obs / total) * 100;
                const negPct = (neg / total) * 100;

                return (
                  <div key={i} style={{ textAlign: 'center', width: '20px' }}>
                    <div style={{
                      height: '100px',
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <div style={{ height: `${negPct}%`, background: '#ef9a9a' }} />
                      <div style={{ height: `${obsPct}%`, background: '#e0e0e0' }} />
                      <div style={{ height: `${posPct}%`, background: '#a5d6a7' }} />
                    </div>
                    <div style={{ fontSize: '0.65rem', marginTop: 4 }}>{log.date.slice(5)}</div>
                  </div>
                );
              })}
            </div>


            {/* 🗓️ История по дням */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {dailyLog.map((log, i) => {
                const p = log.checkedItems?.positive?.length || 0;
                const n = log.checkedItems?.negative?.length || 0;
                const o = log.checkedItems?.observer?.length || 0;

                const isObserverDay = o >= 3 && p < 3 && n < 5;

                return (
                  <li key={i} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
                    <h3>📅 {log.date}</h3>
                    <p><strong>Служение другим:</strong> {p} / 5</p>
                    <p><strong>Служение себе:</strong> {n} / 5</p>
                    <p><strong>Наблюдатель:</strong> {o} / 5</p>

                    {log.insight && (
                      <p style={{ marginTop: '1rem' }}>
                        💡 <em>{log.insight}</em>
                      </p>
                    )}

                    {isObserverDay && (
                      <p style={{ marginTop: '0.5rem', color: '#666', fontStyle: 'italic' }}>
                        {observerQuotes[i % observerQuotes.length]}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
