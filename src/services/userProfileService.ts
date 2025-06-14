
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';

export const loadUserProfile = async (userId: string): Promise<User | null> => {
  if (!supabase) return null;
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatar: profile.avatar_url,
      plan: profile.plan,
      credits: profile.credits,
      maxFileSize: profile.max_file_size
    };
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

export const updateUserCredits = async (userId: string, newCredits: number): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating credits:', error);
    return false;
  }
};
