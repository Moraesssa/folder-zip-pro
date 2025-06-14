
import { supabase } from '@/lib/supabase';

export const signUpUser = async (email: string, password: string, name: string) => {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name
      }
    }
  });

  if (error) throw error;
  return data;
};

export const signInUser = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
};

export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
};

export const signOutUser = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const getCurrentSession = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!supabase) return { unsubscribe: () => {} };
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
};
