// pages/lk.js
//
// 🔒 Личный кабинет Terra Zetetica
// ───────────────────────────────────────────────────────────────
import Head              from 'next/head'
import { useEffect,useState } from 'react'
import { useRouter }     from 'next/router'
import { parse }         from 'cookie'
import { supabase }      from '../lib/supabase'
import Link              from 'next/link'

/* Простенькие вкладки */
function Tabs({tabs,active,onChange}){
  return(
    <nav style={{display:'flex',gap:12,marginBottom:'1.2rem'}}>
      {tabs.map(t=>(
        <button key={t.key}
                onClick={()=>onChange(t.key)}
                style={{
                  padding:'.45rem .9rem',
                  borderRadius:6,
                  border:active===t.key?'2px solid #6c63ff':'1px solid #ccc',
                  background:active===t.key?'#f7f7ff':'#fff',
                  cursor:'pointer'}}>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

/* Маленький «мигающий» индикатор */
const Spinner=()=>(
  <span style={{fontFamily:'monospace'}}>
    <span style={{animation:'blink 1s infinite'}}>.</span>
    <span style={{animation:'blink 1s .2s infinite'}}>.</span>
    <span style={{animation:'blink 1s .4s infinite'}}>.</span>
    <style jsx>{`@keyframes blink{0%,60%{opacity:0}100%{opacity:1}}`}</style>
  </span>
);

export default function LK({user}){
  const router          = useRouter();
  const [citizen,setCit]= useState();          // undefined = ждём
  const [progress,setPr]= useState(null);      // null = ждём
  const [tab,setTab]    = useState('profile');

  /* запрос расширенных данных */
  useEffect(()=>{
    if(!user) return;
    /* 1. строка citizens */
    supabase.from('citizens')
            .select('*')
            .eq('telegram_id',user.id)
            .maybeSingle()
            .then(({data,error})=>{
              if(error) console.error(error);
              setCit(data??null);
              /* 2. если челлендж активен — берём прогресс */
              if(data){
                supabase.from('daily_progress')
                        .select('day_no',{head:true,count:'exact'})
                        .eq('citizen_id',data.id)
                        .then(({count})=>setPr(count));
              }else setPr(0);
            });
  },[user]);

  /* выход */
  async function logout(){
    await fetch('/api/logout',{method:'POST'});
    router.replace('/');
  }

  /* красивые статусы */
  const statusTxt = !citizen             ? '✖ Гражданства нет'
                   : citizen.status==='valid' ? '✅ Гражданин Terra Zetetica'
                   : '❓ Заявка в обработке';

  /* 0. неавторизован → виджет Telegram */
  if(!user){
    return(
      <main style={{maxWidth:640,margin:'0 auto',padding:'2rem 1rem'}}>
        <h2>Авторизация</h2>
        <p>Войдите через Telegram:</p>
        <div dangerouslySetInnerHTML={{__html:`
<script async src="https://telegram.org/js/telegram-widget.js?15"
        data-telegram-login="ZeteticID_bot"
        data-size="large"
        data-userpic="true"
        data-lang="ru"
        data-request-access="write"
        data-auth-url="/api/auth"></script>`}}/>
      </main>
    )
  }

  /* 1. ждём ответов Supabase */
  if(citizen===undefined||progress===null){
    return <p style={{padding:'2.5rem'}}>Загрузка&nbsp;<Spinner/></p>
  }

  /* 2. кабинет */
  return(
    <>
      <Head><title>Личный кабинет • Terra Zetetica</title></Head>
      <main style={{maxWidth:820,margin:'0 auto',padding:'2rem 1rem',fontSize:'1.04rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
          <strong>Здравствуйте, {user.first_name} {user.last_name||''}! 🙌</strong>
          <button onClick={logout} style={{padding:'.35rem .9rem'}}>Выйти</button>
        </div>

        <Tabs active={tab} onChange={setTab} tabs={[
          {key:'profile',  label:'🙏 Профиль'},
          {key:'passport', label:'📜 Паспорт / 🏠 Челлендж'},
          {key:'progress', label:'📈 Прогресс'}
        ]}/>

        {/* ─ profile ─ */}
        {tab==='profile'&&(
          <section>
            <img src={user.photo_url} alt="avatar" width={120} height={120}
                 style={{borderRadius:8,objectFit:'cover'}}/>
            <p>ID Telegram: <b>{user.id}</b></p>
            {user.username&&<p>Telegram-ник: <b>@{user.username}</b></p>}
            <p>{citizen?'Запись найдена в БД ✔️':'В БД записи нет ❌'}</p>
            <p><b>Статус:</b> {statusTxt}</p>
          </section>
        )}

        {/* ─ passport/challenge ─ */}
        {tab==='passport'&&(
          <section>
            {citizen?(
              <>
                <p>Z-ID: <b>{citizen.zetetic_id||'—'}</b></p>
                <p>IPFS-паспорт: {citizen.ipfs_url
                  ?<a href={citizen.ipfs_url} target="_blank" rel="noopener">ссылка</a>:'—'}</p>
                <p>Статус челленджа: {citizen.challenge_status||'inactive'}</p>
                {citizen.challenge_status==='inactive'&&(
                  <Link href="/dom" style={{color:'#6c63ff'}}>Присоединиться к челленджу 🏠</Link>
                )}
              </>
            ):(
              <p>Сначала получите гражданство, чтобы начать челлендж.</p>
            )}
          </section>
        )}

        {/* ─ progress ─ */}
        {tab==='progress'&&(
          <section>
            {citizen && citizen.challenge_status!=='inactive'?(
              <>
                <p>Ваш прогресс: <b>{progress}</b>/14&nbsp;дн.</p>
                <div style={{height:12,width:'100%',background:'#eee',borderRadius:6}}>
                  <div style={{
                    height:'100%',borderRadius:6,background:'#6c63ff',
                    width:`${(progress/14)*100}%`,transition:'width .4s'}}/>
                </div>
              </>
            ):<p>Челлендж ещё не начат.</p>}
          </section>
        )}
      </main>
    </>
  )
}

/* ─ SSR: читаем куку tg ─ */
export async function getServerSideProps({req}){
  const {tg}=parse(req.headers.cookie||'');
  return{props:{user:tg?JSON.parse(Buffer.from(tg,'base64').toString()):null}}
}
