// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

/**
 *  ▸ в браузере используем публичный anon-key
 *  ▸ на сервере (API-роуты, SSR) автоматически берём
 *    безопасный SUPABASE_SERVICE_KEY, если он есть
 */
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
const key  =
  typeof window === 'undefined'
    ? process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)
