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
    description: 'Путь осознания и наблюдения. Но без выбора полярности — ведёт к повтору цикла в 3D.',
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
  const [chosen, setChosen] = useState(false);

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
    setChosen(false);
  };

  const countMarked = (key) => (checkedItems[key] || []).length;

  return (
    <>
      <Head>
        <title>Практика Инсайдера | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🧬 Практика по Откровениям Инсайдера</h1>

        <details style={{ marginBottom: '1.5rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            📖 Описание учения и 4D переходов
          </summary>
          <div style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            <p><strong>🌀 Три исхода после Жатвы:</strong><br />
              • 4D Позитив — ≥51% служения другим<br />
              • 4D Негатив — ≥95% служения себе<br />
              • 3D Повтор — если между (нейтралитет)</p>

            <p><strong>🌗 Что определяет путь:</strong><br />
              • Кому ты служишь<br />
              • Уровень осознания Игры<br />
              • Твоя вибрация</p>

            <p><strong>💡 Путь Света:</strong> Любовь, Служение, Единство<br />
            <strong>🌑 Путь Силы:</strong> Контроль, Самоцентризм, Жертва<br />
            <strong>⚪ Невыбор:</strong> Перезапуск цикла</p>

            <p>
              📘 <a href="/materials/docs/Откровения_инсайдера.pdf" target="_blank">
                Скачать книгу «Откровения Инсайдера»
              </a>
            </p>
          </div>
        </details>

        <div style={{ margin: '1rem 0', padding: '1rem', border: '1px dashed #aaa', borderRadius: 6 }}>
          <label>
            <input type="checkbox" checked={chosen} onChange={() => setChosen(!chosen)} style={{ marginRight: '0.5rem' }} />
            ☑️ Я осознанно выбираю путь своей души сегодня
          </label>
        </div>

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
                  title={
                    key === 'positive'
                      ? '«Вы не должны бороться — лишь выбрать, быть Искренним и Благодарным»'
                      : key === 'negative'
                        ? '«Служение себе — труднейший путь, путь боли и одиночества, но вы выбрали его»'
                        : '«Наблюдение без действия — ещё не Путь. Путь — это Воля»'
                  }
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

          <div style={{ margin: '1rem 0', background: '#f9f9f9', padding: '1rem', borderRadius: 6 }}>
            <h3>📌 Возможные исходы после Жатвы:</h3>
            <ul>
              <li>🧘 <strong>4D Позитивная:</strong> Мир Любви, Сострадания, Телепатии.</li>
              <li>🌀 <strong>4D Негативная:</strong> Мир Служения Себе, Кармического Возмещения.</li>
              <li>⚖️ <strong>Остаток / 3D:</strong> Невыбор → откат на другую 3D-планету.</li>
            </ul>
          </div>

          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f4ff', borderRadius: 6 }}>
            <h3>📈 Итог дня:</h3>
            <p>
              {countMarked('positive') >= 3
                ? '🟢 Ты сегодня двигался к Светлой 4D — служение другим.'
                : countMarked('negative') >= 5
                  ? '🔴 Ты уверенно поляризован в сторону Служения Себе — путь 4D негативной.'
                  : '⚪ Пока недостаточно действий — ты остаёшься в нейтральной зоне.'}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
