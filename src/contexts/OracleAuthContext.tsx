
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, AuthContextType } from '@/types/auth';
import { oracleClient } from '@/lib/oracleClient';
import { loadUserProfile, updateUserCredits } from '@/services/oracleUserProfileService';
import { 
  signUpUser, 
  signInUser, 
  signInWithGoogle, 
  signOutUser,
  getCurrentSession,
  onAuthStateChange,
  dispatchAuthEvent
} from '@/services/oracleAuthService';

const OracleAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useOracleAuth = () => {
  const context = useContext(OracleAuthContext);
  if (!context) {
    throw new Error('useOracleAuth must be used within an OracleAuthProvider');
  }
  return context;
};

export const OracleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Oracle is configured
    if (!oracleClient) {
      console.warn('Oracle client not configured. Please set VITE_ORACLE_ORDS_URL and VITE_ORACLE_WORKSPACE environment variables.');
      setIsLoading(false);
      return;
    }

    // Get initial session
    getCurrentSession().then((session) => {
      if (session) {
        handleUserLoad(session.user_id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const subscription = onAuthStateChange((event, session) => {
      console.log('Oracle auth state changed:', event, session);
      
      if (session?.user_id) {
        handleUserLoad(session.user_id);
      } else if (event === 'SIGNED_OUT' || event === 'oracle:unauthorized') {
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
      const response = await signUpUser(email, password, name);

      if (response.success) {
        if (response.data?.user) {
          // Auto login after successful registration
          await handleUserLoad(response.data.user.user_id);
          dispatchAuthEvent('signed_in', response.data);
          
          toast({
            title: "✅ Conta criada com sucesso!",
            description: "Bem-vindo ao ZipFast!",
          });
        } else {
          toast({
            title: "Verifique seu email",
            description: "Enviamos um link de confirmação para seu email.",
          });
        }
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
      const response = await signInUser(email, password);
      
      if (response.success && response.data?.user) {
        await handleUserLoad(response.data.user.user_id);
        dispatchAuthEvent('signed_in', response.data);
      }
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
      // Google login will redirect, so we don't handle the response here
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
    dispatchAuthEvent('signed_out');
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
    if (!oracleClient || !user) return;

    try {
      const response = await oracleClient.getSubscription(user.id);
      
      if (response.success && response.data) {
        setUser(prev => prev ? {
          ...prev,
          plan: response.data.plan,
          credits: response.data.credits,
          maxFileSize: response.data.maxFileSize
        } : null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <OracleAuthContext.Provider value={{
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
    </OracleAuthContext.Provider>
  );
};

// Export oracle client for backward compatibility
export { oracleClient };
