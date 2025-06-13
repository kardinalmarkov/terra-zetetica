// pages/api/challenge/start.js 1.4
import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase.js'

export default async function handler (req, res) {
  /* 1. метод ----------------------------------------------------------- */
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  /* 2. куки ------------------------------------------------------------ */
  const { cid } = parse(req.headers.cookie ?? '')
  if (!cid)
    return res.status(401).json({ ok:false, error:'not-auth' })

  /* 3. «одиночное» обновление ----------------------------------------- *
     UPDATE citizens
        SET challenge_started_at = NOW(),
            challenge_status     = 'active'
      WHERE id                   = :cid
        AND challenge_started_at IS NULL;                               */
  const { error } = await supabase
    .from('citizens')
    .update({
      challenge_started_at: new Date(),
      challenge_status    : 'active'
    })
    .eq('id', cid)
    .is('challenge_started_at', null)       // ← важный фильтр

  if (error)
    return res.status(500).json({ ok:false, error:error.message })

  res.json({ ok:true })
}
