//pages/dagon.js

import { useState } from 'react';
import Head from 'next/head';

export default function DagonRemote() {

  const [birth, setBirth] = useState('');
  const [html , setHtml ] = useState('');
  const [err  , setErr  ] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    try{
      const body = new URLSearchParams();
      body.append('birthdate', birth);

      const resp = await fetch(
        'https://bankrot.express/calculate2.php',
        { method:'POST',
          headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
          body }
      );
      if(!resp.ok) throw 'Сервер недоступен';

      const text = await resp.text();     // PHP отдаёт HTML-фрагмент
      setHtml(text); setErr('');
    }catch(e){ setErr(e.toString()); setHtml(''); }
  }

  return (
    <>
      <Head><title>Расчёт дагона</title></Head>

      <main style={{maxWidth:720,margin:'2rem auto',padding:'0 1rem'}}>
        <h1 style={{textAlign:'center'}}>Расчёт дагона</h1>

        <form onSubmit={handleSubmit} style={{marginBottom:'1rem'}}>
          <input
            value={birth}
            onChange={e=>setBirth(e.target.value)}
            placeholder="ДДММГГГГ"
            maxLength={8}
            style={{marginRight:8}}
          />
          <button>Рассчитать</button>
        </form>

        {err   && <p style={{color:'red'}}>{err}</p>}
        {/* Встраиваем HTML, который вернул PHP */}
        <div dangerouslySetInnerHTML={{__html: html}} />
      </main>
    </>
  );
}
