import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jlqmiihpuiawxuoygsiq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscW1paWhwdWlhd3h1b3lnc2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTcyNTcsImV4cCI6MjA2Njc5MzI1N30.M_cJEmooXqEKSJvMtw0vq7UgAAdBipirG9x5SpWfyZ0';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
