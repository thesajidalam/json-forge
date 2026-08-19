interface Props {
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'Enter'], desc: 'Format JSON' },
  { keys: ['Ctrl', 'L'], desc: 'Clear input' },
  { keys: ['Ctrl', 'S'], desc: 'Download output' },
  { keys: ['Ctrl', 'Shift', 'C'], desc: 'Copy output' },
  { keys: ['?'], desc: 'Toggle this help panel' },
  { keys: ['Esc'], desc: 'Close modals' },
];

const tips = [
  'Drag & drop .json files directly onto the page',
  'Paste any valid JSON — validation happens instantly',
  'Switch between Text, Tree, and Diff views anytime',
  'Export to CSV, YAML, or generate TypeScript interfaces',
  'Adjust indentation with the indent controls in the toolbar',
  'Toggle word wrap for long lines',
  'Search inside tree view to find any key quickly',
];

export default function HelpModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
            <p className="text-xs text-slate-500 mt-0.5">Master JsonForge in seconds</p>
          </div>
          <button onClick={onClose} className="btn-ghost !px-2 !py-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Shortcuts
            </h3>
            <div className="space-y-2">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-2 py-0.5 text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600 shadow-sm">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Tips
            </h3>
            <ul className="space-y-1.5">
              {tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-brand-500 mt-0.5 shrink-0">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
          <p className="text-[11px] text-slate-400">
            Built by <a href="https://github.com/thesajidalam" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">@thesajidalam</a>
          </p>
        </div>
      </div>
    </div>
  );
}
