import { STORAGE_KEYS } from './storageKeys';

export type Theme = 'dark' | 'light';

export function getStoredTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function applyTheme(theme: Theme): void {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(STORAGE_KEYS.theme, theme);

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', isDark ? '#101022' : '#f6f7f8');
  }

  const iosBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (iosBarMeta) {
    iosBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
  }
}

/** Aplica o tema salvo antes do React montar (evita flash e reset indevido). */
export function initTheme(): void {
  applyTheme(getStoredTheme());
}
