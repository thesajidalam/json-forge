import { useState, useRef, useEffect } from 'react';
import { ThemeId, themes, getTheme } from '../lib/themes';

interface Props {
  themeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
}

export default function ThemeToggle({ themeId, onThemeChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getTheme(themeId);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="btn-ghost !px-2 !py-1.5"
        title="Change theme"
        aria-label="Change theme"
      >
        <div
          className="w-3.5 h-3.5 rounded-full border transition-colors"
          style={{
            backgroundColor: current.accent,
            borderColor: current.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
          }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 py-1.5 rounded-xl shadow-2xl border z-50 animate-slide-down"
          style={{
            background: 'var(--jf-surface-1)',
            borderColor: 'var(--jf-border)',
          }}>
          <div className="px-3 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--jf-text-muted)' }}>
              Theme
            </span>
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { onThemeChange(t.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors text-[13px]"
              style={{
                color: t.id === themeId ? 'var(--jf-accent)' : 'var(--jf-text-secondary)',
                background: t.id === themeId ? 'var(--jf-accent-bg)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (t.id !== themeId) e.currentTarget.style.background = 'var(--jf-accent-bg)';
              }}
              onMouseLeave={(e) => {
                if (t.id !== themeId) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 border"
                style={{
                  backgroundColor: t.swatch,
                  borderColor: t.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                }}
              />
              <span className="font-medium">{t.name}</span>
              {t.id === themeId && (
                <svg className="w-3 h-3 ml-auto shrink-0" style={{ color: 'var(--jf-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
