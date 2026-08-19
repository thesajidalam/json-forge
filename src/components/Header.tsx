import ThemeToggle from './ThemeToggle';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onClear: () => void;
  onHelp: () => void;
}

export default function Header({ isDark, onToggleTheme, onClear, onHelp }: Props) {
  return (
    <header className="glass border-b border-slate-200 dark:border-slate-700/50 px-4 py-2.5 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-fire-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <span className="text-white font-mono font-bold text-xs">{'{}'}</span>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Json<span className="gradient-text">Forge</span>
          </h1>
          <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono">
            v1.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onHelp} className="btn-ghost !px-2 !py-1.5" title="Help (?)">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button onClick={onClear} className="btn-ghost !px-2 !py-1.5 text-xs" title="Clear (Ctrl+L)">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
