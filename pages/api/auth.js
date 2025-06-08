// pages/api/auth.js
//
// 🔐 Приём callback-запроса с Telegram Login Widget.
// ▸ Проверяем подпись hash.
// ▸ Обновляем / создаём запись в таблице citizens.
// ▸ Если Supabase не вернул id (редкий баг upsert-select) — делаем
//   повторный select по telegram_id.
// ▸ Ставим три cookie: tg (данные Telegram), cid (id гражданина),
//   last_auth (для истории входов). После этого отправляем 302 → /lk
// -------------------------------------------------------------------

import crypto from 'crypto'
import { serialize } from 'cookie'
import { supabase } from '../../lib/supabase'

const BOT_TOKEN = process.env.BOT_TOKEN            // задайте в Vercel → Env vars

export default async function handler (req, res) {
  try {
    // ───────────────────── 1. Отделяем hash и чистые поля Telegram ─────────────────────
    const { hash, ...tg } = req.query
    if (!hash || !tg.id) return res.status(400).send('Bad request')

    // ───────────────────── 2. Проверяем подпись Telegram ─────────────────────
    const checkString = Object
      .keys(tg)
      .sort()
      .map(k => `${k}=${tg[k]}`)
      .join('\n')

    const secret = crypto
      .createHash('sha256')
      .update(BOT_TOKEN)
      .digest()

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(checkString)
      .digest('hex')

    if (hmac !== hash) return res.status(403).send('Bad hash')

    // ───────────────────── 3. upsert в таблицу citizens ─────────────────────
    // Поля, которые хотим хранить/обновлять:
    const citizenRow = {
      telegram_id : tg.id,
      full_name   : `${tg.first_name ?? ''} ${tg.last_name ?? ''}`.trim(),
      username    : tg.username ?? null,
      photo_url   : tg.photo_url ?? null,
      last_auth   : new Date(Number(tg.auth_date)*1000).toISOString() // для статистики
    }

    // upsert + select id (иногда Supabase возвращает data === null на конфликте)
    let { data, error } = await supabase
      .from('citizens')
      .upsert(citizenRow, { onConflict:'telegram_id', merge:['full_name','username','photo_url','last_auth'] })
      .select('id')
      .maybeSingle()

    // если upsert не вернул строку (из-за onConflict) — берём id отдельным запросом
    if (!data) {
      const r = await supabase
        .from('citizens')
        .select('id')
        .eq('telegram_id', tg.id)
        .single()
      data  = r.data
      error = r.error
    }

    if (error || !data?.id) {
      console.error('[api/auth] Supabase error', error)
      return res.status(500).send('DB error')
    }

    // ───────────────────── 4. Ставим cookie и редиректим ─────────────────────
    const opts = { httpOnly:true, sameSite:'lax', secure:true, path:'/', maxAge:60*60*24*30 } // 30 дней
    res.setHeader('Set-Cookie', [
      // данные Telegram кодируем base64 → tg
      serialize('tg',  Buffer.from(JSON.stringify(tg)).toString('base64'), opts),
      // id гражданина → cid  (нужен, если потом захотите быстро получать данные)
      serialize('cid', data.id.toString(), opts),
      // last_auth не httpOnly, чтобы фронт мог показать дату последнего входа
      serialize('last_auth', tg.auth_date, { ...opts, httpOnly:false })
    ])

    return res.redirect(302, '/lk')

  } catch (e) {
    console.error('[api/auth] fatal', e)
    res.status(500).send(`Auth error: ${e.message}`)
  }
}
