import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import JsonInput from './components/JsonInput';
import JsonTreeView from './components/JsonOutput';
import Toolbar, { ViewMode, OutputTab } from './components/Toolbar';
import DiffView from './components/DiffView';
import HelpModal from './components/HelpModal';
import { useTheme } from './hooks/useTheme';
import { parseJson, formatJson, minifyJson } from './utils/json';
import { jsonToCsv, jsonToYaml, generateInterfaces, downloadFile } from './utils/convert';

const SAMPLE = `{
  "name": "JsonForge",
  "version": "1.0.0",
  "description": "The most powerful JSON toolkit for developers",
  "keywords": ["json", "formatter", "validator", "developer-tools"],
  "author": {
    "name": "Sajid Alam",
    "github": "https://github.com/thesajidalam"
  },
  "license": "MIT",
  "features": {
    "format": true,
    "minify": true,
    "validate": true,
    "treeView": true,
    "diff": true,
    "convert": ["CSV", "YAML", "TypeScript"]
  },
  "users": [
    { "name": "Developer", "rating": 5 },
    { "name": "Designer", "rating": 4 }
  ]
}`;

type OutputTabExtended = OutputTab | 'diff';

export default function App() {
  const { toggle: toggleTheme, isDark } = useTheme();
  const [input, setInput] = useState('');
  const [diffInput, setDiffInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [outputTab, setOutputTab] = useState<OutputTab>('output');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  const [wordWrap, setWordWrap] = useState(true);
  const [treeSearch, setTreeSearch] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const parsed = useMemo(() => parseJson(input), [input]);
  const diffParsed = useMemo(() => parseJson(diffInput), [diffInput]);

  const formatted = useMemo(() => {
    if (!parsed.success || parsed.data === undefined) return '';
    switch (outputTab) {
      case 'csv': return jsonToCsv(parsed.data);
      case 'yaml': return jsonToYaml(parsed.data);
      case 'typescript': return generateInterfaces(parsed.data);
      default: return formatJson(parsed.data, indent);
    }
  }, [parsed, outputTab, indent]);

  const stats = useMemo(() => {
    if (!parsed.success || !input.trim()) {
      return { keys: 0, depth: 0, size: '0 B', lines: 0, arrays: 0, objects: 0 };
    }
    return {
      keys: countKeys(parsed.data),
      depth: getDepth(parsed.data),
      size: formatSize(new Blob([input]).size),
      lines: input.split('\n').length,
      arrays: countType(parsed.data, 'array'),
      objects: countType(parsed.data, 'object'),
    };
  }, [parsed, input]);

  const handleFormat = useCallback(() => {
    if (parsed.success && parsed.data !== undefined) {
      setInput(formatJson(parsed.data, indent));
    }
  }, [parsed, indent]);

  const handleMinify = useCallback(() => {
    if (parsed.success && parsed.data !== undefined) {
      setInput(minifyJson(parsed.data));
    }
  }, [parsed]);

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = formatted;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [formatted]);

  const handleDownload = useCallback(() => {
    if (!formatted) return;
    const extMap: Record<string, string> = { csv: '.csv', yaml: '.yaml', typescript: '.ts' };
    const mimeMap: Record<string, string> = { csv: 'text/csv', yaml: 'text/yaml', typescript: 'text/typescript' };
    const ext = extMap[outputTab] || '.json';
    const mime = mimeMap[outputTab] || 'application/json';
    downloadFile(formatted, `output${ext}`, mime);
  }, [formatted, outputTab]);

  const handleClear = useCallback(() => {
    setInput('');
    setDiffInput('');
    setViewMode('formatted');
    setOutputTab('output');
  }, []);

  const handleLoadSample = useCallback(() => {
    setInput(SAMPLE);
    setViewMode('formatted');
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') setInput(ev.target.result);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') setInput(ev.target.result);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleFormat(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') { e.preventDefault(); handleClear(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleDownload(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') { e.preventDefault(); handleCopy(); }
      if (e.key === 'Escape') { setShowHelp(false); }
      if (e.key === '?') { e.preventDefault(); setShowHelp(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFormat, handleClear, handleDownload, handleCopy]);

  const viewBg = isDark ? 'bg-slate-900/40' : 'bg-slate-50';
  const outputBg = isDark ? 'bg-slate-900/20' : 'bg-white';

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-white dark:bg-surface-dark"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleFileDrop}
    >
      <Header isDark={isDark} onToggleTheme={toggleTheme} onClear={handleClear} onHelp={() => setShowHelp(true)} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Input Panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="panel-header bg-slate-50 dark:bg-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-500 ml-1 font-semibold uppercase tracking-wider">
                Input
              </span>
              {input.trim() && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  parsed.success
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {parsed.success ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono hidden sm:inline">
                Ctrl+Enter format
              </span>
              {!input.trim() && (
                <button onClick={handleLoadSample} className="btn-ghost !text-[10px] !px-2 !py-0.5 text-brand-600 dark:text-brand-400">
                  Load sample
                </button>
              )}
            </div>
          </div>
          <div className={`flex-1 min-h-0 overflow-hidden ${viewBg} ${dragOver ? 'ring-2 ring-inset ring-brand-500/30' : ''}`}>
            <JsonInput
              value={input}
              onChange={setInput}
              errorLine={parsed.error?.line}
              placeholder={`Paste JSON here...\n\nDrag & drop a .json file, or click "Load sample"`}
              ref={inputRef}
            />
          </div>
          {parsed.error && input.trim() && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 border-t border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono shrink-0 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Line {parsed.error.line}, Col {parsed.error.column} — {parsed.error.message}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="lg:w-[1px] lg:h-auto h-[1px] bg-slate-200 dark:bg-slate-700/30 shrink-0" />

        {/* Output Panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <Toolbar
            onFormat={handleFormat}
            onMinify={handleMinify}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onUpload={(c) => setInput(c)}
            onFileUpload={handleFileUpload}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            outputTab={outputTab}
            onOutputTabChange={setOutputTab}
            copied={copied}
            isValid={parsed.success}
            hasContent={input.trim().length > 0}
            stats={stats}
            indent={indent}
            onIndentChange={setIndent}
            wordWrap={wordWrap}
            onWordWrapToggle={() => setWordWrap((p) => !p)}
          />

          <div className={`flex-1 min-h-0 overflow-hidden ${outputBg}`}>
            {!input.trim() ? (
              <EmptyState onSample={handleLoadSample} />
            ) : viewMode === 'diff' ? (
              <div className="flex flex-col h-full">
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700/30 bg-white dark:bg-transparent">
                  <textarea
                    value={diffInput}
                    onChange={(e) => setDiffInput(e.target.value)}
                    placeholder="Paste second JSON to compare..."
                    className="w-full h-20 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 font-mono text-[12px] p-2 rounded-lg outline-none resize-none border border-slate-200 dark:border-slate-700/30 placeholder-slate-400 dark:placeholder-slate-600 focus:border-brand-500/50 transition-colors"
                    spellCheck={false}
                  />
                </div>
                <DiffView
                  left={parsed.success ? parsed.data : null}
                  right={diffParsed.success ? diffParsed.data : null}
                />
              </div>
            ) : viewMode === 'tree' && parsed.success ? (
              <div className="flex flex-col h-full">
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700/30">
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      value={treeSearch}
                      onChange={(e) => setTreeSearch(e.target.value)}
                      placeholder="Search keys..."
                      className="w-full bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 text-[12px] pl-8 pr-3 py-1.5 rounded-lg outline-none border border-slate-200 dark:border-slate-700/30 placeholder-slate-400 dark:placeholder-slate-600 focus:border-brand-500/50 transition-colors"
                    />
                  </div>
                </div>
                <JsonTreeView data={parsed.data} searchQuery={treeSearch} />
              </div>
            ) : (
              <FormattedOutput content={formatted} wordWrap={wordWrap} />
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="statusbar">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-600 dark:text-slate-400">JsonForge</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden sm:inline">{viewMode === 'formatted' ? outputTab.toUpperCase() : viewMode}</span>
          {input.trim() && parsed.success && (
            <>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
              <span className="hidden md:inline">{stats.keys} keys · {stats.depth} deep · {stats.size}</span>
            </>
          )}
          <span className="hidden lg:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden lg:inline opacity-60">? help</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Made with care by</span>
          <a
            href="https://github.com/thesajidalam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors hover:underline"
          >
            @thesajidalam
          </a>
        </div>
      </footer>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

function FormattedOutput({ content, wordWrap }: { content: string; wordWrap: boolean }) {
  const lines = content.split('\n');

  return (
    <div className="h-full overflow-auto p-4">
      <pre className={`font-mono text-[13px] leading-5 ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'} max-w-full`}>
        {lines.map((line, i) => (
          <div key={i} className="flex hover:bg-brand-500/5 dark:hover:bg-brand-500/5 -mx-4 px-4 rounded-sm transition-colors">
            <span className="w-10 shrink-0 text-right pr-3 text-slate-300 dark:text-slate-600 select-none text-[11px]">
              {i + 1}
            </span>
            <HighlightedLine line={line} />
          </div>
        ))}
      </pre>
    </div>
  );
}

function HighlightedLine({ line }: { line: string }) {
  const parts: { text: string; cls: string }[] = [];
  let rest = line;

  while (rest.length > 0) {
    const ws = rest.match(/^(\s+)/);
    if (ws) {
      parts.push({ text: ws[1], cls: '' });
      rest = rest.slice(ws[1].length);
      continue;
    }

    if (rest[0] === '"') {
      const end = findStringEnd(rest);
      const str = rest.slice(0, end + 1);
      rest = rest.slice(end + 1);
      const isKey = rest.trimStart()[0] === ':';
      parts.push({ text: str, cls: isKey ? 'text-blue-700 dark:text-brand-300 font-medium' : 'text-green-700 dark:text-emerald-400' });
      continue;
    }

    const num = rest.match(/^-?\d+\.?\d*([eE][+-]?\d+)?/);
    if (num) {
      parts.push({ text: num[0], cls: 'text-amber-600 dark:text-amber-400 font-medium' });
      rest = rest.slice(num[0].length);
      continue;
    }

    if (rest.startsWith('true') || rest.startsWith('false')) {
      const w = rest.slice(0, 5);
      parts.push({ text: w, cls: 'text-purple-600 dark:text-purple-400 font-semibold' });
      rest = rest.slice(5);
      continue;
    }

    if (rest.startsWith('null')) {
      parts.push({ text: 'null', cls: 'text-red-500 dark:text-red-400 font-semibold italic' });
      rest = rest.slice(4);
      continue;
    }

    if (rest[0] === ':') {
      parts.push({ text: ':', cls: 'text-slate-400 dark:text-slate-500' });
      rest = rest.slice(1);
      continue;
    }

    if (/[{}\[\],]/.test(rest[0])) {
      parts.push({ text: rest[0], cls: 'text-slate-400 dark:text-slate-500' });
      rest = rest.slice(1);
      continue;
    }

    parts.push({ text: rest[0], cls: 'text-slate-700 dark:text-slate-300' });
    rest = rest.slice(1);
  }

  return (
    <span>
      {parts.map((p, i) => <span key={i} className={p.cls}>{p.text}</span>)}
    </span>
  );
}

function findStringEnd(s: string): number {
  let i = 1;
  while (i < s.length) {
    if (s[i] === '\\') { i += 2; continue; }
    if (s[i] === '"') return i;
    i++;
  }
  return s.length - 1;
}

function EmptyState({ onSample }: { onSample: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-fire-500/20 dark:from-brand-500/20 dark:to-fire-500/20 flex items-center justify-center mb-6 border border-brand-200 dark:border-brand-500/10 shadow-lg shadow-brand-500/5">
        <span className="text-4xl font-mono font-bold gradient-text">{'{}'}</span>
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
        Paste your JSON
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-500 max-w-sm mb-6 leading-relaxed">
        Drop JSON in the input panel, and JsonForge instantly formats, validates, and transforms it.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {['Format', 'Minify', 'Validate', 'Tree View', 'CSV', 'YAML', 'TypeScript', 'Diff'].map((f) => (
          <span key={f} className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
            {f}
          </span>
        ))}
      </div>
      <button onClick={onSample} className="btn-primary !text-sm">
        Load sample JSON
      </button>
    </div>
  );
}

function countKeys(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) return data.reduce<number>((s, i) => s + countKeys(i), 0);
  const obj = data as Record<string, unknown>;
  return Object.keys(obj).length + Object.values(obj).reduce<number>((s, v) => s + countKeys(v), 0);
}

function getDepth(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) return 1 + Math.max(0, ...data.map(getDepth));
  const obj = data as Record<string, unknown>;
  return 1 + Math.max(0, ...Object.values(obj).map(getDepth));
}

function countType(data: unknown, type: string): number {
  if (data === null || typeof data !== 'object') return 0;
  let count = 0;
  if (type === 'array' && Array.isArray(data)) count = 1;
  if (type === 'object' && !Array.isArray(data)) count = 1;
  const values = Array.isArray(data) ? data : Object.values(data as Record<string, unknown>);
  return count + values.reduce<number>((s, v) => s + countType(v, type), 0);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
