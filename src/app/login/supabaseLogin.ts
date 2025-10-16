import { supabase } from '../../lib/supabase/supabaseClient';

export async function loginWithSupabase(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}
