import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xdannmjpkhwcjjpwomrm.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkYW5ubWpwa2h3Y2pqcHdvbXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTg4NzQsImV4cCI6MjA2MzkzNDg3NH0.Pf4eKkIiHx305Q27YGvGXrBA7GMLkk2oFVKBbxEIquA";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);