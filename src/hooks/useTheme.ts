import { useState, useEffect, useCallback } from 'react';
import { ThemeId, getTheme, themes } from '../lib/themes';

const STORAGE_KEY = 'jf-theme';

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  const theme = getTheme(id);

  themes.forEach((t) => {
    t.cssClass.split(' ').filter(Boolean).forEach((cls) => root.classList.remove(cls));
  });

  if (theme.cssClass) {
    theme.cssClass.split(' ').filter(Boolean).forEach((cls) => root.classList.add(cls));
  }

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.accent);
}

export function useTheme() {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(STORAGE_KEY) as ThemeId) || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    applyTheme(themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  useEffect(() => {
    applyTheme(themeId);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
  }, []);

  const theme = getTheme(themeId);

  return {
    themeId,
    theme,
    setTheme,
    isDark: theme.isDark,
  };
}
