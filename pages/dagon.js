/**********************************************************************
 *  pages/dagon.js
 *  ───────────────────────────────────────────────────────────────────
 *  • Запрос на расчёт остаётся через https://bankrot.express/calculate4.php
 *  • На странице:
 *      – Красивая таблица (E-значения) со светлым фоном, зелёным E2
 *      – Виртуальная клавиатура (меньше)
 *      – Кнопка ❓ Информация – раскрывает методику + правила
 *      – Всегда внизу блок-кредиты с фото Дмитрия Малышева
 *********************************************************************/

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Dagon() {
  const [html, setHtml]     = useState('');
  const [showVK, setVK]     = useState(false);
  const [showInfo, setInfo] = useState(false);
  const inputRef = useRef(null);

  /* ─── helpers ──────────────────────────────────────────────────── */

  const addDigit = d => {
    if (!inputRef.current) return;
    if (inputRef.current.value.length < 8) {
      inputRef.current.value += d;
      if (inputRef.current.value.length === 8) setVK(false);
    }
  };

  const clearInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const calculate = async () => {
    const val = inputRef.current?.value.trim();
    if (!/^\d{8}$/.test(val)) {
      alert('Введите дату в формате ДДММГГГГ');
      return;
    }
    try {
      const body = new URLSearchParams({ birthdate: val }).toString();
      const res  = await fetch(
        'https://bankrot.express/calculate4.php',
        { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body }
      );
      setHtml(await res.text());
      setVK(false);
    } catch (e) {
      console.error(e);
      alert('Ошибка при обращении к серверу');
    }
  };

  /* ─── JSX ──────────────────────────────────────────────────────── */

  return (
    <>
      <Head>
        <title>Расчёт дагона</title>
      </Head>

      <main className="wrap">
        {/* однократное уведомление  */}
        {!html && (
          <div className="notice">
            Он-лайн сервис автоматического расчёта дагонов создан в учебных
            целях. Введённые данные <b>не сохраняются</b> и не передаются
            третьим лицам.
          </div>
        )}

        <h1>Расчёт дагона</h1>

        <div className="form">
          <button onClick={()=>setVK(v=>!v)} className="btn">
            Введите
          </button>

          <input
            ref={inputRef}
            type="text"
            maxLength={8}
            placeholder="ДДММГГГГ"
          />

          <button onClick={calculate} className="btn primary">
            Рассчитать
          </button>
        </div>

        {/* ───── virtual keyboard ───── */}
        {showVK && (
          <div className="vk">
            {[
              ['1','2','3'],
              ['4','5','6'],
              ['7','8','9'],
              ['C','0','Ввод'],
            ].map(row=>(
              <div key={row.join('')} className="vk-row">
                {row.map(cell=>(
                  <button
                    key={cell}
                    className="vk-btn"
                    onClick={()=>{
                      if(cell==='C')      clearInput();
                      else if(cell==='Ввод') calculate();
                      else               addDigit(cell);
                    }}
                  >{cell}</button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ───── результат PHP ───── */}
        <div
          className="dagon-html"
          dangerouslySetInnerHTML={{__html:html}}
        />

        {/* ───── collapsible info ───── */}
        <button className="infoToggle" onClick={()=>setInfo(v=>!v)}>
          ❓ Информация
        </button>

        {showInfo && (
          <section className="info">
            <h2>Методика расчёта</h2>
            <ol>
              <li>Берём дату рождения (8 цифр) ДДММГГГГ. (Д1 = 0, если день &lt; 10).</li>
              <li>E1 = сумма всех цифр даты.</li>
              <li>E2 = сумма цифр E1.</li>
              <li>E3 = E1 – 2 × Д1.</li>
              <li>E4 = сумма цифр E3.</li>
              <li>E5 = E1 + E3.</li>
              <li>E6 = E2 + E4.</li>
            </ol>
            <p><b>Пример (28 · 10 · 1969)</b>: E1 = 36 → E2 = 9 → E3 = 32 → E4 = 5 → E5 = 68 → E6 = 14.</p>

            <h2>Правила использования</h2>
            <ul>
              <li>Не считать дагоны умерших.</li>
              <li>Не озвучивать расчёт, пока не разобрались в трактовке.</li>
            </ul>
          </section>
        )}

        {/* ───── footer credit ───── */}
        <footer className="credit">
          <img src="https://optim.tildacdn.com/tild3731-3563-4365-a639-383933313662/-/resize/160x/-/format/webp/svet.png.webp" alt="Дмитрий Малышев"/>
          <p>
            Система расчётов получена в рамках базового курса
            <br/>«Живи Осознанно» (блок № 3, нумерология) Д.&nbsp;М.&nbsp;Малышева.
            <br/>
            Полные авторские курсы «Включите Свет!» — <a href="https://doctordi.ru" target="_blank">doctordi.ru</a>
          </p>
        </footer>
      </main>

      {/* ───── styles ───── */}
      <style jsx>{`
        /* layout */
        .wrap   {max-width:880px;margin:0 auto;padding:24px}
        h1      {text-align:center;margin:24px 0 32px}
        .form   {display:flex;flex-wrap:wrap;gap:12px;justify-content:center}

        /* buttons & inputs */
        .btn{padding:6px 12px;border:1px solid #444;background:#f3f3f3;cursor:pointer;font-size:16px}
        .btn.primary{background:#0066ff;color:#fff;border-color:#0066ff}
        input {width:150px;padding:6px 8px;font-size:16px}

        /* virtual keyboard */
        .vk      {display:grid;gap:4px;margin:16px auto;width:212px}
        .vk-row  {display:flex}
        .vk-btn  {flex:1 1 0%;padding:10px;font-size:18px;border:1px solid #000;cursor:pointer;background:#fff}

        /* notice */
        .notice{background:#fff6d6;padding:12px 16px;border-left:4px solid #f3b601;margin-bottom:24px}

        /* result HTML styling */
        .dagon-html table{
          border-collapse:collapse;width:100%;margin:24px 0
        }
        /* первая табличка */
        .dagon-html table:first-of-type{max-width:560px;margin:16px auto}
        .dagon-html table:first-of-type th{background:#ececec;font-weight:700;text-align:center}
        .dagon-html table:first-of-type td{background:#fffef2;text-align:center;padding:6px}
        /* подсветка колонки Е2 (3-й столбец) */
        .dagon-html table:first-of-type td:nth-child(3){color:#008000;font-weight:700}

        /* квадратные таблицы */
        .dagon-html table:not(:first-of-type){max-width:380px;margin:24px auto}
        .dagon-html td{border:1px solid #999;padding:6px 8px;text-align:center}

        /* info toggle */
        .infoToggle{display:block;margin:32px auto 16px;background:#f2f2f2;border:1px solid #333;padding:6px 18px;cursor:pointer;font-size:16px}
        .info {max-width:700px;margin:0 auto 48px;font-size:15px;line-height:1.4}

        /* footer credit */
        .credit{display:flex;align-items:center;gap:16px;margin:48px 0 96px;font-size:14px;color:#555}
        .credit img{width:80px;height:auto;border-radius:8px}
        .credit a{color:#0066ff;text-decoration:underline}
      `}</style>
    </>
  );
}
