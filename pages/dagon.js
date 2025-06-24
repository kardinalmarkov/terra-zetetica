// pages/dagon.js
import {useState,useEffect} from 'react';
import Head                 from 'next/head';

export default function Dagon(){

  /* ---------------- state ---------------- */
  const [birth , setBirth ] = useState('');
  const [html  , setHtml  ] = useState('');
  const [error , setError ] = useState('');
  const [kbOpen, setKbOpen] = useState(false);

  /* ------------ helpers ------------- */
  const yearFromBirth = (b)=>+b.slice(4);

  async function handleSubmit(e){
    e.preventDefault();
    if(birth.length!==8){setError('Введите 8 цифр (ДДММГГГГ)');return;}

    /*  —- дата ≥ 2000 ?  —- */
    if(yearFromBirth(birth)>=2000){
      setHtml(`<p style="color:#c00;font-weight:600">
                ⚠️ С&nbsp;1&nbsp;января&nbsp;2000 метод расчёта меняется,
                поэтому результат может быть некорректен.</p>`);
      return;
    }

    try{
      setError('');
      const body=new URLSearchParams();body.append('birthdate',birth);
      const r=await fetch('https://bankrot.express/calculate4.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body});
      if(!r.ok) throw new Error('Сервер не отвечает');
      setHtml(await r.text());
      setKbOpen(false);                        // прячем клавиатуру
    }catch(e){setError(e.message);setHtml('');}
  }

  /* ----- подцепляем «Дополнительно» из PHP-ответа ------ */
  useEffect(()=>{
    if(!html) return;
    const btn  =[...document.querySelectorAll('.dagon-html button')]
                .find(b=>b.textContent.trim()==='Дополнительно');
    const info = document.getElementById('additionalInfo');
    if(btn && info){
      info.style.display='none';
      const t=()=>info.style.display=
               info.style.display==='none'?'block':'none';
      btn.addEventListener('click',t);
      return()=>btn.removeEventListener('click',t);
    }
  },[html]);

  /* ---------------- keyboard ---------------- */
  const digits=['1','2','3','4','5','6','7','8','9','0'];
  const addDigit = (d)=>{
    if(birth.length<8) setBirth(birth+d);
  };
  const clear   = ()=>setBirth('');
  const submit  = ()=>document.getElementById('dagonForm').dispatchEvent(
                    new Event('submit',{cancelable:true, bubbles:true}));

  /* ================= render ================ */
  return(
   <>
    <Head><title>Расчёт дагона • Terra Zetetica</title></Head>

    <main className="wrap">

      <h1>Расчёт дагона</h1>

      <form id="dagonForm" onSubmit={handleSubmit} className="form">
        <button type="button"
                className="vkBtn"
                onClick={()=>setKbOpen(!kbOpen)}>Введите</button>

        <input value={birth}
               onChange={e=>setBirth(e.target.value.replace(/\D/g,''))}
               maxLength={8}
               placeholder="ДДММГГГГ"
               className="input"/>

        <button className="btn">Рассчитать</button>
      </form>

      { kbOpen &&
        <div className="vkWrap">
          <table>
            {[[0,1,2],[3,4,5],[6,7,8],[9]].map((row,i)=>(
              <tr key={i}>{row.map(idx=>(
                <td key={idx} onClick={()=>addDigit(digits[idx])}>{digits[idx]}</td>
              ))}
              {i===3&&<>
                <td onClick={clear}>C</td>
                <td onClick={submit} colSpan={2}>Ввод</td>
              </>}
              </tr>
            ))}
          </table>
        </div>}

      {error && <p className="err">{error}</p>}

      <div className="dagon-html" dangerouslySetInnerHTML={{__html:html}}/>

      {/* collapsibles */}
      <details className="accord">
        <summary>Методика расчёта</summary>
        <p>1. Берём дату рождения… (полный текст методики как у Вас)</p>
      </details>

      <details className="accord">
        <summary>Правила использования</summary>
        <ol>
          <li>Не считать дагоны умерших.</li>
          <li>Не озвучивать расчёт… пока не разберётесь в трактовке.</li>
        </ol>
      </details>

    </main>

    {/* ============== STYLE ============== */}
    <style jsx>{`
      .wrap {max-width:960px;margin:40px auto;padding:0 16px;font:16px/1.45 Roboto,Arial,sans-serif}
      h1    {text-align:center;font-size:2rem;margin-bottom:24px}
      /* form */
      .form {display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px}
      .input{border:1px solid #bbb;border-radius:4px;padding:6px 10px;width:128px;text-align:center}
      .btn  {background:#0060e6;border:none;border-radius:4px;color:#fff;padding:6px 14px;cursor:pointer}
      .btn:hover{background:#004bbf}
      .vkBtn{border:2px solid #0060e6;background:#fff;border-radius:4px;padding:4px 10px;cursor:pointer}
      .vkBtn:hover{background:#e9f1ff}
      .err  {color:#c00;text-align:center;margin-bottom:16px}
      /* virtual kb */
      .vkWrap table{margin:0 auto;border-collapse:collapse}
      .vkWrap td{width:64px;height:64px;border:1px solid #000;text-align:center;
                 vertical-align:middle;font-size:1.4rem;cursor:pointer}
      .vkWrap td:hover{background:#f3f3f3}
      /* === контент из PHP === */
      .dagon-html{--accent:#0060e6;--good:#0a8400;--warn:#c00}
      /* первая таблица */
      .dagon-html table:first-of-type{border-collapse:collapse;margin:16px 0}
      .dagon-html table:first-of-type th,
      .dagon-html table:first-of-type td{border:1px solid #999;padding:4px 8px;font-size:.9rem}
      .dagon-html table:first-of-type tr:nth-child(1) th{background:#f7f7f7;font-weight:700}
      .dagon-html table:first-of-type tr:nth-child(2) td{background:#fffde6}
      .dagon-html table:first-of-type td:nth-child(3){color:var(--good);font-weight:700}
      /* квадрат Пифагора */
      .dagon-html .number-square{max-width:420px;border-collapse:collapse;margin:24px auto}
      .dagon-html .number-square td{padding:6px 4px;font-size:.8rem;text-align:center;border:1px solid #999}
      .dagon-html .number-square .number{font-weight:700;border-bottom:1px dashed rgba(0,0,0,.5)}
      .dagon-html .number-square .description{color:var(--good);font-size:.72rem}
      .dagon-html .number-square tr:nth-child(1) td,
      .dagon-html .number-square tr:nth-child(3) td,
      .dagon-html .number-square tr:nth-child(5) td{border-top:2px solid #000}
      .dagon-html .number-square tr:last-child td{border-bottom:2px solid #000}
      .dagon-html .number-square td:nth-child(1),
      .dagon-html .number-square td:nth-child(3){border-left:2px solid #000}
      .dagon-html .number-square td:nth-child(3){border-right:2px solid #000}
      /* кнопка "Дополнительно" */
      .dagon-html button{background:#00833e;color:#fff;border:none;
                         padding:4px 12px;border-radius:3px;cursor:pointer}
      .dagon-html button:hover{background:#06692f}
      /* accordions */
      .accord{margin:32px 0;border-top:1px solid #ccc;padding-top:8px}
      .accord summary{cursor:pointer;font-weight:600;color:#0060e6}
      .accord[open]{padding-bottom:12px}
    `}</style>
   </>
  );
}
