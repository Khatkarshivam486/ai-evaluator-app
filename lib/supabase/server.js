// /lib/supabase/server.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 1. Define the utility function
export const createClient = () => {
  // 2. Get the cookies store for the current request
  const cookieStore = cookies(); 

  // 3. Initialize the Supabase client
  return createServerClient(
    // 4. Project URL & Anon Key (from your .env.local file)
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // 5. Tell the Supabase client how to READ cookies (get)
        get: (name) => cookieStore.get(name)?.value,
        
        // 6. Tell the Supabase client how to WRITE cookies (set)
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        
        // 7. Tell the Supabase client how to REMOVE cookies (remove)
        remove: (name, options) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};