import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  // Instead of throwing, log a warning for client-side hydration
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn('Missing Supabase credentials in environment variables');
  } else {
    throw new Error('Missing Supabase credentials in environment variables');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
