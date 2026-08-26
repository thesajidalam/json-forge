export type ViewMode = 'formatted' | 'tree' | 'diff';
export type OutputTab = 'output' | 'csv' | 'yaml' | 'typescript';

interface Props {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: (content: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  outputTab: OutputTab;
  onOutputTabChange: (tab: OutputTab) => void;
  copied: boolean;
  isValid: boolean;
  hasContent: boolean;
  stats: { keys: number; depth: number; size: string; lines: number; arrays: number; objects: number };
  indent: number;
  onIndentChange: (n: number) => void;
  wordWrap: boolean;
  onWordWrapToggle: () => void;
}

export default function Toolbar({
  onFormat, onMinify, onCopy, onDownload, onFileUpload,
  viewMode, onViewModeChange,
  outputTab, onOutputTabChange,
  copied, isValid, hasContent,
  indent, onIndentChange, wordWrap, onWordWrapToggle,
}: Props) {
  return (
    <div className="flex flex-col gap-2 px-3 py-2 toolbar-bg shrink-0">
      {/* Row 1: Actions + View toggles */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-0.5 flex-wrap">
          <ActionBtn onClick={onFormat} disabled={!hasContent || !isValid} title="Format (Ctrl+Enter)">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
            </svg>
            <span className="hidden sm:inline">Format</span>
          </ActionBtn>
          <ActionBtn onClick={onMinify} disabled={!hasContent || !isValid} title="Minify">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <span className="hidden sm:inline">Minify</span>
          </ActionBtn>

          <div className="w-px h-4 mx-0.5" style={{ background: 'var(--jf-border)' }} />

          <ActionBtn onClick={onCopy} disabled={!hasContent || !isValid} accent={copied} title="Copy (Ctrl+Shift+C)">
            {copied ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </ActionBtn>
          <ActionBtn onClick={onDownload} disabled={!hasContent} title="Download (Ctrl+S)">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </ActionBtn>
          <label className="btn-ghost !px-2 !py-1.5 text-xs cursor-pointer" title="Upload .json file">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="hidden sm:inline">Upload</span>
            <input type="file" accept=".json,.txt,.geojson,.jsonl" className="hidden" onChange={onFileUpload} />
          </label>
        </div>

        <div className="flex items-center gap-0.5">
          <ViewBtn active={viewMode === 'formatted'} onClick={() => onViewModeChange('formatted')}>Text</ViewBtn>
          <ViewBtn active={viewMode === 'tree'} onClick={() => onViewModeChange('tree')}>Tree</ViewBtn>
          <ViewBtn active={viewMode === 'diff'} onClick={() => onViewModeChange('diff')}>Diff</ViewBtn>
        </div>
      </div>

      {/* Row 2: Tabs + Controls */}
      <div className="flex items-center justify-between gap-2">
        {viewMode === 'formatted' ? (
          <div className="flex items-center gap-0.5">
            <TabBtn active={outputTab === 'output'} onClick={() => onOutputTabChange('output')}>JSON</TabBtn>
            <TabBtn active={outputTab === 'csv'} onClick={() => onOutputTabChange('csv')}>CSV</TabBtn>
            <TabBtn active={outputTab === 'yaml'} onClick={() => onOutputTabChange('yaml')}>YAML</TabBtn>
            <TabBtn active={outputTab === 'typescript'} onClick={() => onOutputTabChange('typescript')}>TypeScript</TabBtn>
          </div>
        ) : <div />}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--jf-text-muted)' }}>
            <span className="hidden md:inline">Indent</span>
            <div className="flex items-center rounded-md overflow-hidden"
              style={{ background: 'var(--jf-surface-2)', border: '1px solid var(--jf-border)' }}>
              {[2, 4, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => onIndentChange(n)}
                  className="px-1.5 py-0.5 text-[10px] font-mono font-medium transition-colors"
                  style={indent === n ? {
                    background: 'var(--jf-accent)',
                    color: '#ffffff',
                  } : {
                    color: 'var(--jf-text-muted)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onWordWrapToggle}
            className="px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors"
            style={wordWrap ? {
              background: 'var(--jf-accent-bg)',
              color: 'var(--jf-accent)',
              border: `1px solid var(--jf-accent-border)`,
            } : {
              background: 'transparent',
              color: 'var(--jf-text-muted)',
              border: `1px solid var(--jf-border)`,
            }}
            title="Toggle word wrap"
          >
            Wrap
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, disabled, children, accent, title }: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; accent?: boolean; title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="btn !text-xs !px-2 !py-1 transition-all"
      style={accent ? {
        background: 'rgba(34, 197, 94, 0.1)',
        color: '#22c55e',
        border: '1px solid rgba(34, 197, 94, 0.25)',
      } : {
        background: 'transparent',
        color: 'var(--jf-text-secondary)',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !accent) e.currentTarget.style.background = 'var(--jf-accent-bg)';
      }}
      onMouseLeave={(e) => {
        if (!accent) e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

function ViewBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
      style={active ? {
        background: 'var(--jf-accent-bg)',
        color: 'var(--jf-accent)',
        border: `1px solid var(--jf-accent-border)`,
      } : {
        color: 'var(--jf-text-muted)',
        border: '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) { e.currentTarget.style.color = 'var(--jf-text)'; e.currentTarget.style.background = 'var(--jf-accent-bg)'; }
      }}
      onMouseLeave={(e) => {
        if (!active) { e.currentTarget.style.color = 'var(--jf-text-muted)'; e.currentTarget.style.background = 'transparent'; }
      }}
    >
      {children}
    </button>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-0.5 rounded text-[11px] font-medium transition-all"
      style={active ? {
        background: 'var(--jf-surface-3)',
        color: 'var(--jf-text)',
      } : {
        color: 'var(--jf-text-muted)',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = 'var(--jf-text-secondary)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = 'var(--jf-text-muted)';
      }}
    >
      {children}
    </button>
  );
}
