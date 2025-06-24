// pages/dagon.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function DagonPage () {

  const [birth, setBirth] = useState('');
  const [html , setHtml ] = useState('');
  const [err  , setErr  ] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    try{
      const body = new URLSearchParams(); body.append('birthdate',birth);

      const r = await fetch(
        'https://bankrot.express/calculate2.php',
        { method:'POST',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body }
      );
      if(!r.ok) throw 'Сервер недоступен';
      setHtml(await r.text()); setErr('');
    }catch(e){ setErr(e.toString()); setHtml(''); }
  }

  /* ----- навешиваем JS для «Дополнительно» каждый раз,
         когда пришёл новый HTML-фрагмент ----------------- */
  useEffect(()=>{
    if(!html) return;
    const btn = document.querySelector('.dagon-html button');
    const info= document.getElementById('additionalInfo');
    if(btn && info){
      const toggle = ()=> info.style.display =
          info.style.display==='none'?'block':'none';
      btn.addEventListener('click',toggle);
      return()=>btn.removeEventListener('click',toggle);
    }
  },[html]);

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

        {err  && <p className="error">{err}</p>}
        <div className="dagon-html" dangerouslySetInnerHTML={{__html:html}} />
      </main>

      <style jsx>{`
        .wrap{max-width:960px;margin:56px auto;padding:0 16px;
              font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
        .page-title{text-align:center;margin-bottom:32px;
                    font-size:clamp(1.8rem,2.4vw,2.4rem);font-weight:700;}

        /* форма */
        .form{display:flex;gap:12px;justify-content:center;margin-bottom:24px;}
        .input{padding:6px 10px;font-size:1rem;border:1px solid #ccc;border-radius:4px;width:120px;}
        .btn{background:#0060e6;color:#fff;border:none;border-radius:4px;
             padding:6px 14px;font-weight:600;cursor:pointer;}
        .btn:hover{background:#004bbf}
        .error{color:#c00;margin:12px 0;text-align:center;}

        /* ---------- стилизуем HTML от PHP ---------- */
        .dagon-html{--accent:#0060e6;--good:#067b00;--warn:#c00;}
        .dagon-html h2,.dagon-html h3{margin:24px 0 12px;font-size:1.1rem;color:var(--accent);}
        .dagon-html b,.dagon-html strong{color:var(--accent);}
        .dagon-html table{border-collapse:collapse;margin:16px auto;
                          width:100%;max-width:640px;}
        .dagon-html th,.dagon-html td{
            border:1px solid #bbb;padding:6px 8px;text-align:center;font-size:.92rem;}
        .dagon-html th{background:#f5f5f5;font-weight:600;}

        /*  квадрат Пифагора  */
        .dagon-html .number-square{margin:24px auto;border-collapse:collapse;}
        .dagon-html .number-square td{padding:6px 6px;text-align:center;}
        .dagon-html .number-square .number{
            font-weight:700;border-bottom:1px dashed rgba(0,0,0,.45);}
        .dagon-html .number-square .description{font-size:.8rem;color:var(--good);}

        /* толстые внешние */
        .dagon-html .number-square td:nth-child(1),
        .dagon-html .number-square td:nth-child(2){border-left:2px solid #000;}
        .dagon-html .number-square td:last-child{border-right:2px solid #000;}
        .dagon-html .number-square tr:nth-child(1) td,
        .dagon-html .number-square tr:nth-child(3) td,
        .dagon-html .number-square tr:nth-child(5) td{border-top:2px solid #000;}
        .dagon-html .number-square tr:last-child td{border-bottom:2px solid #000;}

        /* кнопка «Дополнительно» */
        .dagon-html button{background:#00833e;color:#fff;border:none;border-radius:3px;
                           padding:4px 10px;font-size:.85rem;cursor:pointer;}
        .dagon-html button:hover{background:#06692f}

        /* чтобы расшифровки не «обрезались» */
        .dagon-html p,.dagon-html div{overflow:visible;}

        @media(max-width:600px){
          .input{width:94px}
          .dagon-html th,.dagon-html td{font-size:.8rem}
        }
      `}</style>
    </>
  );
}
