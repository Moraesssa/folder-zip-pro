
// Configuração do Supabase para ZipFast
// Este arquivo centraliza a configuração do Supabase

export const supabaseConfig = {
  // URLs e chaves do Supabase
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Configurações específicas do app
  tables: {
    profiles: 'profiles',
    compressionHistory: 'compression_history',
    subscriptions: 'subscriptions'
  },
  
  // Limites por plano
  plans: {
    free: {
      credits: 10,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      maxFiles: 5
    },
    pro: {
      credits: -1, // ilimitado
      maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
      maxFiles: -1 // ilimitado
    }
  },
  
  // Configurações de notificações
  notifications: {
    lowCreditsThreshold: 3,
    compressionSuccessTimeout: 4000,
    errorTimeout: 5000
  }
};

// Verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseConfig.url && supabaseConfig.anonKey);
};

// Mensagens de erro padronizadas
export const supabaseErrors = {
  notConfigured: 'Supabase não está configurado. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
  authRequired: 'Login necessário para esta operação.',
  insufficientCredits: 'Créditos insuficientes. Faça upgrade para PRO.',
  fileTooLarge: 'Arquivo muito grande para seu plano atual.',
  networkError: 'Erro de conexão. Tente novamente.'
};
