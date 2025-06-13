// pages/api/challenge/start.js      v 1.3        
// Запускает челлендж для текущего пользователя.
// • авторизация — только через cookie cid (см. /api/auth)
// • если challenge_started_at уже стоит — НЕ перезаписывает
// • challenge_status → 'active'
// -------------------------------------------------------

import { parse }     from 'cookie';
import { supabase }  from '../../../lib/supabase.js';

export default async function handler(req, res) {
  /* ─ 1. METHOD ─────────────────────────────────────────── */
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'method-not-allowed' });

  /* ─ 2. AUTH ───────────────────────────────────────────── */
  const { cid } = parse(req.headers.cookie ?? '');
  if (!cid)
    return res.status(401).json({ ok:false, error:'not-auth' });

  /* ─ 3. UPDATE ───────────────────────────────────────────
     Обновляем в один вызов: COALESCE оставляет существующую дату,
     если она уже есть (чтобы не «сбросить» таймер случайным нажатием). */
  const { error } = await supabase
    .from('citizens')
    .update({
      challenge_started_at: supabase.rpc ? supabase.rpc('now') : new Date(),
      challenge_status    : 'active'
    }, { defaultToNull: false })           // коэрсируем undefined → NULL
    .eq('id', cid)
    .is('challenge_started_at', null);     // <-  only if NULL

  if (error)
    return res.status(500).json({ ok:false, error:error.message });

  res.json({ ok:true });
}
