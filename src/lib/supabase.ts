
import { createClient } from '@supabase/supabase-js';
import { configService } from '@/services/configService';

// Log configuration status on startup
configService.logConfigurationStatus();

const supabaseConfig = configService.getSupabaseConfig();

// Create client only if properly configured
export const supabase = supabaseConfig 
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

// Export configuration status for components to use
export const isSupabaseConfigured = configService.isSupabaseEnabled();
export const getConfigValidation = () => configService.getValidationResult();
