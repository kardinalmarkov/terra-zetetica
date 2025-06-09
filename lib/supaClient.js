// lib/supaClient.js
import { createClient } from '@supabase/supabase-js'

export function supaWithCid (cid) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
                      process.env.SUPABASE_SERVICE_ROLE_KEY,   // ⚠️ безопасно только на сервере
                      { global: { headers:{ 'x-jwt-cid': cid } } })
}
