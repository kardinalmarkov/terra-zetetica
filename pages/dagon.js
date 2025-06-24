/**********************************************************************
 *  pages/dagon.js
 *  (скопируйте как есть ─ на Vercel перезальётся одним файлом)
 *********************************************************************/

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Dagon() {
  /* ─────────── state ─────────── */
  const [html, setHtml]       = useState('');
  const [showKB, setShowKB]   = useState(false);
  const [showInfo, setInfo]   = useState(false);
  const inputRef              = useRef(null);

  /* ───────── helper ──────────── */
  const add = d => {
    if (!inputRef.current) return;
    if (inputRef.current.value.length < 8) {
      inputRef.current.value += d;
      if (inputRef.current.value.length === 8) setShowKB(false);
    }
  };
  const clear = () => inputRef.current && (inputRef.current.value = '');

  const calc = async () => {
    if (+inputRef.current.value.slice(-4) >= 2000) {
      alert('⚠️ Для дат 2000 г. и новее методика может потребовать корректировки.');
    }

    const val = inputRef.current?.value.trim();
    if (!/^\d{8}$/.test(val)) return alert('Введите дату ДДММГГГГ');
    try {
      const body = new URLSearchParams({ birthdate: val }).toString();
      const r    = await fetch(
        'https://bankrot.express/calculate4.php',
        { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body }
      );
      setHtml(await r.text());
    } catch (e) {
      console.error(e); alert('Ошибка соединения');
    }
  };

  /* ─────────── ui ────────────── */
  return (
    <>
      <Head><title>Расчёт дагона</title></Head>

      <main className="wrap">
        {!html && (
          <div className="notice">
            Он-лайн сервис автоматического расчёта дагонов создан в учебных
            целях. Введённые данные <b>не сохраняются</b> и не передаются
            третьим лицам.
          </div>
        )}

        <h1>Расчёт дагона</h1>

        <div className="form">
          <button className="btn"         onClick={()=>setShowKB(v=>!v)}>Введите</button>
          дату рождения (ДДММГГГГ):
          <input
            ref={inputRef}
            maxLength={8}
            placeholder="ДДММГГГГ"
            onKeyDown={e=>e.key==='Enter'&&calc()}
          />
          <button className="btn primary" onClick={calc}>Рассчитать</button>
        </div>


        {/* клавиатура */}
        {showKB && (
          <div className="kb">
            {['123','456','789','C0↵'].map(r=>(
              <div key={r} className="row">
                {r.split('').map(ch=>(
                  <button key={ch}
                          onClick={()=>{
                            if(ch==='C')   clear();
                            else if(ch==='↵') calc();
                            else            add(ch);
                          }}>
                    {ch==='↵' ? 'Ввод' : ch}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* результат PHP */}
        <div className="dagon"
             dangerouslySetInnerHTML={{__html:html}} />

        {/* инфо‐блок */}
        <button className="infoBtn" onClick={()=>setInfo(x=>!x)}>
          ❓ Информация
        </button>

        {showInfo && (
          <section className="info">

            <h2>Методика расчёта</h2>
            <ol>
              <li>
                Берём дату рождения (8 цифр) в формате <b>ДДММГГГГ</b><br/>
                (Если день рождения с 1 по 9 число, то Д1 = 0. Например: 9 мая 1991 года — Д1 = 0, Д2 = 9, ММ = 05, ГГГГ = 1991).
              </li>
              <li>
                <b>Е1</b> = сумма всех цифр даты рождения:<br/>
                Е1 = Д1 + Д2 + М + М + Г + Г + Г + Г
              </li>
              <li>
                <b>Е2</b> = сумма цифр в числе Е1
              </li>
              <li>
                <b>Е3</b> = Е1 – 2 × Д1
              </li>
              <li>
                <b>Е4</b> = сумма цифр Е3
              </li>
              <li>
                <b>Е5</b> = Е1 + Е3
              </li>
              <li>
                <b>Е6</b> = Е2 + Е4
              </li>
            </ol>

            <p>
              <b>Пример для даты рождения 28.10.1969</b><br/>
              Е0 = 2 8 1 0 1 9 6 9<br/>
              Е1 = 2 + 8 + 1 + 0 + 1 + 9 + 6 + 9 = <b>36</b><br/>
              Е2 = 3 + 6 = <b>9</b><br/>
              Е3 = 36 – 2 × 2 = <b>32</b><br/>
              Е4 = 3 + 2 = <b>5</b><br/>
              Е5 = 36 + 32 = <b>68</b><br/>
              Е6 = 9 + 5 = <b>14</b>
            </p>

            <p>
              Далее составляется строка из всех полученных значений: <br/>
              <code>291019693693256814</code><br/>
              Затем подсчитывается количество повторяющихся цифр и даётся их интерпретация по методике.
            </p>


            <h2>Правила использования</h2>
            <ul>
              <li>Не считать дагоны умерших.</li>
              <li>
                Не озвучивать результат, пока не разобрались в
                правильной трактовке, чтобы не «перепрограммировать» страхами.
              </li>
            </ul>

            <h2>Автор</h2>
            <figure className="author">
              <img src="https://optim.tildacdn.com/tild3664-3339-4666-a339-306564636534/-/format/webp/noroot.png.webp"
                   alt="Андрей Чуясов"/>
              <figcaption>
                Андрей Чуясов — создатель он-лайн сервиса по расчёту дагонов.
                <br/>
                <a href="https://t.me/omkar108" target="_blank">@omkar108</a>
              </figcaption>
            </figure>
          </section>
        )}

        {/* кредит */}
        <footer className="credit">
          <img src="https://optim.tildacdn.com/tild3731-3563-4365-a639-383933313662/-/resize/160x/-/format/webp/svet.png.webp"
               alt="Дмитрий Малышев"/>
          <p>
            Система расчётов получена в рамках базового курса
            «Живи Осознанно» (блок № 3, нумерология) Д.&nbsp;М.&nbsp;Малышева.
            Авторские курсы «Включите Свет!»&nbsp;—&nbsp;
            <a href="https://doctordi.ru" target="_blank" rel="noreferrer">
              doctordi.ru
            </a>
          </p>
        </footer>
      </main>

      {/* ───────── CSS in JS (перебивает глобальные) ───────── */}
      <style jsx>{`
        .wrap{max-width:900px;margin:auto;padding:24px}
        h1{text-align:center;margin:16px 0 28px}
        /* формы */
        .form{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
        input{width:150px;padding:6px 8px;font-size:16px}
        .btn{padding:6px 12px;font-size:16px;border:1px solid #444;cursor:pointer;border-radius:4px;background:#f3f3f3}
        .btn.primary{background:#005eff;color:#fff;border-color:#005eff}
        /* клавиатура */
        .kb{width:208px;margin:18px auto;display:grid;gap:4px}
        .row{display:flex}
        .row button{flex:1 1 0;border:1px solid #000;font-size:18px;padding:8px 0;cursor:pointer;background:#fff}
        /* уведомление */
        .notice{background:#fff9d3;border-left:4px solid #facc15;padding:12px 16px;margin-bottom:24px}
        /* блок результата */
        .dagon table{border-collapse:collapse;width:100%;margin:24px 0;font-size:15px}
        .dagon table:first-of-type{max-width:560px;margin:20px auto}
        .dagon th{background:#ececec;font-weight:700;text-align:center;padding:6px 4px}
        .dagon td{padding:6px 8px;text-align:center;border:1px solid #bbb}
        /* фон для первой таблицы */
        .dagon table:first-of-type td{background:#fffef2}
        /* E2 (3-й столбец) выделяем !important */

        .dagon table:first-of-type tr td:nth-child(3),
        .dagon table:first-of-type tr th:nth-child(3){
          color:#008000 !important;
          font-weight:700 !important;
          background:#f0fff4 !important;        /* лёгкий салатовый фон */
        }

        /* квадраты ниже ужимаем */
        .dagon table:not(:first-of-type){max-width:380px;margin:24px auto;font-size:15px}

        /* кнопка «Рассчитать» крупнее / мягче */
        .btn.primary.big{
          padding:10px 26px;
          font-size:18px;
          background:#2563eb;      /* indigo-600 */
          border-color:#2563eb;
        }
        .btn.primary.big:hover{background:#1e40af;border-color:#1e40af}

        /* info */
        .infoBtn{display:block;margin:32px auto 16px;background:#f2f2f2;border:1px solid #333;padding:6px 18px;cursor:pointer;font-size:16px}
        .info{max-width:780px;margin:0 auto 48px;font-size:16px;line-height:1.55}
        .info h2{margin:24px 0 10px;font-size:20px}
        .author{display:flex;align-items:center;gap:14px;margin-top:16px}
        .author img{width:80px;border-radius:8px}
        .author a{color:#0b5cd9;text-decoration:none}
        /* кредит */
        .credit{display:flex;align-items:center;gap:16px;flex-wrap:wrap;font-size:14px;color:#555;margin:48px 0 96px}
        .credit img{width:80px;border-radius:8px}
        .credit a{color:#0b5cd9}
      `}</style>
    </>
  );
}
