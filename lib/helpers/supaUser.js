// lib/helpers/supaUser.ts возвращает { user, cid, citizen? }
import { parse } from 'cookie'
import { supabase } from './supabase'

export async function getAuth(ctx) {
  const { tg = '', cid = '' } = parse(ctx.req.headers.cookie ?? '')
  const user = tg ? JSON.parse(Buffer.from(tg, 'base64').toString()) : null
  const citizen = cid
    ? (await supabase.from('citizens').select('*').eq('id', cid).single()).data
    : null
  return { user, cid: cid ? Number(cid) : null, citizen }
}
