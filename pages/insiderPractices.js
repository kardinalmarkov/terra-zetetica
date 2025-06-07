
import Head from 'next/head';
import { useState, useEffect } from 'react';

const checklistData = {
  positive: {
    title: '🧘 Путь Служения Другим (51%+)',
    description: 'Путь света, альтруизма и отдачи. Ведёт к 4-й позитивной плотности.',
    items: [
      'Сделал что-то бескорыстно для другого',
      'Услышал без осуждения',
      'Поддержал в момент слабости',
      'Смягчил конфликт',
      'Отказался от личной выгоды ради общего блага'
    ]
  },
  negative: {
    title: '🌀 Путь Служения Себе (95%)',
    description: 'Сознательная поляризация на себя. Контроль, власть, фокус на себе. Ведёт к 4-й негативной плотности.',
    items: [
      'Утвердил свою волю над другим',
      'Поставил себя на первое место',
      'Отказался уступить',
      'Манипулировал ради выгоды',
      'Использовал ресурс в ущерб другим'
    ]
  },
  observer: {
    title: '⚖️ Путь Наблюдателя / Исследователя',
    description: 'Путь глубинного осознания и анализа. Ведёт к пониманию Игры.',
    items: [
      'Наблюдал эмоции без оценки',
      'Вёл дневник осознаний',
      'Не втянулся в конфликт',
      'Замечал повторяющиеся паттерны',
      'Задавался вопросом «зачем это пришло?»'
    ]
  }
};

export default function InsiderPractices() {
  const [checkedItems, setCheckedItems] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const saved = localStorage.getItem('insider_progress');
    if (saved) setCheckedItems(JSON.parse(saved));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('insider_progress', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggle = (key, index) => {
    setCheckedItems(prev => {
      const section = prev[key] || [];
      return {
        ...prev,
        [key]: section.includes(index)
          ? section.filter(i => i !== index)
          : [...section, index]
      };
    });
  };

  const resetDay = () => {
    setCheckedItems({});
  };

  const countMarked = (key) => {
    return (checkedItems[key] || []).length;
  };

  return (
    <>
      <Head>
        <title>Практика Инсайдера | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🧬 Практика по Откровениям Инсайдера</h1>

        <details style={{ marginBottom: '1.5rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500, fontSize: '1.05rem' }}>
            📖 Описание перехода в 4D, Жатвы и трёх путей
          </summary>
          <div style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            <p><strong>🌀 Три исхода после Жатвы:</strong><br />
            • 4D Позитив — если служил другим на 51%+<br />
            • 4D Негатив — если служил себе на 95%+<br />
            • Перезапуск в 3D — если остался между</p>

            <p><strong>🌗 Что определяет путь:</strong><br />
            • Твоя поляризация (кому ты служишь)<br />
            • Осознанность роли в Игре<br />
            • Энергетическая вибрация</p>

            <p><strong>💡 Путь в светлую 4D:</strong><br />
            • Служи другим, действуй с любовью<br />
            • Осознай связь с Единым<br />
            • Будь бодр и честен перед собой</p>

            <p><strong>🌑 Путь в тёмную 4D:</strong><br />
            • 95% служения себе<br />
            • Контроль, сила, сознательная жертва</p>

            <p><em>Истина проста: хочешь выйти — выбери. Нет выбора — цикл продолжается.</em></p>
            <p style={{ marginTop: '0.5rem' }}>
              📘 <a href="/materials/docs/Откровения_инсайдера.pdf" target="_blank" rel="noopener noreferrer">
                Скачать книгу «Откровения Инсайдера»
              </a>
            </p>
          </div>
        </details>

        <button
          onClick={resetDay}
          style={{ marginBottom: '2rem', background: '#eee', padding: '0.5rem 1rem', borderRadius: 6 }}
        >
          🔄 Сбросить отметки за день
        </button>

        {Object.entries(checklistData).map(([key, data]) => {
          const markedCount = countMarked(key);
          return (
            <div
              key={key}
              style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}
            >
              <h2>{data.title}</h2>
              <p>{data.description}</p>
              {data.items.map((item, i) => (
                <label
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0' }}
                >
                  <input
                    type="checkbox"
                    checked={(checkedItems[key] || []).includes(i)}
                    onChange={() => toggle(key, i)}
                    style={{ marginRight: '0.75rem' }}
                  />
                  {item}
                </label>
              ))}
              <div style={{ marginTop: '1rem', fontWeight: 600 }}>
                ✅ Отмечено: {markedCount} / {data.items.length}
              </div>
            </div>
          );
        })}

        <div style={{ padding: '1rem', borderTop: '1px solid #ccc' }}>
          <h2>🎯 Вектор Пути</h2>
          <p>Посмотри, какой энергии в тебе было больше сегодня:</p>
          <ul>
            {Object.keys(checklistData).map(key => (
              <li key={key}>
                {checklistData[key].title}: {countMarked(key)} отметок
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
