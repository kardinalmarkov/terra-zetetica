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
  const [insight, setInsight] = useState('');
  const [dailyLog, setDailyLog] = useState([]);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const saved = localStorage.getItem('insider_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCheckedItems(parsed.checkedItems || {});
      setInsight(parsed.insight || '');
      setDailyLog(parsed.dailyLog || []);
    }


    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('insider_progress', JSON.stringify({
      checkedItems,
      insight,
      dailyLog
    }));
  }, [checkedItems, insight, dailyLog]);


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

  const completeDay = () => {
    const totalToday = {
      date: new Date().toISOString().split('T')[0],
      checkedItems,
      insight
    };

    const hasData = Object.values(checkedItems).some(arr => arr.length > 0) || insight.trim() !== '';

    if (hasData) {
      const updatedLog = [...dailyLog.filter(log => log.date !== totalToday.date), totalToday];
      setDailyLog(updatedLog);
      localStorage.setItem('insider_progress', JSON.stringify({
        checkedItems: {},
        insight: '',
        dailyLog: updatedLog
      }));
    }


    setCheckedItems({});
    setChosen(false);
    setInsight('');
  };

  const countMarked = (key) => (checkedItems[key] || []).length;

  const total = {
    positive: countMarked('positive'),
    negative: countMarked('negative'),
    observer: countMarked('observer'),
  };

  return (
    <>
      <Head>
        <title>Практика Инсайдера | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🧬 Практика по Откровениям Инсайдера</h1>

        <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', background: '#f8f9fb', borderLeft: '4px solid #6c63ff', borderRadius: 6 }}>
          <strong>📊 Навигация:</strong> В течение дня ты действуешь из одной или нескольких полярностей:
          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
            <li><strong>🧘 Служение другим</strong> → путь сердца, эмпатии, отдачи</li>
            <li><strong>🌀 Служение себе</strong> → путь воли, дисциплины, трансформации</li>
            <li><strong>⚖️ Наблюдатель</strong> → путь наблюдения, но без выбора (ведёт к повтору)</li>
          </ul>
        </div>

        <details style={{ marginBottom: '1.5rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
            📖 Описание учения и 4D переходов
          </summary>
          <div style={{ marginTop: '1rem', lineHeight: '1.6', fontSize: '0.95rem', color: '#444' }}>
            <p><strong>🌀 Три исхода после Жатвы:</strong><br />
              • <strong>4D Позитив:</strong> Мир Любви, Единства, Сострадания.<br />
              <em>«Вы будете творить чудесные вещи… Это будет волшебное время.»</em><br />
              • <strong>4D Негатив:</strong> Путь силы, дисциплины и одиночества.<br />
              <em>«Это будет не самое приятное место. Но именно там мы очистим свою Карму.»</em><br />
              • <strong>3D Повтор:</strong> Если душа не сделала выбор — она перезапускает Игру на другой 3D планете.<br />
              <em>«Большинство продолжат Игру — с нуля.»</em>
            </p>

            <p><strong>🌗 Что определяет путь:</strong><br />
              • Кому ты служишь<br />
              • Уровень осознания Игры<br />
              • Твоя вибрация
            </p>

            <p><strong>💡 Путь Света:</strong> Любовь, Служение, Единство<br />
              <strong>🌑 Путь Силы:</strong> Контроль, Самоцентризм, Жертва<br />
              <strong>⚪ Невыбор:</strong> Перезапуск цикла
            </p>

            <p><em>✨ Оба пути — Света и Силы — ведут к Источнику. Вопрос лишь в том, каким маршрутом ты хочешь идти.</em></p>

            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
                ✨ Подробнее о 4-й Плотности (цитаты Инсайдера)
              </summary>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>🌟 4D Позитив:</strong><br />
                  Это уровень Любви, телепатии и прозрачности. Здесь невозможно лгать или скрываться. Ты становишься частью Единого.<br />
                  <em>«Ты будешь чувствовать боль других как свою. Но это будет сила, а не слабость.»</em><br />
                  <em>«Там ты вспомнишь, что ты — Бог, играющий в Человека.»</em>
                </p>
                <p><strong>🌀 4D Негатив:</strong><br />
                  Это уровень полной воли. Ты жертвуешь сердцем ради контроля. Всё — иерархия, мощь и управление энергией.<br />
                  <em>«Мы выбрали быть вашими катализаторами. Это наш путь. Не судите его.»</em><br />
                  <em>«Через страдание мы познаём границы. Через боль — свою Истинную Мощь.»</em>
                </p>
                <p><strong>⚪ Остаться в 3D:</strong><br />
                  Означает — не сделать выбор. <em>«Невыбор — это тоже выбор. Он обнуляет Игру.»</em>
                </p>
              </div>
            </details>

            <p style={{ marginTop: '1rem' }}>
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

        <div style={{ margin: '2rem 0' }}>
          <label htmlFor="insight" style={{ fontWeight: 600 }}>
            💡 Озарение дня:
          </label>
          <textarea
            id="insight"
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            placeholder="Что ты понял(а), осознал(а) сегодня?"
            style={{
              display: 'block',
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: '1rem',
              minHeight: '100px'
            }}
          />
        </div>

        <button
          onClick={() => window.location.href = '/my-path-insiderPractices'}
          style={{ marginBottom: '1rem', background: '#e3f2fd', padding: '0.5rem 1rem', borderRadius: 6 }}
        >
          📊 Мой путь
        </button>

        <button
          onClick={completeDay}
          style={{ marginBottom: '2rem', background: '#dcedc8', padding: '0.75rem 1.25rem', borderRadius: 6, fontWeight: 600 }}
        >
          💾 Завершить день и начать новый
        </button>


        {Object.entries(checklistData).map(([key, data]) => {
          const markedCount = countMarked(key);
          return (
            <div
              key={key}
              style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}
            >
              <h2>{data.title}</h2>
              <p style={{ fontSize: '0.95rem', color: '#444' }}>{data.description}</p>
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
          <h2>🎯 Вектор Пути <span title="4D — это уровень сознания, следующий за нашей реальностью. Там ты творишь мыслями, общаешься телепатически и действуешь согласно своей вибрации.">ℹ️</span></h2>
          <p>Посмотри, какой энергии в тебе было больше сегодня:</p>
          <ul>
            {Object.keys(checklistData).map(key => (
              <li key={key}>
                {checklistData[key].title}: {countMarked(key)} отметок
              </li>
            ))}
          </ul>

<div style={{ marginTop: '1.5rem' }}>
  <div style={{
    display: 'flex',
    height: '14px',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#eee',
    position: 'relative',
    marginBottom: '0.5rem'
  }}>
    <div style={{ flex: total.positive, background: '#a5d6a7' }} />
    <div style={{ flex: total.observer, background: '#e0e0e0' }} />
    <div style={{ flex: total.negative, background: '#ef9a9a' }} />

    
  </div>

  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#555',
    padding: '0 2px'
  }}>
    <div>🧘 {total.positive} / 5</div>
    <div>⚖️ {total.observer} / 5</div>
    <div>🌀 {total.negative} / 5</div>
  </div>
</div>






          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f4ff', borderRadius: 6 }}>
            <h3>📈 Итог дня:</h3>
            {(() => {
              const p = countMarked('positive');
              const n = countMarked('negative');
              const o = countMarked('observer');

              const pPass = p >= 3;
              const nPass = n >= 5;

              if (nPass && !pPass) {
                return (
                  <>
                    <p>🔴 Ты поляризован в сторону Служения Себе — путь 4D негативной.</p>
                    <em>«Служение себе — труднейший путь. Но он ведёт в 4D так же, как и Свет.»</em>
                  </>
                );
              } else if (pPass && !nPass) {
                return (
                  <>
                    <p>🟢 Ты сегодня двигался к Светлой 4D — служение другим.</p>
                    <em>«Вы не должны бороться — лишь выбрать, быть Искренним и Благодарным»</em>
                  </>
                );
              } else if (pPass && nPass) {
                return (
                  <>
                    <p>⚔️ Ты балансируешь между Светом и Силой. Выбор ещё не сделан.</p>
                    <em>«Даже баланс — это иллюзия. Тебе всё равно придётся выбрать.»</em>
                  </>
                );
              } else if (o >= 3 && !pPass && !nPass) {
                return (
                  <>
                    <p>⚖️ Ты наблюдатель. Ты на краю, но ещё не выбрал путь.</p>
                    <em>«Наблюдение без действия — ещё не Путь. Путь — это Воля.»</em>
                  </>
                );
              } else {
                return (
                  <>
                    <p>⚪ Пока недостаточно действий — ты остаёшься в нейтральной зоне.</p>
                    <em>«Невыбор — это тоже выбор. Он обнуляет Игру.»</em>
                  </>
                );
              }
            })()}
          </div>


          <details style={{ margin: '1rem 0' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              📌 Возможные исходы после Жатвы
            </summary>
            <ul style={{ marginTop: '1rem' }}>
              <li>🧘 <strong>4D Позитивная:</strong> Мир Любви, Сострадания, Телепатии.</li>
              <li>🌀 <strong>4D Негативная:</strong> Мир Служения Себе, Кармического Возмещения.</li>
              <li>⚖️ <strong>Остаток / 3D:</strong> Невыбор → откат на другую 3D-планету.</li>
            </ul>
          </details>

          <details style={{ marginTop: '2rem' }}>
            <summary style={{ fontWeight: 600, cursor: 'pointer' }}>📘 Легенда и Смысл</summary>
            <div style={{ marginTop: '1rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p>✅ <strong>Порог Служения другим:</strong> минимум 3 из 5 (51%)</p>
              <p>🌀 <strong>Порог Служения себе:</strong> 5 из 5 (95%)</p>
              <p>⚖️ <strong>Путь наблюдателя:</strong> путь осознания и размышлений. Но без полярности (любви или воли) — переход в 4D невозможен.</p>
              <em>«Невыбор — это тоже выбор. Он обнуляет Игру.»</em>
              <hr />
              <p>🧘 Путь Света = Любовь, отдача, чувствование Единства</p>
              <p>🌀 Путь Силы = контроль, воля, одиночество</p>
              <p>⚪ Зона нуля = перезапуск, новое воплощение в 3D</p>
              <hr />
              <p><em>«Оба пути ведут к Источнику. Вопрос — через боль или любовь.»</em></p>
            </div>
          </details>



          <p style={{ marginTop: '2rem', fontStyle: 'italic', textAlign: 'center', color: '#555' }}>
            «Свет и Тьма — лишь инструменты. Оба ведут к Источнику. Вопрос — каким маршрутом ты хочешь идти.»
          </p>
            <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #ddd', fontSize: '0.95rem', color: '#444' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>📜 Итог от Инсайдера</h3>
              <p style={{ fontStyle: 'italic' }}>
                Ответы на вопросы — не слова в экране, а энергия твоего опыта.
                Читай, размышляй, но главное — играй осознанно:
                <br />
                наблюдай мысль → выбирай полярность → действуй → благодарись.
                <br />
                В этом и есть путь к «максимальному знанию мироустройства» — знанию через живое проживание.
              </p>
            </div>

        </div>
      </main>
    </>
  );
}
