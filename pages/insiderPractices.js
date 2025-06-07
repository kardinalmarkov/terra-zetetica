
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
        <p>Основано на философии книги "Откровения Инсайдера". Ты не обязан быть добрым или злым. Ты можешь быть осознанным.</p>
        <p>Жатва — это не суд. Это естественный итог вектора твоей души.</p>
        <p>Ты сам выбираешь свой путь. И несёшь за него полную ответственность.</p>

        <button
          onClick={resetDay}
          style={{ margin: '1.5rem 0', background: '#eee', padding: '0.5rem 1rem', borderRadius: 6 }}
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
          <p>Подсчитай, каких действий сегодня было больше — и ты увидишь, в каком направлении движется твоя душа.</p>
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
