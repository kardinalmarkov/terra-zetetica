// pages/dagon.js
import { useState, useEffect } from 'react';
import Head                 from 'next/head';

export default function DagonPage () {

  /* ---------------- state ---------------- */
  const [birth, setBirth] = useState('');
  const [html , setHtml ] = useState('');
  const [err  , setErr  ] = useState('');

  /* ------------- form handler ------------ */
  async function handleSubmit(e){
    e.preventDefault();
    if(birth.length!==8 || isNaN(birth)) { setErr('Введите ДДММГГГГ'); return; }
    try{
      setErr('');
      const body=new URLSearchParams(); body.append('birthdate',birth);
      const r=await fetch('https://bankrot.express/calculate2.php',{
        method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
      if(!r.ok) throw new Error('Сервер недоступен');
      setHtml(await r.text());
    }catch(e){ setErr(e.message); setHtml(''); }
  }

  /* ---------- навешиваем toggle для «дополнительно» -------- */
  useEffect(()=>{
    if(!html) return;
    const btn  = document.querySelector('.dagon-html button');
    const info = document.getElementById('additionalInfo');
    if(btn && info){
      info.style.display='none';
      const t = ()=>info.style.display = info.style.display==='none'?'block':'none';
      btn.addEventListener('click',t);
      return()=>btn.removeEventListener('click',t);
    }
  },[html]);

  /* ================== markup ================== */
  return(
  <>
    <Head><title>Расчёт дагона • Terra Zetetica</title></Head>

    <main className="wrap">
      <h1 className="title">Расчёт дагона</h1>

      <form onSubmit={handleSubmit} className="form">
        <input  value={birth}
                onChange={e=>setBirth(e.target.value.replace(/\D/g,''))}
                maxLength={8} placeholder="ДДММГГГГ" className="input"/>
        <button className="btn">Рассчитать</button>
      </form>

      {err && <p className="err">{err}</p>}
      <div className="dagon-html" dangerouslySetInnerHTML={{__html:html}}/>
    </main>

    {/* ------------------------- STYLE -------------------------- */}
    <style jsx>{`
      .wrap {max-width:960px;margin:64px auto;padding:0 16px;}
      .title{font:700 clamp(1.8rem,2.4vw,2.4rem)/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
             text-align:center;margin-bottom:32px}
      .form {display:flex;gap:12px;justify-content:center;margin-bottom:24px}
      .input{padding:6px 10px;font-size:1rem;border:1px solid #ccc;border-radius:4px;width:118px}
      .btn  {background:#0060e6;color:#fff;border:none;border-radius:4px;
             padding:6px 14px;font-weight:600;cursor:pointer}
      .btn:hover{background:#004bbf}
      .err{color:#c00;text-align:center;margin-top:12px}
      /* ---------- HTML, полученный от PHP ---------- */
      .dagon-html{--accent:#0060e6;--good:#0a8400;--warn:#c00;font-size:16px}
      .dagon-html h2,.dagon-html h3{margin:24px 0 12px;font-size:1.05rem;color:var(--accent)}
      .dagon-html b,.dagon-html strong{color:var(--accent)}
      /* Е-таблица */
      .dagon-html table:first-of-type th,
      .dagon-html table:first-of-type td{border:1px solid #bcbcbc;padding:4px 6px;font-size:.9rem}
      /* подсвечиваем E2 */
      .dagon-html table:first-of-type td:nth-child(3){color:var(--good);font-weight:700}
      /* кнопка «Дополнительно» */
      .dagon-html button{background:#00833e;color:#fff;border:none;border-radius:3px;
                         padding:4px 10px;font-size:.85rem;cursor:pointer}
      .dagon-html button:hover{background:#06692f}
      /* квадрат Пифагора */
      .dagon-html .number-square{margin:32px auto;border-collapse:collapse}
      .dagon-html .number-square td{padding:6px;text-align:center;font-size:.9rem;border:1px solid #999}
      /* пунктир между цифрой и описанием */
      .dagon-html .number-square .number{font-weight:700;border-bottom:1px dashed rgba(0,0,0,.45)}
      .dagon-html .number-square .description{font-size:.78rem;color:var(--good)}
      /* толстые линии сетки (1-я 3-я 5-я горизонт, 1-й 3-й vert) */
      .dagon-html .number-square tr:nth-child(1) td,
      .dagon-html .number-square tr:nth-child(3) td,
      .dagon-html .number-square tr:nth-child(5) td{border-top:2px solid #000}
      .dagon-html .number-square tr:last-child td{border-bottom:2px solid #000}
      .dagon-html .number-square td:nth-child(1),
      .dagon-html .number-square td:nth-child(3){border-left:2px solid #000}
      .dagon-html .number-square td:nth-child(3){border-right:2px solid #000}
      /* всегда показываем текст-расшифровку */
      .dagon-html p,.dagon-html div{overflow:visible}

      @media(max-width:600px){
        .input{width:96px}
        .dagon-html table:first-of-type th,
        .dagon-html table:first-of-type td{font-size:.8rem}
      }
    `}</style>
  </>);
}
