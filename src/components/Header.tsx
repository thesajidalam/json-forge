import ThemeToggle from './ThemeToggle';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onClear: () => void;
}

export default function Header({ isDark, onToggleTheme, onClear }: Props) {
  return (
    <header className="glass border-b border-slate-700/50 px-4 py-3 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-fire-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <span className="text-white font-mono font-bold text-sm">{'{}'}</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            JsonForge
            <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/20 text-[10px] font-semibold tracking-wider uppercase">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
            Format, Validate & Transform JSON
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onClear} className="btn-ghost text-xs !px-2.5 !py-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">Clear</span>
        </button>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
