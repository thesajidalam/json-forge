import ThemeToggle from './ThemeToggle';
import { ThemeId } from '../lib/themes';

interface Props {
  themeId: ThemeId;
  isDark: boolean;
  onThemeChange: (id: ThemeId) => void;
  onClear: () => void;
  onHelp: () => void;
}

function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" style={{ fill: 'var(--jf-surface-1)' }} />
      <path d="M10.5 11.5L7 16L10.5 20.5" stroke="var(--jf-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.5 11.5L25 16L21.5 20.5" stroke="var(--jf-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 10L13.5 22" stroke="var(--jf-accent-hover)" strokeWidth="1.75" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function Header({ themeId, isDark, onThemeChange, onClear, onHelp }: Props) {
  return (
    <header className="glass px-4 py-2 flex items-center justify-between z-10 shrink-0" style={{ borderBottom: '1px solid var(--jf-border)' }}>
      <div className="flex items-center gap-2.5">
        <LogoMark className="w-7 h-7 shrink-0" />
        <div className="flex items-center gap-2">
          <h1 className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--jf-text)' }}>
            Json<span className="font-extrabold" style={{ color: 'var(--jf-accent)' }}>Forge</span>
          </h1>
          <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded font-mono font-medium"
            style={{ color: 'var(--jf-text-muted)', border: '1px solid var(--jf-border)' }}>
            v1.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button onClick={onHelp} className="btn-ghost !px-2 !py-1.5" title="Help (?)">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </button>
        <button onClick={onClear} className="btn-ghost !px-2 !py-1.5" title="Clear (Ctrl+L)">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <div className="w-px h-4 mx-1" style={{ background: 'var(--jf-border)' }} />
        <ThemeToggle themeId={themeId} onThemeChange={onThemeChange} />
      </div>
    </header>
  );
}

export { LogoMark };
