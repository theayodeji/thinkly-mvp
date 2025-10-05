export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_KEY = 'theme';

export const getSystemTheme = (): ResolvedTheme => 
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
