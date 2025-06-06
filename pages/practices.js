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
      'Пытался всё контролировать из страха',
      'Сопротивлялся происходящему',
      'Скрыл от себя правду',
      'Ранил словом или взглядом',
      'Навязал свою истину другим',
      'Боялся одиночества и сливался с толпой',
      'Пошёл на компромисс с совестью',
      'Проявил неблагодарность или уныние',
      'Презрел невежественных вместо сострадания'
    ],
    content: `
      <p><strong>Откровения Инсайдера</strong> раскрывают путь души, идущей через иллюзию разделённости, страха и контроля — но выбирающей Свет через внутреннее посвящение. Этот путь требует честности, смирения и понимания Закона Причины.</p>
      <p>Скачать текст книги:</p>
      <a href="/materials/docs/Откровения_инсайдера.pdf" target="_blank" rel="noopener noreferrer" style="color:#0066cc;font-weight:500">📥 Откровения Инсайдера (PDF)</a>
    `
  },
  presence: {
    title: '🌿 Практика Принятия и Наблюдения',
    description:
      'Вдохновлена учениями об Осознанности, дзен и Тишине. Суть — быть, наблюдать, принимать без суждений.',
    items: [
      'Остановился и сделал 3 глубоких вдоха',
      'Осознал, что чувствуешь прямо сейчас',
      'Наблюдал мысли без вовлечения',
      'Принял ситуацию без внутреннего сопротивления',
      'Сел в тишине на 5+ минут без телефона',
      'Смотрел на другого человека без оценки',
      'Был в моменте во время действия (еда, прогулка)',
      'Увидел красоту в обычном',
      'Принял себя в несовершенстве',
      'Был благодарен просто за бытие'
    ],
    negatives: [
      'Пропустил момент осознания',
      'Погрузился в негативную мысль',
      'Оценивал или критиковал',
      'Боролся с тем, что есть',
      'Не дал себе тишины и покоя',
      'Отвлёкся в моменте',
      'Отказался от принятия',
      'Закрылся от благодарности'
    ],
    content: `
      <p>Принятие — не пассивность, а внутренняя готовность жить без борьбы с тем, что есть. Эта практика углубляет контакт с Источником, растворяя ложное «я».</p>
    `
  }
};

export default function Practices() {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('practices_progress');
    if (saved) setCheckedItems(JSON.parse(saved));
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
    setCheckedItems({});
  };

  const count = (key) => {
    const positives = checkedItems[key]?.length || 0;
    const negatives = checkedItems[`${key}_neg`]?.length || 0;
    const total = checklistData[key].items.length;
    const score = positives - negatives;
    const percentage = Math.round((positives / total) * 100);
    let message = '';
    if (positives >= 9) message = '🥇 Проводник Света';
    else if (positives >= 6) message = '🥈 Служение в действии';
    else if (positives >= 3) message = '🥉 Доброе намерение';
    return { positives, negatives, score, percentage, message };
  };

  return (
    <>
      <Head>
        <title>Практики | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1>🌟 Практики внутреннего развития</h1>
        <p>Простые шаги на Пути Пробуждения, которые можно начать уже сегодня. Отмечайте, что удалось выполнить.</p>

        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer' }}>📘 Пояснение и легенда</summary>
          <ul style={{ marginTop: '0.5rem' }}>
            <li><strong>Чекбоксы:</strong> ставьте отметку за каждое выполненное действие.</li>
            <li><strong>Баланс дня:</strong> считается как разница между позитивными и негативными.</li>
            <li><strong>Медальки:</strong> 3+ ✅ — 🥉, 6+ — 🥈, 9+ — 🥇.</li>
            <li><strong>Процент выполнения:</strong> считается от общего количества.</li>
          </ul>
        </details>

        <button onClick={resetDay} style={{ margin: '1rem 0', background: '#eee', padding: '0.5rem 1rem', borderRadius: 6 }}>
          🔄 Сбросить отметки за день
        </button>

        {Object.entries(checklistData).map(([key, data]) => {
          const { positives, negatives, score, percentage, message } = count(key);
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
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                🎯 Пройдено: {percentage}% — {message}
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
