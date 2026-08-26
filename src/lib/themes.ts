export type ThemeId = 'light' | 'dark' | 'bold' | 'midnight' | 'mono' | 'nord';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  isDark: boolean;
  cssClass: string;
  accent: string;
  swatch: string;
}

export const themes: ThemeDef[] = [
  { id: 'light',    name: 'Light',       isDark: false, cssClass: '',                    accent: '#1d6fa5', swatch: '#f8f7f4' },
  { id: 'dark',     name: 'Dark',        isDark: true,  cssClass: 'dark',                accent: '#3da9f5', swatch: '#111318' },
  { id: 'bold',     name: 'Bold Dark',   isDark: true,  cssClass: 'dark theme-bold',     accent: '#ffffff', swatch: '#000000' },
  { id: 'midnight', name: 'Midnight',    isDark: true,  cssClass: 'dark theme-midnight', accent: '#9b8aff', swatch: '#0e0d1a' },
  { id: 'mono',     name: 'Monochrome',  isDark: true,  cssClass: 'dark theme-mono',     accent: '#d0d0d0', swatch: '#111111' },
  { id: 'nord',     name: 'Nord',        isDark: true,  cssClass: 'dark theme-nord',     accent: '#88c0d0', swatch: '#2e3440' },
];

export function getTheme(id: ThemeId): ThemeDef {
  return themes.find((t) => t.id === id) || themes[1];
}
