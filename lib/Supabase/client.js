// /lib/supabase/client.js
import { createBrowserClient } from '@supabase/ssr';

// This client is used in any component marked 'use client'
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );