// pages/challenge.js
// ──────────────────────────────────────────────────────────────────────────────
import { useEffect, useState }  from 'react';
import { useRouter }            from 'next/router';
import Head                     from 'next/head';
import confetti                 from 'canvas-confetti';
import DayMaterial              from '../components/DayMaterial';
import useMe                    from '../utils/useMe';
import { parse }                from 'cookie';
import { supabase }             from '../lib/supabase';

// ──────────────────────────────────────────────────────────────────────────────
export async function getServerSideProps ({ req, query }) {
  const { cid } = parse(req.headers.cookie || '');
  if (!cid) return { redirect:{ destination:'/lk', permanent:false } };

  const day = Math.min(Math.max(+query.day || 1, 1), 14);

  const [{ data: material }, { data: prog }] = await Promise.all([
    supabase
      .from('daily_materials')
      .select('*')
      .eq('day_no', day)
      .single(),
    supabase
      .from('daily_progress')
      .select('notes')
      .match({ citizen_id: cid, day_no: day })
      .maybeSingle()
  ]);

  return {
    props:{
      dayNo   : day,
      material: material || {},
      watched : !!prog,
      notes   : prog?.notes || ''
    }
  };
}

// ──────────────────────────────────────────────────────────────────────────────
export default function ChallengePage ({ dayNo, material, watched, notes }) {
  const router                    = useRouter();
  const { data:{ citizen } = {} } = useMe();

  const [done , setDone ] = useState(watched);
  const [note , setNote ] = useState(notes);
  const [left , setLeft ] = useState(null);          // ms до открытия d+1

  /* таймер до открытия следующего дня */
  useEffect(()=>{
    if (dayNo === 14 || !material.unlock_at) return;
    const id = setInterval(()=>{
      setLeft(Math.max(0, new Date(material.unlock_at) - Date.now()));
    },1000);
    return ()=>clearInterval(id);
  },[material.unlock_at, dayNo]);

  /* конфетти при закрытии 14-го дня */
  useEffect(()=>{
    if (dayNo===14 && done) confetti({ particleCount:200, spread:80 });
  },[dayNo,done]);

  /* отправка отметки */
  async function mark () {
    const r = await fetch('/api/challenge/mark',{
      method :'POST',
      headers:{'Content-Type':'application/json'},
      body   : JSON.stringify({ dayNo: dayNo, notes: note })
    });
    const j = await r.json().catch(()=>({}));
    if (j.ok) {
      setDone(true);
    } else {
      alert('Ошибка: ' + (j.error || 'server'));
    }
  }

  // ─────────────────────────────────────────────────────────── UI
  return (
    <main style={{margin:'0 auto',maxWidth:900,padding:'1rem'}}>
      <Head><title>День {dayNo} • Terra Zetetica</title></Head>

      <DayMaterial material={material} />

      {/* прогресс-бар 14 зелёных/серых точек */}
      <ul className="dots">
        {Array.from({length:14}).map((_,i)=>(
          <li key={i}
              className={
                i <  dayNo-1          ? 'done' :
                i === dayNo-1 && done ? 'done' : 'todo'
              }/>
        ))}
      </ul>

      {/* таймер до завтра */}
      {left>0 && !done && (
        <p style={{color:'#888',margin:'8px 0 24px'}}>
          🔒 День {dayNo+1} откроется через&nbsp;
          {Math.floor(left/3600000)}&nbsp;ч&nbsp;
          {Math.floor(left/60000)%60}&nbsp;мин
        </p>
      )}

      {/* форма заметки + «Я изучил» */}
      {!done && (
        <>
          <h3 style={{marginTop:32}}>💾 Сохранить заметку</h3>
          <textarea
            rows={4}
            maxLength={1000}
            value={note}
            onChange={e=>setNote(e.target.value)}
            style={{width:'100%',marginBottom:12}}
          />
          <button className="btn primary" onClick={mark}>
            ✔️ Я осознанно изучил материал
          </button>
        </>
      )}

      {/* кнопка «Следующий день» */}
      {done && dayNo < 14 && left===0 && (
        <button
          className="btn secondary"
          onClick={()=>router.push(`/challenge?day=${dayNo+1}`)}
          style={{marginTop:24}}
        >➡️ День {dayNo+1}</button>
      )}

      <style jsx>{`
        .dots{display:flex;gap:6px;list-style:none;padding:0;margin:24px 0}
        .dots li{width:12px;height:12px;border-radius:50%;background:#ccc}
        .dots li.done{background:#28a745}
        .dots li.todo{background:#ccc}
      `}</style>
    </main>
  )
}
