// pages/api/feedback.js
import { parse } from 'cookie'
import { supabase } from '../../lib/supabase'
import fetch from 'node-fetch'          // ← добавлено


const TG_TOKEN = process.env.BOT_TOKEN
const ADMIN_ID = process.env.ADMIN_CHAT_ID  // chat_id администратора

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).end()
  const { cid } = parse(req.headers.cookie||'')
  const { text='' } = req.body
  if(!cid||!text.trim())return res.status(400).end()
  if(text.length>1000)   return res.status(400).json({error:'long'})

  const { error } = await supabase.from('feedback')
        .insert({ citizen_id:cid, text:text.trim() })
  if(error) return res.status(500).json({error:error.message})

  /* Telegram-push */
  try{
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ chat_id:ADMIN_ID,
        text:`🆕 feedback #${cid}\n${text.slice(0,950)}` })
    })
  }catch{ /* молча */ }

  res.json({ok:true})
}
