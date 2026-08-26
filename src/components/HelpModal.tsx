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
  'Switch between Text, Tree, and Diff views',
  'Export to CSV, YAML, or generate TypeScript interfaces',
  'Adjust indentation with the indent controls',
  'Toggle word wrap for long lines',
  'Search inside tree view to find any key quickly',
];

export default function HelpModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.5)' }} />
      <div
        className="relative rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden"
        style={{ background: 'var(--jf-surface-1)', border: '1px solid var(--jf-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--jf-border)' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--jf-text)' }}>Keyboard Shortcuts</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--jf-text-muted)' }}>Master JsonForge in seconds</p>
          </div>
          <button onClick={onClose} className="btn-ghost !px-2 !py-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--jf-text-muted)' }}>
              Shortcuts
            </h3>
            <div className="space-y-2">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--jf-text-secondary)' }}>{s.desc}</span>
                  <div className="flex gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-2 py-0.5 text-[11px] font-mono font-medium rounded"
                        style={{
                          background: 'var(--jf-surface-3)',
                          color: 'var(--jf-text-secondary)',
                          border: '1px solid var(--jf-border)',
                        }}>
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--jf-text-muted)' }}>
              Tips
            </h3>
            <ul className="space-y-1.5">
              {tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--jf-text-secondary)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: 'var(--jf-accent)' }}>•</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-6 py-3 text-center"
          style={{ borderTop: '1px solid var(--jf-border)', background: 'var(--jf-surface-2)' }}>
          <p className="text-[11px]" style={{ color: 'var(--jf-text-muted)' }}>
            Built by <a href="https://github.com/thesajidalam" target="_blank" rel="noopener noreferrer"
              className="font-medium hover:underline" style={{ color: 'var(--jf-accent)' }}>@thesajidalam</a>
          </p>
        </div>
      </div>
    </div>
  );
}
