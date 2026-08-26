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
  { id: 'light',    name: 'Light',       isDark: false, cssClass: '',                 accent: '#0ea5e9', swatch: '#f8fafc' },
  { id: 'dark',     name: 'Dark',        isDark: true,  cssClass: 'dark',             accent: '#0ea5e9', swatch: '#0f172a' },
  { id: 'bold',     name: 'Bold Dark',   isDark: true,  cssClass: 'dark theme-bold',  accent: '#ffffff', swatch: '#000000' },
  { id: 'midnight', name: 'Midnight',    isDark: true,  cssClass: 'dark theme-midnight', accent: '#818cf8', swatch: '#0c0e1a' },
  { id: 'mono',     name: 'Monochrome',  isDark: true,  cssClass: 'dark theme-mono',  accent: '#d4d4d4', swatch: '#0a0a0a' },
  { id: 'nord',     name: 'Nord',        isDark: true,  cssClass: 'dark theme-nord',  accent: '#88c0d0', swatch: '#2e3440' },
];

export function getTheme(id: ThemeId): ThemeDef {
  return themes.find((t) => t.id === id) || themes[1];
}
