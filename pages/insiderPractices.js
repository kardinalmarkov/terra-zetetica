import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';

// ---------- Static Data ----------
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
  // ---------- State ----------
  const [checkedItems, setCheckedItems] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [outcomesCollapsed, setOutcomesCollapsed] = useState(true);

  // ---------- Effects ----------
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

  // ---------- Helpers ----------
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

  const countMarked = key => (checkedItems[key] || []).length;

  // Memoized totals for performance & cleaner progress bar calc.
  const totals = useMemo(() => ({
    positive: countMarked('positive'),
    negative: countMarked('negative'),
    observer: countMarked('observer')
  }), [checkedItems]);

  const grandTotal = totals.positive + totals.negative + totals.observer || 1;

  // ---------- JSX ----------
  return (
    <>
      <Head>
        <title>Практика Инсайдера | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem', fontSize: isMobile ? '0.95rem' : '1rem', lineHeight: 1.55 }}>
        <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem' }}>🧬 Практика по Откровениям Инсайдера</h1>

        {/* Navigation */}
        <div className="banner-nav">
          <strong>📊 Навигация:</strong> В течение дня ты действуешь из одной или нескольких полярностей:
          <ul>
            <li><strong>🧘 Служение другим</strong> → путь сердца, эмпатии, отдачи</li>
            <li><strong>🌀 Служение себе</strong> → путь воли, дисциплины, трансформации</li>
            <li><strong>⚖️ Наблюдатель</strong> → путь наблюдения, но без выбора (ведёт к повтору)</li>
          </ul>
        </div>

        {/* Mobile-friendly collapsible doctrine section */}
        <details open={!isMobile} style={{ marginBottom: '1.5rem' }}>
          <summary>📖 Описание учения и 4D переходов</summary>
          <DoctrineContent />
        </details>

        {/* Daily Choice Checkbox */}
        <div className="choice-box">
          <label>
            <input type="checkbox" checked={chosen} onChange={() => setChosen(!chosen)} />
            ☑️ Я осознанно выбираю путь своей души сегодня
          </label>
        </div>

        <button onClick={resetDay} className="reset-btn">🔄 Сбросить отметки за день</button>

        {/* Checklists */}
        {Object.entries(checklistData).map(([key, data]) => {
          const markedCount = countMarked(key);
          return (
            <section key={key} className="checklist-section">
              <h2>{data.title}</h2>
              <p className="description">{data.description}</p>

              {data.items.map((item, i) => (
                <label key={i} className="item-label" title={getTooltip(key)}>
                  <input type="checkbox" checked={(checkedItems[key] || []).includes(i)} onChange={() => toggle(key, i)} />
                  {item}
                </label>
              ))}

              <div className="marked-counter">✅ Отмечено: {markedCount} / {data.items.length}</div>
            </section>
          );
        })}

        {/* Path Vector */}
        <div style={{ padding: '1rem', borderTop: '1px solid #ccc' }}>
          <h2>🎯 Вектор Пути <span title="4D — это уровень сознания, следующий за нашей реальностью. Там ты творишь мыслями, общаешься телепатически и действуешь согласно своей вибрации.">ℹ️</span></h2>
          <p>Посмотри, какой энергии в тебе было больше сегодня:</p>
          <ul>
            {Object.keys(checklistData).map(key => (
              <li key={key}>{checklistData[key].title}: {countMarked(key)} отметок</li>
            ))}
          </ul>

          <div className="progress-bar">
            <div className="positive" style={{ width: `${(totals.positive / grandTotal) * 100}%` }} />
            <div className="observer" style={{ width: `${(totals.observer / grandTotal) * 100}%` }} />
            <div className="negative" style={{ width: `${(totals.negative / grandTotal) * 100}%` }} />
          </div>

          {/* Collapsible Outcomes */}
          <section className="outcomes-section">
            <header onClick={() => setOutcomesCollapsed(prev => !prev)} className="outcomes-header">
              <h3>📌 Возможные исходы после Жатвы</h3>
              <span>{outcomesCollapsed ? '▼' : '▲'}</span>
            </header>

            {!outcomesCollapsed && (
              <ul className="outcomes-list">
                <li>🧘 <strong>4D Позитивная:</strong> Мир Любви, Сострадания, Телепатии.</li>
                <li>🌀 <strong>4D Негативная:</strong> Мир Служения Себе, Кармического Возмещения.</li>
                <li>⚖️ <strong>Остаток / 3D:</strong> Невыбор → откат на другую 3D-планету.</li>
              </ul>
            )}
          </section>

          {/* Daily Result */}
          <DailyResult totals={totals} />

          <blockquote className="closing-quote">«Свет и Тьма — лишь инструменты. Оба ведут к Источнику. Вопрос — каким маршрутом ты хочешь идти.»</blockquote>
        </div>

        {/* --- Why All This? button & info --- */}
        <button className="why-btn" onClick={() => setShowInfo(true)}>🧭 Зачем всё это?</button>

        {showInfo && (
          <div className="info-overlay" role="dialog" aria-modal="true">
            <div className="info-content">
              <button className="close-info" onClick={() => setShowInfo(false)}>✖</button>
              <h2>Зачем всё это?</h2>
              <p>Переход — это выбор вибрации. Каждый день — шанс повернуть свой путь.</p>
              <p><em>«Ты — существо, проходящее через Игру. Всё, что ты выбираешь — формирует реальность, в которой ты проснёшься завтра.»</em></p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .banner-nav {
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          background: #f8f9fb;
          border-left: 4px solid #6c63ff;
          border-radius: 6px;
        }
        .banner-nav ul {
          margin-top: 0.5rem;
          padding-left: 1.2rem;
        }

        .choice-box {
          margin: 1rem 0;
          padding: 1rem;
          border: 1px dashed #aaa;
          border-radius: 6px;
        }
        .choice-box input { margin-right: .5rem; }

        .reset-btn {
          margin-bottom: 2rem;
          background: #eee;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .checklist-section {
          margin-bottom: 3rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .description { color: #444; font-size: .95rem; }
        .item-label { display: flex; align-items: center; padding: .4rem 0; }
        .item-label input { margin-right: .75rem; }
        .marked-counter { margin-top: 1rem; font-weight: 600; }

        .progress-bar {
          display: flex;
          height: 14px;
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
        }
        .positive { background: #a5d6a7; }
        .observer { background: #e0e0e0; }
        .negative { background: #ef9a9a; }

        .outcomes-section { margin-top: 1rem; background: #f9f9f9; border-radius: 6px; }
        .outcomes-header { display: flex; justify-content: space-between; align-items: center; padding: .75rem 1rem; cursor: pointer; }
        .outcomes-list { padding: 0 1.25rem 1rem; }

        .closing-quote { margin-top: 2rem; font-style: italic; text-align: center; color: #555; }

        .why-btn {
          display: block;
          margin: 2rem auto;
          padding: .65rem 1.25rem;
          border-radius: 8px;
          background: #6c63ff;
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .info-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .info-content {
          background: #fff;
          padding: 2rem 1.5rem;
          border-radius: 10px;
          max-width: 500px;
          width: 90%;
          position: relative;
        }
        .close-info {
          position: absolute;
          top: .5rem;
          right: .5rem;
          background: transparent;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
        }

        @media (max-width: 767px) {
          .banner-nav ul { padding-left: .8rem; }
          h1 { font-size: 1.6rem; }
        }
      `}</style>
    </>
  );
}

// ---------- Extracted Components ----------
function DoctrineContent() {
  return (
    <div style={{ marginTop: '1rem', color: '#444' }}>
      <p><strong>🌀 Три исхода после Жатвы:</strong><br />• <strong>4D Позитив:</strong> Мир Любви, Единства, Сострадания.<br />• <strong>4D Негатив:</strong> Путь силы, дисциплины и одиночества.<br />• <strong>3D Повтор:</strong> Если душа не сделала выбор — она перезапускает Игру на другой 3D планете.</p>
      <p><strong>🌗 Что определяет путь:</strong><br />• Кому ты служишь<br />• Уровень осознания Игры<br />• Твоя вибрация</p>
      <p><strong>💡 Путь Света:</strong> Любовь, Служение, Единство<br /><strong>🌑 Путь Силы:</strong> Контроль, Самоцентризм, Жертва<br /><strong>⚪ Невыбор:</strong> Перезапуск цикла</p>
      <p><em>✨ Оба пути — Света и Силы — ведут к Источнику. Вопрос лишь в том, каким маршрутом ты хочешь идти.</em></p>
      <p style={{ marginTop: '1rem' }}>📘 <a href="/materials/docs/Откровения_инсайдера.pdf" target="_blank">Скачать книгу «Откровения Инсайдера»</a></p>
    </div>
  );
}

function getTooltip(key) {
  switch (key) {
    case 'positive':
      return '«Вы не должны бороться — лишь выбрать, быть Искренним и Благодарным»';
    case 'negative':
      return '«Служение себе — труднейший путь, путь боли и одиночества, но вы выбрали его»';
    default:
      return '«Наблюдение без действия — ещё не Путь. Путь — это Воля»';
  }
}

function DailyResult({ totals }) {
  const normPositive = totals.positive / 3;
  const normNegative = totals.negative / 5;

  if (normNegative >= 1 && normNegative > normPositive) {
    return (
      <>
        <p>🔴 Ты поляризован в сторону Служения Себе — путь 4D негативной.</p>
        <em>«Служение себе — труднейший путь. Но он ведёт в 4D так же, как и Свет.»</em>
      </>
    );
  } else if (normPositive >= 1 && normPositive > normNegative) {
    return (
      <>
        <p>🟢 Ты сегодня двигался к Светлой 4D — служение другим.</p>
        <em>«Вы не должны бороться — лишь выбрать, быть Искренним и Благодарным»</em>
      </>
    );
  } else if (normNegative >= 1 && normPositive >= 1 && normPositive === normNegative) {
    return (
      <>
        <p>⚔️ Ты сегодня балансировал между Светом и Силой. Выбор всё ещё не сделан.</p>
        <em>«Даже баланс — это иллюзия. Тебе всё равно придётся выбрать.»</em>
      </>
    );
  }
  return (
    <>
      <p>⚪ Пока недостаточно действий — ты остаёшься в нейтральной зоне.</p>
      <em>«Невыбор — это тоже выбор. Он обнуляет Игру.»</em>
    </>
  );
}