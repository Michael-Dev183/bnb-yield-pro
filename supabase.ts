import { createClient } from '@supabase/supabase-js';

// Fix: Use process.env instead of import.meta.env to resolve "Property 'env' does not exist on type 'ImportMeta'" errors.
// process.env is provided by the define block in vite.config.ts.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://iyexiylmmevvvgymculq.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZXhpeWxtbWV2dnZneW1jdWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2Mjk1OTMsImV4cCI6MjA4NjIwNTU5M30.hdAeyeG-fYTe1SMPty8hL_aRSVWwt4GVx9uOLRj9hrQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
