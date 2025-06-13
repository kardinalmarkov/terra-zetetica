// pages/api/challenge/start.js                           v2.0 • 19 Jun 2025
//
// POST /api/challenge/start
// • ставит challenge_started_at, если ещё пусто
// • переводит challenge_status → 'active'
//
// ⚠️   вызов делается из двух мест:
//      • кнопка «🚀 Начать челлендж» в /lk?tab=passport
//      • для «гостя» – та же кнопка после быстрой авторизации
//--------------------------------------------------------------------

import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler (req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  const { cid } = parse(req.headers.cookie ?? '')
  if (!cid)
    return res.status(401).json({ ok:false, error:'not-auth' })

  /*  ▸ Один UPDATE – однажды:  challenge_started_at IS NULL  */
  const { error } = await supabase
    .from('citizens')
    .update({
      challenge_started_at: new Date(),      // NOW() в Postgres-часах
      challenge_status    : 'active'
    })
    .eq('id', cid)
    .is('challenge_started_at', null)        // << гарантирует «once»

  if (error)
    return res.status(500).json({ ok:false, error:error.message })

  res.json({ ok:true })
}
