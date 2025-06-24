// pages/dagon.js
import { useState, useRef } from 'react';
import Head from 'next/head';

/*
  ──────────────────────────────────────────────────────────────────────────
  1.  СТРАНИЦА ДАГОНА   (Next-JS / React)  –   единственный front-end файл
      – ничего больше на клиенте менять не нужно.
  2.  Бэкенд-расчёт остаётся прежним:      https://bankrot.express/calculate4.php
  3.  Все таблицы, которые приезжают из PHP, автоматически «поджимаются»
      с помощью CSS-правил ниже (calculate4.php трогать не придётся).
  ──────────────────────────────────────────────────────────────────────────
*/

export default function Dagon() {
  const [html, setHtml] = useState('');
  const [showVK, setShowVK] = useState(false);
  const inputRef = useRef(null);

  /* ─ helpers ─────────────────────────────────────────────────────────── */

  const addDigit = d => {
    if (!inputRef.current) return;
    if (inputRef.current.value.length < 8) {
      inputRef.current.value += d;
      if (inputRef.current.value.length === 8) setShowVK(false);
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
        { method: 'POST', headers: { 'Content-Type':'application/x-www-form-urlencoded' }, body }
      );
      setHtml(await res.text());
      setShowVK(false);
    } catch (e) {
      console.error(e);
      alert('Ошибка при обращении к серверу');
    }
  };

  /* ─ JSX ─────────────────────────────────────────────────────────────── */

  return (
    <>
      <Head>
        <title>Расчёт дагона</title>
      </Head>

      <main className="wrapper">
        <h1>Расчёт дагона</h1>

        <div className="form">
          <button className="openvk" onClick={() => setShowVK(v => !v)}>
            Введите
          </button>

          <input
            ref={inputRef}
            type="text"
            maxLength={8}
            placeholder="ДДММГГГГ"
          />

          <button onClick={calculate}>Рассчитать</button>
        </div>

        {/* virtual keyboard */}
        {showVK && (
          <div className="vkWrap">
            <table>
              <tbody>
                {[['1','2','3'],['4','5','6'],['7','8','9'],['C','0','Ввод']].map(r=>(
                  <tr key={r.join('')}>
                    {r.map(cell=>(
                      <td
                        key={cell}
                        onClick={()=>{
                          if(cell==='C') clearInput();
                          else if(cell==='Ввод') calculate();
                          else addDigit(cell);
                        }}
                      >{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HTML с расчёта PHP (safe – приходит от вашего сервера) */}
        <div
          className="dagon-html"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      {/* ─────────── STYLES ─────────── */}
      <style jsx>{`
        .wrapper{
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 16px 120px;
        }
        h1{ text-align:center;margin-bottom:24px }
        .form{
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          justify-content:center;
          margin-bottom:24px;
        }
        .form input{
          padding:6px 10px;
          font-size:16px;
          width:140px;
        }
        .form button{
          cursor:pointer;
          padding:6px 12px;
          font-size:16px;
          border:1px solid #111;
          background:#f3f3f3;
        }
        .openvk{
          font-weight:600;
        }

        /* ─ virtual keyboard compact ─ */
        .vkWrap           {max-width:240px;margin:12px auto}
        .vkWrap table     {width:100%;border-collapse:collapse}
        .vkWrap td        {width:33.33%;padding:10px 0;border:1px solid #000;
                           font-size:1.2rem;text-align:center;cursor:pointer;
                           user-select:none}

        .vkWrap tr:last-child td{font-size:.9rem}

        /* ─ к расчётному HTML ─ */
        .dagon-html table{
          border-collapse:collapse;
          width:100%;
          margin:16px 0;
        }
        /* первая (E1-E6) таблица ограничиваем ширину и подкрашиваем */
        .dagon-html table:first-of-type{
          max-width:560px;
          margin:24px auto 32px;
        }
        .dagon-html table:first-of-type th{
          background:#fafafa;
          font-weight:700;
        }
        .dagon-html table:first-of-type td{
          background:#fffef2;
        }

        /* все последующие квадраты-таблицы узкие */
        .dagon-html table:not(:first-of-type):not(.number-square){
          max-width:380px;
          margin:24px auto;
        }
        .dagon-html td{
          border:1px solid #999;
          padding:6px 8px;
          text-align:center;
        }
      `}</style>
    </>
  );
}
