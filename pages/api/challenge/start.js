// pages/api/challenge/start.js                v2.1 • 20 Jun 2025
//
// POST /api/challenge/start
// ────────────────────────────────────────────────────────────────
// • ставит  challenge_started_at   ОДИН раз (если ещё NULL)
// • переводит challenge_status  →  'active'
// • НЕ трогает status гражданина (guest/valid) ‒ это решается вручную
//----------------------------------------------------------------

import { parse }    from 'cookie'
import { supabase } from '../../../lib/supabase'

export default async function handler (req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' })

  const { cid } = parse(req.headers.cookie ?? '')
  if (!cid)
    return res.status(401).json({ ok:false, error:'not-auth' })

  const { error } = await supabase
    .from('citizens')
    .update({
      // COALESCE(old, NOW())  – в Postgres сделать одной строчкой не можем,
      // поэтому условие .is('challenge_started_at', null)
      challenge_started_at: new Date(),
      challenge_status    : 'active'
    })
    .eq('id', cid)
    .is('challenge_started_at', null)   // <= гарантирует, что дата ставится «один раз»

  if (error)
    return res.status(500).json({ ok:false, error:error.message })

  res.json({ ok:true })
}
