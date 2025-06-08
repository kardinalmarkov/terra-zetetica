// pages/api/next-day.js
//
// ☑ фиксируем просмотр дневного материала
import { supabase } from '../../lib/supabase'
import { parse }    from 'cookie'

export default async function handler(req,res){
  const {tg,cid}=parse(req.headers.cookie||'');
  if(!tg||!cid) return res.status(401).json({error:'no auth'});

  /* какой «день» сегодня - тот же расчёт, что и на /dom */
  const dayNo = (Math.floor((Date.now() - Date.parse('2025-01-01'))/864e5)%14)+1;

  /* upsert отметку */
  const {error}=await supabase.from('daily_progress')
        .upsert({citizen_id:cid,day_no:dayNo},{onConflict:'citizen_id,day_no'});
  if(error) return res.status(500).json({error:error.message});

  /* если челлендж был «inactive» — переводим в active */
  await supabase.from('citizens')
        .update({challenge_status:'active'})
        .eq('id',cid).in('challenge_status',['inactive',null]);

  res.json({ok:true});
}
