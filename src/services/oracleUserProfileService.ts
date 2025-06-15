
import { oracleClient, OracleUser } from '@/lib/oracleClient';
import { User } from '@/types/auth';

export const loadUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const response = await oracleClient.getUserProfile(userId);
    
    if (!response.success || !response.data) {
      return null;
    }

    const profile = response.data;
    
    return {
      id: profile.user_id,
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
  try {
    const response = await oracleClient.updateUserCredits(userId, newCredits);
    return response.success;
  } catch (error) {
    console.error('Error updating credits:', error);
    return false;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<boolean> => {
  try {
    const oracleUpdates: Partial<OracleUser> = {
      name: updates.name,
      avatar_url: updates.avatar,
      plan: updates.plan,
      credits: updates.credits,
      max_file_size: updates.maxFileSize
    };
    
    const response = await oracleClient.updateUserProfile(userId, oracleUpdates);
    return response.success;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
