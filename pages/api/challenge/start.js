// pages/api/challenge/start.js        v2.2 • 20 Jun 2025
//
// POST  /api/challenge/start
// ──────────────────────────────────────────────────────────
// • если citizen.challenge_started_at  = NULL ➜ ставим NOW()
// • challenge_status всегда → 'active'
//   (чтобы «жёлтая кнопка» больше не появлялась)
// • статус 'guest/valid' НЕ трогаем
//
import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler(req,res){
  if(req.method!=='POST')
    return res.status(405).json({ok:false,error:'method-not-allowed'})

  const { cid } = parse(req.headers.cookie??'')
  if(!cid)       return res.status(401).json({ok:false,error:'not-auth'})

  /* 1. если даты ещё нет — ставим её */
  const { error:e1 } = await supabase
    .from('citizens')
    .update({ challenge_started_at:new Date() })
    .eq('id',cid).is('challenge_started_at',null)
  if(e1 && e1.code!=='23505')                 // ignore «row not found»
    return res.status(500).json({ok:false,error:e1.message})

  /* 2. статус «active» ставим ВСЕГДА */
  const { error:e2 } = await supabase
    .from('citizens')
    .update({ challenge_status:'active' })
    .eq('id',cid).neq('challenge_status','active')
  if(e2) return res.status(500).json({ok:false,error:e2.message})

  res.json({ok:true})
}
