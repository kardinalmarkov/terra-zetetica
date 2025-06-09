// pages/dashboard.js
import { supabase } from '../lib/supabase';
import { parse }    from 'cookie';

const ADMINS = [1199933222];        // ← Ваши telegram-id

export async function getServerSideProps({req}){
  const { tg } = parse(req.headers.cookie||'');
  let uid = null;
  if (tg) { try{ uid = JSON.parse(Buffer.from(tg,'base64').toString()).id }catch{} }

  if (!ADMINS.includes(uid)) return { props:{allowed:false} };

  const { data:citizens } = await supabase
        .from('citizens')
        .select('id,full_name,username,status,challenge_status');

  const { data:answers }  = await supabase
        .from('last_answers');

  return { props:{ allowed:true, citizens, answers } };
}
