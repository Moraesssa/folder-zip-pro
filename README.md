# ZipFast - Compressor de Arquivos e Pastas

Aplicação React/TypeScript para compressão de arquivos e pastas com integração Supabase, Google Drive/Dropbox e funcionalidades premium.

## Project info

**URL**: https://lovable.dev/projects/733dbc52-0fb3-45d9-9693-07339ae4095c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/733dbc52-0fb3-45d9-9693-07339ae4095c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure environment variables (see Configuration section below)
cp .env.example .env
# Edit .env with your actual values

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Configuration

### Environment Variables

The application requires certain environment variables to function properly. Copy `.env.example` to `.env` and configure the following:

#### Required Variables
```bash
# Supabase Configuration (Required for authentication and database)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Optional Variables
```bash
# Feature Flags
VITE_ENABLE_OFFLINE_MODE=false          # Enable offline functionality
VITE_ENABLE_TELEMETRY=true              # Enable usage analytics
VITE_ENABLE_ADVANCED_COMPRESSION=false  # Enable advanced compression options
VITE_ENABLE_ERROR_REPORTING=true        # Enable error reporting

# Performance Settings
VITE_BUNDLE_SIZE_LIMIT=400              # Bundle size warning limit (KB)
VITE_LAZY_LOADING_ENABLED=true          # Enable lazy loading of components
VITE_MAX_FILE_SIZE_FREE=524288000       # Max file size for free users (500MB)
VITE_MAX_FILE_SIZE_PRO=5368709120       # Max file size for pro users (5GB)

# Monitoring (Optional)
VITE_SENTRY_DSN=your_sentry_dsn_here    # Sentry for error tracking
VITE_ANALYTICS_ID=your_analytics_id_here # Google Analytics ID

# Development (Optional)
VITE_DEBUG_MODE=false                   # Enable debug logging
VITE_MOCK_SUPABASE=false               # Use mock Supabase for testing
VITE_LOG_LEVEL=info                    # Log level (debug, info, warn, error)
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and anon key
3. Add these values to your `.env` file
4. The application will automatically validate the configuration on startup

### Offline Mode

If Supabase is not configured, the application will run in offline mode with limited functionality:
- ✅ File compression works
- ✅ Local file download works  
- ❌ User authentication disabled
- ❌ Cloud storage disabled
- ❌ Compression history disabled

### Troubleshooting

**Configuration Issues:**
- Check browser console for configuration validation messages
- Ensure all required environment variables are set
- Verify Supabase URL and key are correct

**Build Issues:**
- Run `npm audit` to check for security vulnerabilities
- Update dependencies with `npm update`
- Clear node_modules and reinstall if needed

**Performance Issues:**
- Monitor bundle size warnings during build
- Enable lazy loading with `VITE_LAZY_LOADING_ENABLED=true`
- Adjust `VITE_BUNDLE_SIZE_LIMIT` if needed

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/733dbc52-0fb3-45d9-9693-07339ae4095c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
