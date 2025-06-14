
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, AuthContextType } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { loadUserProfile, updateUserCredits } from '@/services/userProfileService';
import { 
  signUpUser, 
  signInUser, 
  signInWithGoogle, 
  signOutUser,
  getCurrentSession,
  onAuthStateChange
} from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // If Supabase is not configured, just set loading to false
    if (!supabase) {
      console.warn('Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      setIsLoading(false);
      return;
    }

    // Get initial session
    getCurrentSession().then((session) => {
      if (session?.user) {
        handleUserLoad(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const subscription = onAuthStateChange((event, session) => {
      if (session?.user) {
        handleUserLoad(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserLoad = async (userId: string) => {
    try {
      const profile = await loadUserProfile(userId);
      setUser(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const data = await signUpUser(email, password, name);

      if (data.user && !data.session) {
        toast({
          title: "Verifique seu email",
          description: "Enviamos um link de confirmação para seu email.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInUser(email, password);
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Erro no login com Google",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const consumeCredits = async (amount: number): Promise<boolean> => {
    if (!user || user.credits < amount) {
      return false;
    }

    const newCredits = user.credits - amount;
    const success = await updateUserCredits(user.id, newCredits);
    
    if (success) {
      setUser(prev => prev ? { ...prev, credits: newCredits } : null);
    }
    
    return success;
  };

  const refreshUserData = async () => {
    if (!user) return;

    try {
      const profile = await loadUserProfile(user.id);
      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const checkSubscription = async () => {
    if (!supabase || !user) return;

    try {
      const session = await getCurrentSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;

      if (data) {
        setUser(prev => prev ? {
          ...prev,
          plan: data.plan,
          credits: data.credits,
          maxFileSize: data.maxFileSize
        } : null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      loginWithGoogle,
      logout,
      consumeCredits,
      checkSubscription,
      refreshUserData,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export supabase for backward compatibility
export { supabase };
