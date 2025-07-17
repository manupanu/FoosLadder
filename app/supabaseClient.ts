import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// For build-time, use placeholder values to prevent build failures
const buildTimeUrl = supabaseUrl || "https://placeholder.supabase.co";
const buildTimeKey = supabaseAnonKey || "placeholder-key";

// Create client with placeholder values for builds, real values for runtime
export const supabase = createClient(buildTimeUrl, buildTimeKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== "https://placeholder.supabase.co" && 
    supabaseAnonKey !== "placeholder-key");
};
