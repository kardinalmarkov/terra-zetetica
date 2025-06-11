// lib/notify.js
import fetch from 'node-fetch'
export const notify = txt =>
  fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ chat_id: process.env.ADMIN_CHAT, text: txt })
  })
