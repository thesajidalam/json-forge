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

export default function App() {
  const { themeId, setTheme, isDark } = useTheme();
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
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  }, []);

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
      showToast('Formatted');
    }
  }, [parsed, indent, showToast]);

  const handleMinify = useCallback(() => {
    if (parsed.success && parsed.data !== undefined) {
      setInput(minifyJson(parsed.data));
      showToast('Minified');
    }
  }, [parsed, showToast]);

  const handleCopy = useCallback(async () => {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      showToast('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = formatted;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      showToast('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [formatted, showToast]);

  const handleDownload = useCallback(() => {
    if (!formatted) return;
    const extMap: Record<string, string> = { csv: '.csv', yaml: '.yaml', typescript: '.ts' };
    const mimeMap: Record<string, string> = { csv: 'text/csv', yaml: 'text/yaml', typescript: 'text/typescript' };
    const ext = extMap[outputTab] || '.json';
    const mime = mimeMap[outputTab] || 'application/json';
    downloadFile(formatted, `output${ext}`, mime);
    showToast('Downloaded');
  }, [formatted, outputTab, showToast]);

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
        if (typeof ev.target?.result === 'string') {
          setInput(ev.target.result);
          showToast(`Loaded ${file.name}`);
        }
      };
      reader.readAsText(file);
    }
  }, [showToast]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setInput(ev.target.result);
          showToast(`Loaded ${file.name}`);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  }, [showToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inInput = tag === 'TEXTAREA' || tag === 'INPUT';
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleFormat(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') { e.preventDefault(); handleClear(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleDownload(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); handleCopy(); }
      if (e.key === 'Escape') { setShowHelp(false); }
      if (e.key === '?' && !inInput) { e.preventDefault(); setShowHelp(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFormat, handleClear, handleDownload, handleCopy]);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--jf-bg)', color: 'var(--jf-text)' }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleFileDrop}
    >
      <Header
        themeId={themeId}
        isDark={isDark}
        onThemeChange={setTheme}
        onClear={handleClear}
        onHelp={() => setShowHelp(true)}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Input Panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#eab308' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider ml-1"
                style={{ color: 'var(--jf-text-muted)' }}>
                Input
              </span>
              {input.trim() && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                  style={parsed.success
                    ? { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }
                    : { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }
                  }
                >
                  {parsed.success ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono hidden sm:inline"
                style={{ color: 'var(--jf-text-muted)' }}>
                Ctrl+Enter
              </span>
              {!input.trim() && (
                <button onClick={handleLoadSample}
                  className="btn-ghost !text-[11px] !px-2 !py-0.5"
                  style={{ color: 'var(--jf-accent)' }}>
                  Load sample
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden"
            style={{
              background: isDark ? 'var(--jf-surface-1)' : '#f8fafc',
              boxShadow: dragOver ? 'inset 0 0 0 2px var(--jf-accent-border)' : 'none',
            }}>
            <JsonInput
              value={input}
              onChange={setInput}
              errorLine={parsed.error?.line}
              placeholder={`Paste JSON here...\n\nDrag & drop a .json file, or click "Load sample"`}
              ref={inputRef}
            />
          </div>
          {parsed.error && input.trim() && (
            <div className="px-4 py-2 text-xs font-mono shrink-0 flex items-center gap-2"
              style={{
                background: 'rgba(239, 68, 68, 0.06)',
                borderTop: '1px solid rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
              }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Line {parsed.error.line}, Col {parsed.error.column} — {parsed.error.message}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="lg:w-px lg:h-auto h-px shrink-0" style={{ background: 'var(--jf-border)' }} />

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

          <div className="flex-1 min-h-0 overflow-hidden output-bg">
            {!input.trim() ? (
              <EmptyState onSample={handleLoadSample} />
            ) : viewMode === 'diff' ? (
              <div className="flex flex-col h-full">
                <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--jf-border)' }}>
                  <textarea
                    value={diffInput}
                    onChange={(e) => setDiffInput(e.target.value)}
                    placeholder="Paste second JSON to compare..."
                    className="w-full h-20 font-mono text-[12px] p-2 rounded-lg outline-none resize-none transition-colors"
                    style={{
                      background: 'var(--jf-surface-2)',
                      color: 'var(--jf-text)',
                      border: '1px solid var(--jf-border)',
                    }}
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
                <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--jf-border)' }}>
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--jf-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      value={treeSearch}
                      onChange={(e) => setTreeSearch(e.target.value)}
                      placeholder="Search keys..."
                      className="w-full text-[12px] pl-8 pr-3 py-1.5 rounded-lg outline-none transition-colors"
                      style={{
                        background: 'var(--jf-surface-2)',
                        color: 'var(--jf-text)',
                        border: '1px solid var(--jf-border)',
                      }}
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
          <span className="font-semibold" style={{ color: 'var(--jf-text-secondary)' }}>JsonForge</span>
          <span style={{ color: 'var(--jf-border)' }}>|</span>
          <span>{viewMode === 'formatted' ? outputTab.toUpperCase() : viewMode}</span>
          {input.trim() && parsed.success && (
            <>
              <span style={{ color: 'var(--jf-border)' }}>|</span>
              <span className="hidden md:inline">{stats.keys} keys · {stats.depth} deep · {stats.size}</span>
            </>
          )}
          <span className="hidden lg:inline" style={{ color: 'var(--jf-border)' }}>|</span>
          <span className="hidden lg:inline opacity-60">? help</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Made with care by</span>
          <a
            href="https://github.com/thesajidalam"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:underline"
            style={{ color: 'var(--jf-accent)' }}
          >
            @thesajidalam
          </a>
        </div>
      </footer>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* --- Inline components --- */

function FormattedOutput({ content, wordWrap }: { content: string; wordWrap: boolean }) {
  const lines = content.split('\n');

  return (
    <div className="h-full overflow-auto p-4">
      <pre className={`font-mono text-[13px] leading-[22px] ${wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'} max-w-full`}>
        {lines.map((line, i) => (
          <div key={i} className="flex -mx-4 px-4 rounded-sm transition-colors"
            style={{ '--hover-bg': 'var(--syn-hover)' } as React.CSSProperties}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--syn-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <span className="w-10 shrink-0 text-right pr-3 select-none text-[11px]"
              style={{ color: 'var(--jf-text-muted)' }}>
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
    if (ws) { parts.push({ text: ws[1], cls: '' }); rest = rest.slice(ws[1].length); continue; }

    if (rest[0] === '"') {
      const end = findStringEnd(rest);
      const str = rest.slice(0, end + 1);
      rest = rest.slice(end + 1);
      const isKey = rest.trimStart()[0] === ':';
      parts.push({ text: str, cls: isKey ? 'syn-key' : 'syn-str' });
      continue;
    }

    const num = rest.match(/^-?\d+\.?\d*([eE][+-]?\d+)?/);
    if (num) { parts.push({ text: num[0], cls: 'syn-num' }); rest = rest.slice(num[0].length); continue; }

    if (rest.startsWith('true') || rest.startsWith('false')) {
      parts.push({ text: rest.slice(0, 5), cls: 'syn-bool' }); rest = rest.slice(5); continue;
    }
    if (rest.startsWith('null')) {
      parts.push({ text: 'null', cls: 'syn-null' }); rest = rest.slice(4); continue;
    }
    if (rest[0] === ':') { parts.push({ text: ':', cls: 'syn-punct' }); rest = rest.slice(1); continue; }
    if (/[{}\[\],]/.test(rest[0])) { parts.push({ text: rest[0], cls: 'syn-punct' }); rest = rest.slice(1); continue; }
    parts.push({ text: rest[0], cls: '' }); rest = rest.slice(1);
  }

  const colorMap: Record<string, string> = {
    'syn-key': 'var(--syn-key)',
    'syn-str': 'var(--syn-str)',
    'syn-num': 'var(--syn-num)',
    'syn-bool': 'var(--syn-bool)',
    'syn-null': 'var(--syn-null)',
    'syn-punct': 'var(--syn-punct)',
  };

  return (
    <span>
      {parts.map((p, i) => {
        if (!p.cls) return <span key={i}>{p.text}</span>;
        return <span key={i} style={{ color: colorMap[p.cls] }}>{p.text}</span>;
      })}
    </span>
  );
}

function findStringEnd(s: string): number {
  let i = 1;
  while (i < s.length) { if (s[i] === '\\') { i += 2; continue; } if (s[i] === '"') return i; i++; }
  return s.length - 1;
}

function EmptyState({ onSample }: { onSample: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: 'var(--jf-accent-bg)',
          border: '1px solid var(--jf-accent-border)',
        }}>
        <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 11.5L7 16L10.5 20.5" stroke="var(--jf-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.5 11.5L25 16L21.5 20.5" stroke="var(--jf-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 10L13.5 22" stroke="var(--jf-accent-hover)" strokeWidth="1.75" strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>
      <h2 className="text-lg font-bold mb-1.5" style={{ color: 'var(--jf-text)' }}>
        Paste your JSON
      </h2>
      <p className="text-sm max-w-sm mb-5 leading-relaxed" style={{ color: 'var(--jf-text-secondary)' }}>
        Drop JSON in the input panel, and JsonForge instantly formats, validates, and transforms it.
      </p>
      <div className="flex flex-wrap gap-1.5 justify-center mb-5">
        {['Format', 'Minify', 'Validate', 'Tree View', 'CSV', 'YAML', 'TypeScript', 'Diff'].map((f) => (
          <span key={f} className="badge text-[11px]"
            style={{
              background: 'var(--jf-surface-2)',
              color: 'var(--jf-text-secondary)',
              border: '1px solid var(--jf-border)',
            }}>
            {f}
          </span>
        ))}
      </div>
      <button onClick={onSample} className="btn-primary text-sm">
        Load sample JSON
      </button>
    </div>
  );
}

/* --- Utility functions --- */
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
