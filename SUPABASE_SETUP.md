# Configuração do Supabase - ZipFast

## Informações do Projeto

- **Organização**: COAFA
- **Projeto**: zipzapzoom
- **URL**: https://zipzapzoom.supabase.co

## Configuração Inicial

### 1. Obter Credenciais

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Faça login na organização **COAFA**
3. Selecione o projeto **zipzapzoom**
4. Vá em **Settings > API**
5. Copie as seguintes informações:
   - **Project URL**: `https://zipzapzoom.supabase.co`
   - **Anon Key**: (chave pública para uso no frontend)

### 2. Configurar Variáveis de Ambiente

Atualize o arquivo `.env` com as credenciais reais:

```bash
VITE_SUPABASE_URL=https://zipzapzoom.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3. Estrutura do Banco de Dados

O projeto já possui as seguintes tabelas configuradas:

#### `profiles`
- Dados dos usuários (nome, email, plano, créditos)
- Criada automaticamente quando usuário se registra

#### `compression_history`
- Histórico de compressões realizadas
- Vinculada ao usuário via `user_id`

#### `subscriptions`
- Dados de assinatura e pagamentos
- Integração com Stripe

### 4. Políticas de Segurança (RLS)

Todas as tabelas possuem Row Level Security habilitado:
- Usuários só podem ver seus próprios dados
- Políticas automáticas de acesso baseadas em `auth.uid()`

### 5. Funcionalidades Configuradas

#### Autenticação
- ✅ Email/Senha
- ✅ Google OAuth (configurar client_id e secret)
- ✅ Registro automático de perfil

#### Armazenamento
- ✅ Bucket `compressed-files` para arquivos
- ✅ Limite de 50MB por arquivo

#### Triggers
- ✅ Criação automática de perfil no registro
- ✅ Atualização de timestamps

## Comandos Úteis

### Executar Migrações
```bash
npx supabase db push
```

### Resetar Banco Local
```bash
npx supabase db reset
```

### Ver Status
```bash
npx supabase status
```

### Iniciar Supabase Local
```bash
npx supabase start
```

## Testando a Configuração

1. Execute o projeto:
```bash
npm run dev
```

2. Verifique o console do navegador:
   - ✅ "Supabase: Conectado e configurado"
   - ❌ "Supabase: Desconectado - funcionando em modo offline"

3. Teste o registro de usuário
4. Teste a compressão de arquivos
5. Verifique o histórico no banco

## Troubleshooting

### Erro de Conexão
- Verifique se a URL está correta
- Confirme se a chave anônima é válida
- Teste a conexão no navegador: `https://zipzapzoom.supabase.co`

### Erro de Autenticação
- Verifique as configurações de Auth no painel
- Confirme se o email está habilitado
- Verifique as URLs de redirect

### Erro de Permissão
- Confirme se as políticas RLS estão ativas
- Verifique se o usuário está autenticado
- Teste com dados do próprio usuário

## Monitoramento

### Métricas Importantes
- Número de usuários ativos
- Compressões por dia
- Uso de armazenamento
- Taxa de conversão para PRO

### Logs
- Erros de autenticação
- Falhas de compressão
- Problemas de conectividade

## Backup e Segurança

### Backup Automático
- Supabase faz backup automático diário
- Retenção de 7 dias no plano gratuito

### Segurança
- RLS habilitado em todas as tabelas
- Chaves de API rotacionadas regularmente
- Monitoramento de acesso suspeito

## Contatos

- **Suporte Técnico**: suporte@zipfast.com
- **Administrador**: admin@coafa.org
- **Documentação**: https://supabase.com/docs