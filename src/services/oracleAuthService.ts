
import { oracleClient, OracleResponse, OracleSession } from '@/lib/oracleClient';

export const signUpUser = async (email: string, password: string, name: string): Promise<OracleResponse<OracleSession>> => {
  try {
    const response = await oracleClient.signUp(email, password, name);
    
    if (!response.success) {
      throw new Error(response.message || 'Erro no cadastro');
    }
    
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Erro no cadastro');
  }
};

export const signInUser = async (email: string, password: string): Promise<OracleResponse<OracleSession>> => {
  try {
    const response = await oracleClient.signIn(email, password);
    
    if (!response.success) {
      throw new Error(response.message || 'Erro no login');
    }
    
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Erro no login');
  }
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    const response = await oracleClient.signInWithGoogle();
    
    if (response.success && response.data?.redirect_url) {
      window.location.href = response.data.redirect_url;
    } else {
      throw new Error('Erro ao obter URL de redirecionamento do Google');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Erro no login com Google');
  }
};

export const signOutUser = async (): Promise<void> => {
  await oracleClient.signOut();
};

export const getCurrentSession = async () => {
  try {
    const response = await oracleClient.getCurrentSession();
    return response?.success ? response.data : null;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  // Oracle doesn't have real-time auth changes like Supabase
  // We'll use custom events and polling instead
  
  const handleAuthEvent = (event: CustomEvent) => {
    callback(event.type, event.detail);
  };

  const handleUnauthorized = () => {
    callback('SIGNED_OUT', null);
  };

  // Listen for custom auth events
  window.addEventListener('oracle:signed_in', handleAuthEvent as EventListener);
  window.addEventListener('oracle:signed_out', handleAuthEvent as EventListener);
  window.addEventListener('oracle:unauthorized', handleUnauthorized);

  // Check session periodically
  const sessionCheck = setInterval(async () => {
    const session = await getCurrentSession();
    if (session) {
      callback('TOKEN_REFRESHED', session);
    }
  }, 300000); // Check every 5 minutes

  return {
    unsubscribe: () => {
      window.removeEventListener('oracle:signed_in', handleAuthEvent as EventListener);
      window.removeEventListener('oracle:signed_out', handleAuthEvent as EventListener);
      window.removeEventListener('oracle:unauthorized', handleUnauthorized);
      clearInterval(sessionCheck);
    }
  };
};

// Helper to dispatch auth events
export const dispatchAuthEvent = (event: string, data?: any) => {
  window.dispatchEvent(new CustomEvent(`oracle:${event}`, { detail: data }));
};
