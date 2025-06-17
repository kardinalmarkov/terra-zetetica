// pages/api/challenge/mark.js версия 2.4
import { supabase } from '../../../lib/supabase';
import { parse }    from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok: false, error: 'method-not-allowed' });

  // --- авторизация ---------------------------------------------------------
  const cookies = parse(req.headers.cookie || '');
  const cidCookie = cookies.cid;
  const cidHeader = req.headers['x-cid'];
  const cid = cidCookie || cidHeader;
  if (!cid)
    return res.status(401).json({ ok: false, error: 'not-auth' });

  // --- параметры -----------------------------------------------------------
  const { day, note } = req.body || {};
  if (!day)
    return res.status(400).json({ ok: false, error: 'missing-day' });

  // --- идемпотентный upsert ------------------------------------------------
  const { error } = await supabase
    .from('daily_progress')
    .upsert(
      {
        citizen_id : Number(cid),
        day_no     : Number(day),
        watched_at : new Date().toISOString(),
        note
      },
      { onConflict: 'citizen_id,day_no' }   // <- не дублирует
    );

  if (error) {
    console.error('supabase error', error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true });
}
