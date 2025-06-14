
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro';
  credits: number;
  maxFileSize: number; // em bytes
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  consumeCredits: (amount: number) => boolean;
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

  useEffect(() => {
    // Simular verificação de token no localStorage
    const savedUser = localStorage.getItem('zipfast_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      plan: 'free',
      credits: 10,
      maxFileSize: 500 * 1024 * 1024 // 500MB
    };
    
    setUser(mockUser);
    localStorage.setItem('zipfast_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    
    // Simular OAuth do Google
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '2',
      email: 'user@gmail.com',
      name: 'Usuário Google',
      avatar: 'https://via.placeholder.com/40',
      plan: 'free',
      credits: 10,
      maxFileSize: 500 * 1024 * 1024
    };
    
    setUser(mockUser);
    localStorage.setItem('zipfast_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zipfast_user');
  };

  const consumeCredits = (amount: number): boolean => {
    if (!user || user.credits < amount) {
      return false;
    }
    
    const updatedUser = { ...user, credits: user.credits - amount };
    setUser(updatedUser);
    localStorage.setItem('zipfast_user', JSON.stringify(updatedUser));
    return true;
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithGoogle,
      logout,
      consumeCredits,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
