import { useState } from 'react';

export type ViewMode = 'formatted' | 'tree' | 'diff';
export type OutputTab = 'output' | 'csv' | 'yaml' | 'typescript';

interface Props {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: (content: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  outputTab: OutputTab;
  onOutputTabChange: (tab: OutputTab) => void;
  copied: boolean;
  isValid: boolean;
  hasContent: boolean;
  stats: { keys: number; depth: number; size: string };
}

export default function Toolbar({
  onFormat, onMinify, onCopy, onDownload, onUpload,
  viewMode, onViewModeChange,
  outputTab, onOutputTabChange,
  copied, isValid, hasContent, stats,
}: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') onUpload(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`flex flex-col gap-2 px-3 py-2 border-b border-slate-700/50 transition-colors ${
        dragOver ? 'bg-brand-500/10 border-brand-500/30' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <ToolButton onClick={onFormat} icon="format" label="Format" disabled={!hasContent} />
          <ToolButton onClick={onMinify} icon="minify" label="Minify" disabled={!hasContent} />
          <div className="w-px h-5 bg-slate-700/50 mx-0.5" />
          <ToolButton onClick={onCopy} icon={copied ? 'check' : 'copy'} label={copied ? 'Copied!' : 'Copy'} disabled={!hasContent} accent={copied} />
          <ToolButton onClick={onDownload} icon="download" label="Download" disabled={!hasContent} />
          <label className="btn-ghost !px-2 !py-1.5 text-xs cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="hidden sm:inline">Upload</span>
            <input type="file" accept=".json,.txt,.geojson" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = '';
            }} />
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <ViewToggle active={viewMode === 'formatted'} onClick={() => onViewModeChange('formatted')} label="Text" />
          <ViewToggle active={viewMode === 'tree'} onClick={() => onViewModeChange('tree')} label="Tree" />
          <ViewToggle active={viewMode === 'diff'} onClick={() => onViewModeChange('diff')} label="Diff" />
        </div>
      </div>

      {viewMode === 'formatted' && (
        <div className="flex items-center gap-1 text-[11px]">
          <TabButton active={outputTab === 'output'} onClick={() => onOutputTabChange('output')} label="JSON" />
          <TabButton active={outputTab === 'csv'} onClick={() => onOutputTabChange('csv')} label="CSV" />
          <TabButton active={outputTab === 'yaml'} onClick={() => onOutputTabChange('yaml')} label="YAML" />
          <TabButton active={outputTab === 'typescript'} onClick={() => onOutputTabChange('typescript')} label="TypeScript" />
        </div>
      )}

      {hasContent && (
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className={isValid ? 'text-emerald-400' : 'text-red-400'}>
            {isValid ? '● Valid JSON' : '● Invalid JSON'}
          </span>
          <span>{stats.keys} keys</span>
          <span>Depth {stats.depth}</span>
          <span>{stats.size}</span>
        </div>
      )}
    </div>
  );
}

function ToolButton({ onClick, icon, label, disabled, accent }: {
  onClick: () => void; icon: string; label: string; disabled?: boolean; accent?: boolean;
}) {
  const icons: Record<string, JSX.Element> = {
    format: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" /></svg>,
    minify: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>,
    copy: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    check: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
    download: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${accent ? 'btn-success !text-xs !px-2 !py-1' : 'btn-ghost !text-xs !px-2 !py-1'}`}
    >
      {icons[icon]}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ViewToggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
        active
          ? 'bg-slate-700/60 text-slate-200'
          : 'text-slate-500 hover:text-slate-400'
      }`}
    >
      {label}
    </button>
  );
}
