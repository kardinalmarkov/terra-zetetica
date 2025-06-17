// pages/api/challenge/beacon.js — batch flush from sendBeacon()
// -----------------------------------------------------------------------------
// URL: POST /api/challenge/beacon?cid=123
// body (text/plain, up to few kB): JSON.stringify([...payloads])
// payload item = { citizen_id, day_no, watched_at, note }

import { supabase } from '../../../lib/supabase';

export const config = { api: { bodyParser: false } }; // raw body

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).end('method-not-allowed');

  const cid = Number(req.query.cid);
  if (!cid) return res.status(400).end('missing-cid');

  try {
    const buf = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
    const arr = JSON.parse(buf.toString() || '[]');
    if (!Array.isArray(arr) || !arr.length) return res.status(200).end('noop');

    // enforce correct cid
    const rows = arr.map(r => ({ ...r, citizen_id: cid }));
    const { error } = await supabase
      .from('daily_progress')
      .upsert(rows, { onConflict: 'citizen_id,day_no' });
    if (error) throw error;
    return res.status(200).end('ok');
  } catch (e) {
    console.error('beacon error', e);
    return res.status(500).end('error');
  }
}
