import { useState } from 'react';

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
  onFormat, onMinify, onCopy, onDownload, onUpload, onFileUpload,
  viewMode, onViewModeChange,
  outputTab, onOutputTabChange,
  copied, isValid, hasContent, stats,
  indent, onIndentChange, wordWrap, onWordWrapToggle,
}: Props) {
  return (
    <div className="flex flex-col gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-700/50 toolbar-bg shrink-0">
      {/* Row 1: Actions + View toggles */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
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

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700/50 mx-0.5" />

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
          {/* Indent control */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500">
            <span className="hidden md:inline">Indent:</span>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              {[2, 4, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => onIndentChange(n)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-medium transition-colors ${
                    indent === n
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Word wrap */}
          <button
            onClick={onWordWrapToggle}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors border ${
              wordWrap
                ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/25 text-brand-600 dark:text-brand-400'
                : 'bg-transparent border-slate-200 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
            }`}
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
      className={`btn !text-xs !px-2 !py-1 transition-all ${
        accent
          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25'
          : 'bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function ViewBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/25'
          : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
        active
          ? 'bg-slate-200 dark:bg-slate-700/60 text-slate-800 dark:text-slate-200'
          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
      }`}
    >
      {children}
    </button>
  );
}
