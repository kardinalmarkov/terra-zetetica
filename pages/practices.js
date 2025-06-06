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
    title: '🌀 Практика Инсайдера',
    description:
      'Осознанное принятие своей роли в Игре. Без борьбы, без стремления к просветлению, но с глубокой честностью, молчанием и доверием к Пути.',
    items: [
      'Принимал свою роль без страха|Принять, что всё в жизни — твой выбор, даже если он не осознан. Без сопротивления.',
      'Не обвинял никого — воспринимал как урок|Понимание, что никто не виноват. Всё — отражения и обучение.',
      'Сохранял молчание, когда мог осудить|Молчание — щит от реакции. Это акт силы, а не слабости.',
      'Сознавал ответственность за свой выбор|Каждая мысль, слово, действие — отражает твою зрелость.',
      'Не искал виноватых, спасителей или «виновных систем»|Освобождение приходит только изнутри, а не извне.',
      'Служил миру, не ради просветления|Истинное служение не требует наград, даже духовных.',
      'Видел в «тёмных» силах инструмент роста|Даже «тьма» направляет на Свет, если смотреть глубже.',
      'Проживал одиночество как часть Пути|Одиночество — это очищение. Оно нужно, чтобы услышать Источник.',
      'Не боролся с реальностью — доверял происходящему|Доверие к Игре вместо контроля и жалоб.'
    ],
    content: `
      <p><strong>Суть практики:</strong> это путь без сопротивления. Всё, что приходит — заслужено. Твоя роль выбрана заранее, и честность перед собой — ключ к выходу из Игры.</p>
      <p style="margin-top: 1rem; font-size: 0.85em;">
        <a href="/materials/docs/Откровения_инсайдера.pdf" target="_blank" rel="noopener noreferrer" style="color:#3366cc;">
          📘 PDF-текст «Откровения Инсайдера»
        </a>
      </p>
    `
  }
};

export default function Practices() {
  const [checkedItems, setCheckedItems] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const saved = localStorage.getItem('practices_progress');
    if (saved) setCheckedItems(JSON.parse(saved));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('practices_progress', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggle = (key, index, isNegative = false) => {
    const storageKey = isNegative ? `${key}_neg` : key;
    setCheckedItems(prev => {
      const section = prev[storageKey] || [];
      return {
        ...prev,
        [storageKey]: section.includes(index)
          ? section.filter(i => i !== index)
          : [...section, index]
      };
    });
  };

  const resetDay = () => {
    setCheckedItems({});
  };

  const countPosNeg = key => {
    const posCount = (checkedItems[key] || []).length;
    const negCount = (checkedItems[`${key}_neg`] || []).length;
    return { posCount, negCount };
  };

  return (
    <>
      <Head>
        <title>Практики | Terra Zetetica</title>
      </Head>

      <main className="wrapper" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <button
          onClick={resetDay}
          style={{ margin: '1rem 0', background: '#eee', padding: '0.5rem 1rem', borderRadius: 6 }}
        >
          🔄 Сбросить отметки за день
        </button>

        {Object.entries(checklistData).map(([key, data]) => {
          const { posCount, negCount } = countPosNeg(key);

          return (
            <div
              key={key}
              style={{ marginBottom: '3rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}
            >
              <h2>{data.title}</h2>
              <p>{data.description}</p>
              <div style={{ margin: '1rem 0' }} dangerouslySetInnerHTML={{ __html: data.content }} />

              {key === '51' && (
                <>
                  <h4>✅ Позитивные действия:</h4>
                  {data.items.map((item, i) => (
                    <label
                      key={i}
                      style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0', position: 'relative' }}
                    >
                      <input
                        type="checkbox"
                        checked={(checkedItems[key] || []).includes(i)}
                        onChange={() => toggle(key, i, false)}
                        style={{ marginRight: '0.75rem' }}
                      />
                      {item}
                    </label>
                  ))}

                  <h4 style={{ marginTop: '1.5rem' }}>⚠️ Негативные проявления:</h4>
                  {data.negatives.map((item, i) => (
                    <label
                      key={i}
                      style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0', position: 'relative' }}
                    >
                      <input
                        type="checkbox"
                        checked={(checkedItems[`${key}_neg`] || []).includes(i)}
                        onChange={() => toggle(key, i, true)}
                        style={{ marginRight: '0.75rem' }}
                      />
                      {item}
                    </label>
                  ))}

                  <div style={{ marginTop: '1rem', fontWeight: 600 }}>
                    🌗 Баланс дня: +{posCount} / −{negCount} →{' '}
                    {posCount > negCount
                      ? '✅ Свет преобладает — ты прошёл испытание'
                      : '❌ Превалирует эго — день провален'}
                  </div>
                </>
              )}

              {key !== '51' && (
                <>
                  {data.items.map((item, i) => {
                    const [label, tooltip] = item.split('|');
                    return (
                      <label
                        key={i}
                        style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0', position: 'relative' }}
                      >
                        <input
                          type="checkbox"
                          checked={(checkedItems[key] || []).includes(i)}
                          onChange={() => toggle(key, i, false)}
                          style={{ marginRight: '0.75rem' }}
                        />
                        {label}
                        {tooltip && (
                          isMobile ? (
                            <details style={{ marginLeft: '0.5rem', fontSize: '0.9em', color: '#666' }}>
                              <summary style={{ cursor: 'pointer' }}>ⓘ</summary>
                              <div style={{ paddingTop: '0.2rem' }}>{tooltip}</div>
                            </details>
                          ) : (
                            <span
                              style={{ marginLeft: '0.5rem', color: '#888', cursor: 'help', fontSize: '0.9em' }}
                              title={tooltip}
                            >
                              ⓘ
                            </span>
                          )
                        )}
                      </label>
                    );
                  })}

                  <div style={{ marginTop: '1rem', fontWeight: 600 }}>
                    ✅ Отмечено пунктов: {posCount} / {data.items.length}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </main>
    </>
  );
}
