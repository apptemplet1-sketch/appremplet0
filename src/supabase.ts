import { createClient } from '@supabase/supabase-js';

const getEnvOrStorage = (envKey: string, storageKey: string): string => {
  const envVal = (import.meta as any).env?.[envKey];
  if (envVal && String(envVal).trim() !== '') return String(envVal).trim();
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(storageKey);
    if (stored && stored.trim() !== '') return stored.trim();
  }
  return '';
};

export const getSupabaseConfig = () => {
  const url = getEnvOrStorage('VITE_SUPABASE_URL', 'custom_supabase_url');
  const anonKey = getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'custom_supabase_anon_key');
  return { url, anonKey, isConfigured: Boolean(url && anonKey) };
};

const initialConfig = getSupabaseConfig();

export let supabase = createClient(
  initialConfig.url || 'https://placeholder.supabase.co',
  initialConfig.anonKey || 'placeholder'
);

export const updateSupabaseCredentials = (newUrl: string, newAnonKey: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('custom_supabase_url', newUrl.trim());
    localStorage.setItem('custom_supabase_anon_key', newAnonKey.trim());
  }
  supabase = createClient(newUrl.trim(), newAnonKey.trim());
};
