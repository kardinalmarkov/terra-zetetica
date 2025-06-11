// pages/api/auth.js  (целиком замените)
import { supabase }  from '../../lib/supabase'
import jwt           from 'jsonwebtoken'
import { serialize } from 'cookie'

export default async function handler(req,res){
  const tg = req.query                       // id, first_name, username, ...
  if(!tg.id || !tg.hash) return res.status(400).send('bad tg')

  // 1) пробуем upsert
  const guest = {
    telegram_id : tg.id,
    username    : tg.username   || null,
    photo_url   : tg.photo_url  || null,
    full_name   : tg.first_name || '—',
    status      : 'guest',              // <- значение ТОЛЬКО для insert
    challenge_status:'inactive'
  }

  let { data: citizen, error } = await supabase
    .from('citizens')
    .upsert( guest,
    {
      onConflict      :'telegram_id',
      ignoreDuplicates:false,
      updateColumns   : ['username','photo_url','full_name'] // ← что можно обновлять
    })
    .select()
    .single()


  /* если sequence опять позади → ловим 23505 и читаем существующую строку */
  if(error && error.code==='23505'){
    const r = await supabase
      .from('citizens')
      .select('*')
      .eq('telegram_id',tg.id)
      .single()
    citizen = r.data
    error   = r.error
  }

  if(error || !citizen){
    console.error('SB upsert error',error)
    return res.status(500).send('db error')
  }

  // 2) jwt (если RLS)
  const token = jwt.sign(
    { sub: tg.id, cid: citizen.id },
    process.env.SUPABASE_JWT_SECRET,
    { expiresIn:'7d' }
  )

  // 3) куки
  res.setHeader('Set-Cookie',[
    serialize('tg',Buffer.from(JSON.stringify(tg)).toString('base64'),{path:'/',httpOnly:true,maxAge:31536000}),
    serialize('cid',String(citizen.id),{path:'/',httpOnly:true,maxAge:31536000}),
    serialize('sb_jwt',token,{path:'/',httpOnly:true,maxAge:60*60*24*7})
  ])

  res.writeHead(302,{Location:'/challenge?day=1'})
  res.end()
}
