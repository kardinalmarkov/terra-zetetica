// lib/supabase.js версия 2.0
import { createClient } from '@supabase/supabase-js';
import { getCid }     from '../utils/localAuth';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SB_URL, SB_KEY, {
  auth:   { persistSession: false },
  global: { headers: { 'x-cid': getCid() } }   // <- 🔑
});
