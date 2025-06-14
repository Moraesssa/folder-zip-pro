
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro';
  credits: number;
  maxFileSize: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  consumeCredits: (amount: number) => Promise<boolean>;
  checkSubscription: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
}

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        setIsLoading(false);
        return;
      }

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        avatar: profile.avatar_url,
        plan: profile.plan,
        credits: profile.credits,
        maxFileSize: profile.max_file_size
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!supabase) {
      toast({
        title: "Configuração necessária",
        description: "Supabase não está configurado. Configure as variáveis de ambiente.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
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
    if (!supabase) {
      toast({
        title: "Configuração necessária",
        description: "Supabase não está configurado. Configure as variáveis de ambiente.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Profile will be loaded by the auth state change listener
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
    if (!supabase) {
      toast({
        title: "Configuração necessária",
        description: "Supabase não está configurado. Configure as variáveis de ambiente.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
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
    if (!supabase) return;
    
    await supabase.auth.signOut();
    setUser(null);
  };

  const consumeCredits = async (amount: number): Promise<boolean> => {
    if (!supabase || !user || user.credits < amount) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: user.credits - amount })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, credits: prev.credits - amount } : null);
      return true;
    } catch (error) {
      console.error('Error consuming credits:', error);
      return false;
    }
  };

  const refreshUserData = async () => {
    if (!supabase || !user) return;

    try {
      await loadUserProfile(user.id);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const checkSubscription = async () => {
    if (!supabase || !user) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;

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
