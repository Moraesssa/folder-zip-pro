
// Configuração do Oracle para ZipFast
// Este arquivo centraliza a configuração do Oracle Database

export const oracleConfig = {
  // URLs e configurações do Oracle ORDS
  ordsUrl: import.meta.env.VITE_ORACLE_ORDS_URL || '',
  workspace: import.meta.env.VITE_ORACLE_WORKSPACE || 'zipfast',
  
  // Configurações específicas do app
  tables: {
    profiles: 'ZIPFAST_PROFILES',
    compressionHistory: 'ZIPFAST_COMPRESSION_LOG',
    subscriptions: 'ZIPFAST_SUBSCRIPTIONS'
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
  },
  
  // Configurações de API
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  }
};

// Verificar se Oracle está configurado
export const isOracleConfigured = () => {
  return !!(oracleConfig.ordsUrl && oracleConfig.workspace);
};

// Mensagens de erro padronizadas
export const oracleErrors = {
  notConfigured: 'Oracle não está configurado. Configure as variáveis VITE_ORACLE_ORDS_URL e VITE_ORACLE_WORKSPACE.',
  authRequired: 'Login necessário para esta operação.',
  insufficientCredits: 'Créditos insuficientes. Faça upgrade para PRO.',
  fileTooLarge: 'Arquivo muito grande para seu plano atual.',
  networkError: 'Erro de conexão. Tente novamente.',
  sessionExpired: 'Sessão expirada. Faça login novamente.',
  serverError: 'Erro interno do servidor. Tente novamente mais tarde.'
};

// Configurações de Oracle Database features
export const oracleFeatures = {
  // Oracle Machine Learning
  ml: {
    enabled: true,
    compressionPrediction: '/ml/predict-compression',
    usageAnalytics: '/ml/analyze-usage'
  },
  
  // Oracle Spatial (para analytics geográficos)
  spatial: {
    enabled: true,
    userLocation: '/spatial/user-location',
    compressionHeatmap: '/spatial/compression-heatmap'
  },
  
  // Oracle Advanced Queuing (para notificações)
  aq: {
    enabled: true,
    notifications: '/aq/notifications',
    alerts: '/aq/alerts'
  },
  
  // Oracle Blockchain (para auditoria)
  blockchain: {
    enabled: false, // Será habilitado em produção
    auditTrail: '/blockchain/audit',
    integrity: '/blockchain/verify'
  }
};
