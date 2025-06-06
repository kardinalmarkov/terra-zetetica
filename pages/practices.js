import Head from 'next/head';
import { useState, useEffect } from 'react';

const checklistData = {
  '51': {
    title: '🧘 Практика 51%+ служения',
    description:
      'Цель — совершать действия, направленные на благо других, преодолевая эго. Это основа перехода на позитивную полярность.',
    items: [
      'Пожелал добра (мысленно или вслух)',
      'Не осудил, даже про себя',
      'Помог без ожиданий благодарности',
      'Поддержал морально, словом или присутствием',
      'Пожертвовал временем или ресурсом',
      'Уступил, не доказывая правоту',
      'Поблагодарил искренне',
      'Не стал сплетничать или критиковать',
      'Преодолел лень ради помощи другому',
      'Проявил любовь к ближнему через заботу'
    ],
    negatives: [
      'Осудил другого (вслух или про себя)',
      'Проявил агрессию, раздражение',
      'Поставил себя выше другого',
      'Был равнодушен к чужой боли',
      'Навязал своё мнение или правду',
      'Проигнорировал просьбу о помощи',
      'Оговорил или осмеял кого-то',
      'Соврал ради выгоды',
      'Позавидовал без попытки осознать',
      'Выбрал эгоизм, хотя мог бы помочь'
    ],
    content: `
      <p><strong>Суть практики:</strong> служение другим хотя бы в 51% действий, мыслей и намерений. Это не подвиг, а путь маленьких ежедневных шагов.</p>
      <p>Практика 51%+ является ключом для перехода на следующую ступень эволюции сознания в терминах Закона Одного. Именно такая поляризация позволяет выйти за пределы повторного воплощения в низших плотностях.</p>
    `
  },
  insider: {
    title: '🌀 Практика Инсайдера: служение тьмой во имя Света',
    description:
      'Вдохновлена «Откровениями Инсайдера» — осознанное смирение, ответственность и внутреннее развитие через молчание и баланс.',
    items: [
      'Осознал, что не ты контролируешь всё — отпустил',
      'Принял происходящее без страха или гнева',
      'Увидел в себе ложь/страх — признал честно',
      'Смолчал, где мог задеть или обидеть',
      'Не стал навязывать правду, даже зная больше',
      'Выдержал одиночество, не сливаясь с толпой',
      'Остался верен Пути, даже без поддержки',
      'Почувствовал благодарность к Неведомому',
      'Пробудил в себе сострадание к незнающим'
    ],
    negatives: [
      'Ожидал признания или одобрения',
      'Сбежал от тишины, заняв себя пустым',
      'Сомневался в пути и выбрал компромисс',
      'Испугался глубины и отвернулся от неё',
      'Поддался унынию, не увидев смысла',
      'Возжелал власти или контроля',
      'Проявил ложную смиренность (подавил себя)',
      'Укрылся в гордыне вместо честного взгляда внутрь'
    ],
    content: `
      <p><strong>Откровения Инсайдера</strong> раскрывают путь души, идущей через иллюзию разделённости, страха и контроля — но выбирающей Свет через внутреннее посвящение. Этот путь требует честности, смирения и понимания Закона Причины.</p>
      <p style="font-size: 90%; margin-top: 1rem">📄 <a href="/materials/docs/Откровения_инсайдера.pdf" target="_blank" rel="noopener noreferrer" style="color:#0066cc;font-weight:500">Скачать текст книги (PDF)</a></p>
    `
  }
};

export default function Practices() {
  const [checkedItems, setCheckedItems] = useState({});
  const [history, setHistory] = useState([]);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('practices_progress');
    if (saved) setCheckedItems(JSON.parse(saved));
    const savedHistory = localStorage.getItem('practices_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('practices_progress', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggle = (key, index, isNegative = false) => {
    setCheckedItems((prev) => {
      const posKey = isNegative ? `${key}_neg` : key;
      const section = prev[posKey] || [];
      return {
        ...prev,
        [posKey]: section.includes(index)
          ? section.filter((i) => i !== index)
          : [...section, index]
      };
    });
  };

  const resetDay = () => {
    const daySummary = {};
    Object.keys(checklistData).forEach((key) => {
      const positives = checkedItems[key]?.length || 0;
      const negatives = checkedItems[`${key}_neg`]?.length || 0;
      daySummary[key] = { positives, negatives, date: new Date().toISOString() };
    });
    const updatedHistory = [...history, daySummary];
    setHistory(updatedHistory);
    localStorage.setItem('practices_history', JSON.stringify(updatedHistory));
    setCheckedItems({});
  };

  const count = (key) => {
    const positives = checkedItems[key]?.length || 0;
    const negatives = checkedItems[`${key}_neg`]?.length || 0;
    return { positives, negatives };
  };

  const getBadge = (count) => {
    if (count >= 9) return '🥇 Проводник Света';
    if (count >= 6) return '🥈 Служение в действии';
    if (count >= 3) return '🥉 Доброе намерение';
    return '';
  };

  return (
    <>
      <Head>
        <title>Практики | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🌀 Практики служения и посвящения</h1>
        <p>Простые шаги на Пути Пробуждения, которые можно начать уже сегодня. Отмечайте, что удалось выполнить. Баланс и прогресс — ваш Проводник.</p>

        <button onClick={resetDay} style={{ margin: '1rem 0', background: '#eee', padding: '0.5rem 1rem', borderRadius: 6 }}>
          🔄 Сбросить отметки за день (и сохранить в историю)
        </button>

        <button onClick={() => setShowLegend(!showLegend)} style={{ marginBottom: '1rem' }}>
          📖 {showLegend ? 'Скрыть легенду' : 'Показать легенду'}
        </button>

        {showLegend && (
          <div style={{ background: '#f7f7f7', padding: '1rem', borderRadius: 8, marginBottom: '2rem', fontSize: '90%' }}>
            <p><strong>Легенда:</strong></p>
            <ul>
              <li>🥉 3+ выполнено — <em>Доброе намерение</em></li>
              <li>🥈 6+ — <em>Служение в действии</em></li>
              <li>🥇 9+ — <em>Проводник Света</em></li>
              <li>🌗 Итог: если позитивных больше — день засчитан как Светлый</li>
            </ul>
          </div>
        )}

        {Object.entries(checklistData).map(([key, data]) => {
          const { positives, negatives } = count(key);
          const badge = getBadge(positives);
          return (
            <div key={key} style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
              <h2>{data.title}</h2>
              <p>{data.description}</p>
              <div style={{ margin: '1rem 0' }} dangerouslySetInnerHTML={{ __html: data.content }} />

              <h4>✅ Позитивные действия:</h4>
              <div>
                {data.items.map((item, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0' }}>
                    <input
                      type="checkbox"
                      checked={(checkedItems[key] || []).includes(i)}
                      onChange={() => toggle(key, i)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    {item}
                  </label>
                ))}
              </div>

              {data.negatives && (
                <>
                  <h4 style={{ marginTop: '1.5rem' }}>⚠️ Негативные проявления:</h4>
                  <div>
                    {data.negatives.map((item, i) => (
                      <label key={i} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0' }}>
                        <input
                          type="checkbox"
                          checked={(checkedItems[`${key}_neg`] || []).includes(i)}
                          onChange={() => toggle(key, i, true)}
                          style={{ marginRight: '0.75rem' }}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </>
              )}

              <div style={{ marginTop: '1rem', fontWeight: 600 }}>
                🌗 Баланс дня: +{positives} / −{negatives} →{' '}
                {positives > negatives
                  ? '✅ Свет преобладает — ты прошёл испытание'
                  : '❌ Превалирует эго — день провален'}
                {badge && ` — ${badge}`}
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
