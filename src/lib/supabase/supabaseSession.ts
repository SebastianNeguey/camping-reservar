import { supabase } from './supabaseClient';
import { deleteCookie } from '../cookieSession';

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session, error };
}

export async function getUserProfile() {
  const { session } = await getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  if (error) return null;
  return data;
}

export async function updateUserProfile(updates: { username?: string; email?: string }) {
  const { session } = await getSession();
  if (!session) return { error: 'No session' };
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id)
    .select()
    .single();
  return { data, error };
}

export async function logoutSupabase() {
  await supabase.auth.signOut();
  deleteCookie('supabase_token');
}
