interface ValidationResult {
  isValid: boolean;
  errors: ConfigError[];
  warnings: ConfigWarning[];
}

interface ConfigError {
  variable: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ConfigWarning {
  variable: string;
  message: string;
  suggestion?: string;
}

interface SupabaseConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

interface FeatureFlags {
  offlineMode: boolean;
  telemetry: boolean;
  advancedCompression: boolean;
  errorReporting: boolean;
}

interface AppConfig {
  supabase: SupabaseConfig;
  features: FeatureFlags;
  performance: {
    bundleSizeLimit: number;
    lazyLoadingEnabled: boolean;
    maxFileSizeFree: number;
    maxFileSizePro: number;
  };
  monitoring: {
    sentryDsn?: string;
    analyticsId?: string;
  };
  development: {
    debugMode: boolean;
    mockSupabase: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

class ConfigService {
  private config: AppConfig;
  private validationResult: ValidationResult;

  constructor() {
    this.config = this.loadConfig();
    this.validationResult = this.validateEnvironment();
  }

  private loadConfig(): AppConfig {
    return {
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || '',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        enabled: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
      },
      features: {
        offlineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
        telemetry: import.meta.env.VITE_ENABLE_TELEMETRY !== 'false',
        advancedCompression: import.meta.env.VITE_ENABLE_ADVANCED_COMPRESSION === 'true',
        errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false'
      },
      performance: {
        bundleSizeLimit: parseInt(import.meta.env.VITE_BUNDLE_SIZE_LIMIT || '400'),
        lazyLoadingEnabled: import.meta.env.VITE_LAZY_LOADING_ENABLED !== 'false',
        maxFileSizeFree: parseInt(import.meta.env.VITE_MAX_FILE_SIZE_FREE || '524288000'), // 500MB
        maxFileSizePro: parseInt(import.meta.env.VITE_MAX_FILE_SIZE_PRO || '5368709120') // 5GB
      },
      monitoring: {
        sentryDsn: import.meta.env.VITE_SENTRY_DSN,
        analyticsId: import.meta.env.VITE_ANALYTICS_ID
      },
      development: {
        debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
        mockSupabase: import.meta.env.VITE_MOCK_SUPABASE === 'true',
        logLevel: (import.meta.env.VITE_LOG_LEVEL as any) || 'info'
      }
    };
  }

  validateEnvironment(): ValidationResult {
    const errors: ConfigError[] = [];
    const warnings: ConfigWarning[] = [];

    // Validar configurações obrigatórias do Supabase
    if (!this.config.supabase.url) {
      errors.push({
        variable: 'VITE_SUPABASE_URL',
        message: 'URL do Supabase é obrigatória para funcionalidades de autenticação',
        severity: 'error'
      });
    }

    if (!this.config.supabase.anonKey) {
      errors.push({
        variable: 'VITE_SUPABASE_ANON_KEY',
        message: 'Chave anônima do Supabase é obrigatória para funcionalidades de autenticação',
        severity: 'error'
      });
    }

    // Validar configurações opcionais com warnings
    if (!this.config.monitoring.sentryDsn && this.config.features.errorReporting) {
      warnings.push({
        variable: 'VITE_SENTRY_DSN',
        message: 'DSN do Sentry não configurado - relatórios de erro serão limitados',
        suggestion: 'Configure o Sentry para melhor monitoramento de erros'
      });
    }

    if (!this.config.monitoring.analyticsId && this.config.features.telemetry) {
      warnings.push({
        variable: 'VITE_ANALYTICS_ID',
        message: 'ID do Analytics não configurado - métricas serão limitadas',
        suggestion: 'Configure Google Analytics ou similar para tracking'
      });
    }

    // Validar valores numéricos
    if (this.config.performance.bundleSizeLimit < 100 || this.config.performance.bundleSizeLimit > 1000) {
      warnings.push({
        variable: 'VITE_BUNDLE_SIZE_LIMIT',
        message: 'Limite de bundle fora do range recomendado (100-1000KB)',
        suggestion: 'Use valores entre 100 e 1000 para melhor performance'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  getConfig(): AppConfig {
    return this.config;
  }

  getSupabaseConfig(): SupabaseConfig | null {
    return this.config.supabase.enabled ? this.config.supabase : null;
  }

  isSupabaseEnabled(): boolean {
    return this.config.supabase.enabled;
  }

  getFeatureFlags(): FeatureFlags {
    return this.config.features;
  }

  getValidationResult(): ValidationResult {
    return this.validationResult;
  }

  generateEnvExample(): string {
    return `# Configuração do Supabase
# Obrigatório para funcionalidades de autenticação e banco de dados
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Feature Flags (Opcional)
VITE_ENABLE_OFFLINE_MODE=false
VITE_ENABLE_TELEMETRY=true
VITE_ENABLE_ADVANCED_COMPRESSION=false
VITE_ENABLE_ERROR_REPORTING=true

# Configurações de Performance (Opcional)
VITE_BUNDLE_SIZE_LIMIT=400
VITE_LAZY_LOADING_ENABLED=true
VITE_MAX_FILE_SIZE_FREE=524288000
VITE_MAX_FILE_SIZE_PRO=5368709120

# Monitoramento e Analytics (Opcional)
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_ANALYTICS_ID=your_analytics_id_here

# Configurações de Desenvolvimento (Opcional)
VITE_DEBUG_MODE=false
VITE_MOCK_SUPABASE=false
VITE_LOG_LEVEL=info`;
  }

  logConfigurationStatus(): void {
    const result = this.validationResult;
    
    if (result.isValid) {
      console.log('✅ Configuração válida - todas as variáveis obrigatórias estão definidas');
    } else {
      console.error('❌ Configuração inválida:');
      result.errors.forEach(error => {
        console.error(`  - ${error.variable}: ${error.message}`);
      });
    }

    if (result.warnings.length > 0) {
      console.warn('⚠️ Avisos de configuração:');
      result.warnings.forEach(warning => {
        console.warn(`  - ${warning.variable}: ${warning.message}`);
        if (warning.suggestion) {
          console.warn(`    Sugestão: ${warning.suggestion}`);
        }
      });
    }

    // Log do status do Supabase
    if (this.isSupabaseEnabled()) {
      console.log('🔗 Supabase: Conectado e configurado');
    } else {
      console.warn('🔌 Supabase: Desconectado - funcionando em modo offline');
    }
  }
}

// Singleton instance
export const configService = new ConfigService();
export default configService;