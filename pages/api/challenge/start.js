// pages/api/challenge/start.js               v1.2 • 20 Jun 2025
//
// POST — без тела; авторизация идёт по cookie
//
// • challenge_started_at ставится «один раз» (COALESCE)
// • статус переводится в active
//

import { parse }     from 'cookie'
import { supabase }  from '../../../lib/supabase'

export default async function handler (req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  /* 1. auth ----------------------------------------------------------- */
  const { cid } = parse(req.headers.cookie || '')
  if (!cid) return res.status(401).json({ ok:false, error:'not-auth' })

  /* 2. обновляем гражданина ------------------------------------------- */
  const { error } = await supabase
    .rpc(                       // используем RPC, чтобы писать “только если NULL”
      'challenge_start_once',   // → см. SQL-функцию ниже
      { p_cid: cid }
    )

  if (error)
    return res.status(500).json({ ok:false, error:error.message })

  res.json({ ok:true })
}

/*
SQL (добавьте один раз в Supabase → SQL Editor):

-- выполняет update, только если challenge_started_at ещё NULL
create or replace function public.challenge_start_once (p_cid bigint)
returns void
language plpgsql
as $$
begin
  update citizens
     set challenge_started_at = coalesce(challenge_started_at, now()),
         challenge_status     = 'active'
   where id = p_cid;
end; $$;
*/
