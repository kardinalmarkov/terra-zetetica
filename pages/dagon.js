// pages/dagon.js
import { useState } from 'react';
import Head from 'next/head';

export default function DagonPage() {
  const [birth, setBirth] = useState('');
  const [html , setHtml ] = useState('');
  const [err  , setErr  ] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    try{
      const fd = new URLSearchParams(); fd.append('birthdate',birth);
      const r  = await fetch('https://bankrot.express/calculate2.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: fd
      });
      if(!r.ok) throw 'Сервер недоступен';
      setHtml(await r.text()); setErr('');
    }catch(e){ setErr(e.toString()); setHtml(''); }
  }

  return (
    <>
      <Head><title>Расчёт дагона • Terra Zetetica</title></Head>

      <main className="wrap">
        <h1 className="page-title">Расчёт дагона</h1>

        <form onSubmit={handleSubmit} className="form">
          <input
            value={birth}
            onChange={e=>setBirth(e.target.value)}
            placeholder="ДДММГГГГ"
            maxLength={8}
            className="input"
          />
          <button className="btn">Рассчитать</button>
        </form>

        {err && <p className="error">{err}</p>}

        {/* HTML-фрагмент от PHP */}
        <div
          className="dagon-html"
          dangerouslySetInnerHTML={{__html: html}}
        />
      </main>

      {/* ---------- фирменные стили ---------- */}
      <style jsx>{`
        /* базовая обёртка */
        .wrap{max-width:960px;margin:48px auto;padding:0 16px;
              font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
        .page-title{text-align:center;margin-bottom:32px;
                    font-size:clamp(1.8rem,2.5vw,2.4rem);font-weight:700;}

        /* форма */
        .form{display:flex;gap:12px;justify-content:center;margin-bottom:24px;}
        .input{padding:6px 10px;font-size:1rem;border:1px solid #ccc;border-radius:4px;width:120px;}
        .btn{background:#0060e6;color:#fff;border:none;border-radius:4px;
             padding:6px 14px;font-weight:600;cursor:pointer;}
        .btn:hover{background:#004bbf}
        .error{color:#c00;margin:12px 0;text-align:center;}

        /* ---------- «унифицируем» HTML, который вернул PHP ---------- */
        .dagon-html{--accent:#0060e6;--good:#067b00;--warn:#c00;}
        /* заголовки и акценты, которые PHP пишет h3 / b / strong */
        .dagon-html h3,.dagon-html h2{margin:24px 0 12px;font-size:1.1rem;color:var(--accent);}
        .dagon-html b,.dagon-html strong{color:var(--accent);}
        /* таблица Е1-E6 */
        .dagon-html table{border-collapse:collapse;margin:16px 0;width:100%;max-width:640px;}
        .dagon-html th,.dagon-html td{border:1px solid #bbb;padding:4px 6px;font-size:.92rem;text-align:center;}
        .dagon-html th{background:#f5f5f5;font-weight:600;}
        /* подсветим колонку E2 зелёным, как было */
        .dagon-html td:nth-child(3){background:#e7ffe7;}
        /* «Квадрат Пифагора» — делаем внешние жирные; внутри — пунктир */
        .dagon-html .number-square td{border:1px solid #000;padding:5px 4px;}
        .dagon-html .number-square .number{font-weight:700;}
        .dagon-html .number-square .description{font-size:.8rem;color:var(--good);}
        .dagon-html .number-square td.number{border-bottom:1px dashed rgba(0,0,0,.4);}
        .dagon-html .number-square tr:nth-child(1) td,
        .dagon-html .number-square tr:nth-child(3) td,
        .dagon-html .number-square tr:nth-child(5) td,
        .dagon-html .number-square td:nth-child(1),
        .dagon-html .number-square td:nth-child(2){
          border-width:2px;        /* толстые границы */
        }
        /* ссылку "Дополнительно" (кнопка) красим под стиль */
        .dagon-html button{background:#00833e;color:#fff;border:none;border-radius:3px;padding:4px 10px;
                           cursor:pointer;font-size:.85rem;}
        .dagon-html button:hover{background:#06692f}

        /* уменьшение шрифта на мобильных */
        @media(max-width:600px){
          .input{width:100px}
          .dagon-html th,.dagon-html td{font-size:.82rem}
        }
      `}</style>
    </>
  );
}
