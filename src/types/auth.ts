
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro';
  credits: number;
  maxFileSize: number;
}

export interface AuthContextType {
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
