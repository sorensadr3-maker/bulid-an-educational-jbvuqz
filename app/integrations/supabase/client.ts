import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://qgryilvmolypnpndcqbe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncnlpbHZtb2x5cG5wbmRjcWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjAwNDAsImV4cCI6MjA3NzMzNjA0MH0.CL10BfFzzHcVWa8CFFYa7NNNsV4z9-bQq2QrC3Y0WXI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
