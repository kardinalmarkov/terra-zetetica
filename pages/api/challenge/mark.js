// pages/api/challenge/mark.js
 import { parse } from 'cookie'
 import { supabase } from '../../../lib/supabase'

 export default async function handler(req, res) {
   if (req.method !== 'POST') return res.status(405).end()

   const { cid } = parse(req.headers.cookie || '')
   const { dayNo, notes = '' } = req.body
   if (!cid || !dayNo) return res.status(400).json({ ok:false, err:'bad-request' })

   /* 1️⃣ upsert прогресса */
   const { error: upErr } = await supabase
     .from('daily_progress')
     .upsert({
       citizen_id : cid,
       day_no     : dayNo,
       notes,
       watched_at : new Date()
     }, { onConflict:'citizen_id,day_no' })

   if (upErr) return res.status(500).json({ ok:false, err:upErr.message })

   /* 2️⃣ если челлендж ещё не активен — активируем */
   await supabase
     .from('citizens')
     .update({ challenge_status:'active' })
     .eq('id', cid)
     .eq('challenge_status', 'inactive')

   res.json({ ok:true })
 }
