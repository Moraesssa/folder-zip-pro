#!/usr/bin/env node

/**
 * Script para configurar o Supabase no projeto ZipFast
 * Configura as credenciais e inicializa as tabelas necessárias
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do projeto Supabase
const SUPABASE_CONFIG = {
  projectRef: 'zipzapzoom',
  organization: 'COAFA',
  // Estas credenciais devem ser obtidas do painel do Supabase
  url: 'https://zipzapzoom.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcHphcHpvb20iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5MDAwMDAwMCwiZXhwIjoyMDA1NTU2MDAwfQ.example_key_here'
};

function createEnvFile() {
  const envContent = `# Configuração do Supabase - ZipFast
# Projeto: ${SUPABASE_CONFIG.projectRef}
# Organização: ${SUPABASE_CONFIG.organization}

VITE_SUPABASE_URL=${SUPABASE_CONFIG.url}
VITE_SUPABASE_ANON_KEY=${SUPABASE_CONFIG.anonKey}

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=false
VITE_ENABLE_TELEMETRY=true
VITE_ENABLE_ADVANCED_COMPRESSION=false
VITE_ENABLE_ERROR_REPORTING=true

# Configurações de Performance
VITE_BUNDLE_SIZE_LIMIT=400
VITE_LAZY_LOADING_ENABLED=true
VITE_MAX_FILE_SIZE_FREE=524288000
VITE_MAX_FILE_SIZE_PRO=5368709120

# Desenvolvimento
VITE_DEBUG_MODE=true
VITE_MOCK_SUPABASE=false
VITE_LOG_LEVEL=info
`;

  const envPath = path.join(__dirname, '../.env');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado com configurações do Supabase');
}

function validateSupabaseConnection() {
  console.log('🔍 Validando conexão com Supabase...');
  console.log(`📍 URL: ${SUPABASE_CONFIG.url}`);
  console.log(`🔑 Projeto: ${SUPABASE_CONFIG.projectRef}`);
  console.log(`🏢 Organização: ${SUPABASE_CONFIG.organization}`);

  // Aqui você pode adicionar validação real da conexão
  console.log('⚠️  ATENÇÃO: Verifique se as credenciais estão corretas no painel do Supabase');
}

function showNextSteps() {
  console.log('\n🚀 Próximos passos para configurar o Supabase:');
  console.log('');
  console.log('1. Acesse https://supabase.com/dashboard');
  console.log('2. Faça login na organização COAFA');
  console.log('3. Selecione o projeto zipzapzoom');
  console.log('4. Vá em Settings > API');
  console.log('5. Copie a URL do projeto e a chave anônima');
  console.log('6. Atualize o arquivo .env com as credenciais corretas');
  console.log('');
  console.log('7. Execute as migrações:');
  console.log('   npx supabase db push');
  console.log('');
  console.log('8. Teste a conexão:');
  console.log('   npm run dev');
  console.log('');
  console.log('📚 Documentação: https://supabase.com/docs/guides/getting-started');
}

function main() {
  console.log('🔧 Configurando Supabase para ZipFast...\n');

  try {
    createEnvFile();
    validateSupabaseConnection();
    showNextSteps();

    console.log('\n✅ Configuração inicial concluída!');
  } catch (error) {
    console.error('❌ Erro na configuração:', error.message);
    process.exit(1);
  }
}

// Executar se for o módulo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  SUPABASE_CONFIG,
  createEnvFile,
  validateSupabaseConnection
};