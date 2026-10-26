export type AppMode = 'demo' | 'development' | 'production';

export interface EnvConfig {
  appMode: AppMode;
  supabase: {
    url: string;
    anonKey: string;
  } | null; // null only in demo mode
  isDemo: boolean;
}

// Must be called server-side only
export function getEnvConfig(): EnvConfig {
  if (typeof window !== 'undefined') {
    throw new Error('getEnvConfig() must only be called on the server. Never import this in client components.');
  }

  const appMode = (process.env.APP_MODE || 'demo') as AppMode;

  if (!['demo', 'development', 'production'].includes(appMode)) {
    throw new Error(`Invalid APP_MODE: "${appMode}". Must be one of: demo, development, production`);
  }

  if (appMode === 'demo') {
    return { appMode, supabase: null, isDemo: true };
  }

  // For development and production, Supabase is REQUIRED - no fallback to demo
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      `APP_MODE is "${appMode}" but Supabase environment variables are missing.\n` +
      `Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY\n` +
      `Set APP_MODE=demo for local demo mode without Supabase, or provide the required variables.`
    );
  }

  return {
    appMode,
    supabase: { url, anonKey },
    isDemo: false,
  };
}
