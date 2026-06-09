import es from '../util/translations/es.json';
import en from '../util/translations/en.json';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// Simple key path resolver: "home.heroTitle" -> nested value
function get(obj: any, path: string): any {
  return path.split('.').reduce((acc, k) => (acc && typeof acc === 'object') ? acc[k] : undefined, obj);
}

export function useT() {
  const lang = useSelector((s: RootState) => (s as any).language.currentLanguage || 'ES');
  const dict = lang === 'EN' ? en : es;
  const t = (key: string, fallback?: string): string => {
    const val = get(dict, key);
    if (val === undefined) return fallback ?? key;
    if (typeof val === 'string') return val;
    return fallback ?? key;
  };
  return { t, lang };
}

export type TranslateFn = (key: string, fallback?: string) => string;
