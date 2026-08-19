import { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import JsonInput from './components/JsonInput';
import JsonTreeView from './components/JsonOutput';
import Toolbar, { ViewMode, OutputTab } from './components/Toolbar';
import DiffView from './components/DiffView';
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
  "repository": {
    "type": "git",
    "url": "https://github.com/thesajidalam/json-forge"
  },
  "features": {
    "format": true,
    "minify": true,
    "validate": true,
    "treeView": true,
    "diff": true,
    "convert": ["CSV", "YAML", "TypeScript"],
    "themes": ["dark", "light"]
  },
  "stats": {
    "stars": 0,
    "forks": 0,
    "issues": 0
  }
}`;

export default function App() {
  const { theme, toggle: toggleTheme, isDark } = useTheme();
  const [input, setInput] = useState('');
  const [diffInput, setDiffInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [outputTab, setOutputTab] = useState<OutputTab>('output');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  const [treeSearch, setTreeSearch] = useState('');

  const parsed = useMemo(() => parseJson(input), [input]);
  const diffParsed = useMemo(() => parseJson(diffInput), [diffInput]);

  const formatted = useMemo(() => {
    if (!parsed.success) return '';
    if (outputTab === 'csv') return jsonToCsv(parsed.data);
    if (outputTab === 'yaml') return jsonToYaml(parsed.data);
    if (outputTab === 'typescript') return generateInterfaces(parsed.data);
    return formatJson(parsed.data, indent);
  }, [parsed, outputTab, indent]);

  const stats = useMemo(() => {
    if (!parsed.success || parsed.data === undefined) {
      return { keys: 0, depth: 0, size: '0 B' };
    }
    return {
      keys: countKeys(parsed.data),
      depth: getDepth(parsed.data),
      size: formatSize(new Blob([input]).size),
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

  const handleCopy = useCallback(() => {
    if (formatted) {
      navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [formatted]);

  const handleDownload = useCallback(() => {
    if (!formatted) return;
    const ext = outputTab === 'csv' ? '.csv' : outputTab === 'yaml' ? '.yaml' : outputTab === 'typescript' ? '.ts' : '.json';
    const mime = outputTab === 'output' ? 'application/json' : 'text/plain';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleFormat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFormat, handleClear]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isDark ? '' : 'bg-slate-100 text-slate-900'}`}>
      <Header isDark={isDark} onToggleTheme={toggleTheme} onClear={handleClear} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Input Panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="panel-header bg-slate-800/80 dark:bg-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-500 ml-2 font-medium">Input</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 font-mono">
                Ctrl+Enter to format
              </span>
              {!input && (
                <button onClick={handleLoadSample} className="btn-ghost !text-[10px] !px-2 !py-0.5 text-brand-400">
                  Load sample
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden bg-slate-900/40">
            <JsonInput
              value={input}
              onChange={setInput}
              errorLine={parsed.error?.line}
              placeholder='Paste JSON here, or drag & drop a file...\n\nTry: {"hello": "world", "numbers": [1, 2, 3]}'
            />
          </div>
        </div>

        {/* Toolbar / Divider */}
        <div className="lg:w-[1px] lg:h-auto h-[1px] bg-slate-700/30 shrink-0" />

        {/* Output Panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <Toolbar
            onFormat={handleFormat}
            onMinify={handleMinify}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onUpload={setInput}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            outputTab={outputTab}
            onOutputTabChange={setOutputTab}
            copied={copied}
            isValid={parsed.success}
            hasContent={input.trim().length > 0}
            stats={stats}
          />

          <div className="flex-1 min-h-0 overflow-hidden bg-slate-900/20">
            {!input.trim() ? (
              <EmptyState />
            ) : viewMode === 'diff' ? (
              <div className="flex flex-col h-full">
                <div className="p-2 border-b border-slate-700/30">
                  <textarea
                    value={diffInput}
                    onChange={(e) => setDiffInput(e.target.value)}
                    placeholder="Paste second JSON here to compare..."
                    className="w-full h-20 bg-slate-800/50 text-slate-300 font-mono text-[12px] p-2 rounded-lg outline-none resize-none border border-slate-700/30 placeholder-slate-600"
                    spellCheck={false}
                  />
                </div>
                <DiffView left={parsed.success ? parsed.data : null} right={diffParsed.success ? diffParsed.data : null} />
              </div>
            ) : viewMode === 'tree' && parsed.success ? (
              <div className="flex flex-col h-full">
                <div className="px-3 py-2 border-b border-slate-700/30">
                  <input
                    value={treeSearch}
                    onChange={(e) => setTreeSearch(e.target.value)}
                    placeholder="Search keys..."
                    className="w-full bg-slate-800/50 text-slate-300 text-[12px] px-3 py-1.5 rounded-lg outline-none border border-slate-700/30 placeholder-slate-600 focus:border-brand-500/50 transition-colors"
                  />
                </div>
                <JsonTreeView data={parsed.data} searchQuery={treeSearch} />
              </div>
            ) : (
              <FormattedOutput content={formatted} isDark={isDark} />
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="glass border-t border-slate-700/50 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-500 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span>JsonForge v1.0.0</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">{viewMode === 'formatted' ? outputTab.toUpperCase() : viewMode}</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Indent: {indent} spaces</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">Ctrl+Enter format · Ctrl+L clear</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Built with care by</span>
          <a
            href="https://github.com/thesajidalam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            @thesajidalam
          </a>
        </div>
      </footer>
    </div>
  );
}

function FormattedOutput({ content, isDark }: { content: string; isDark: boolean }) {
  return (
    <div className="h-full overflow-auto p-4">
      <pre className="font-mono text-[13px] leading-5 whitespace-pre-wrap break-all">
        {content.split('\n').map((line, i) => (
          <div key={i} className="flex">
            <span className="w-10 shrink-0 text-right pr-3 text-slate-600 select-none text-[11px]">
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
  const parts: { text: string; color: string }[] = [];
  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    // Leading whitespace
    const wsMatch = remaining.match(/^(\s+)/);
    if (wsMatch) {
      parts.push({ text: wsMatch[1], color: '' });
      remaining = remaining.slice(wsMatch[1].length);
      continue;
    }

    // String (key or value)
    if (remaining[0] === '"') {
      const endQuote = findStringEnd(remaining);
      const str = remaining.slice(0, endQuote + 1);
      remaining = remaining.slice(endQuote + 1);

      // Check if it's a key (followed by colon)
      const afterStr = remaining.trimStart();
      if (afterStr[0] === ':') {
        parts.push({ text: str, color: 'text-brand-300' });
      } else {
        parts.push({ text: str, color: 'text-emerald-400' });
      }
      continue;
    }

    // Number
    const numMatch = remaining.match(/^-?\d+\.?\d*([eE][+-]?\d+)?/);
    if (numMatch) {
      parts.push({ text: numMatch[0], color: 'text-amber-400' });
      remaining = remaining.slice(numMatch[0].length);
      continue;
    }

    // Boolean
    if (remaining.startsWith('true')) {
      parts.push({ text: 'true', color: 'text-purple-400' });
      remaining = remaining.slice(4);
      continue;
    }
    if (remaining.startsWith('false')) {
      parts.push({ text: 'false', color: 'text-purple-400' });
      remaining = remaining.slice(5);
      continue;
    }

    // Null
    if (remaining.startsWith('null')) {
      parts.push({ text: 'null', color: 'text-red-400' });
      remaining = remaining.slice(4);
      continue;
    }

    // Colon
    if (remaining[0] === ':') {
      parts.push({ text: ':', color: 'text-slate-400' });
      remaining = remaining.slice(1);
      continue;
    }

    // Brackets / braces / comma
    if (/[{}\[\],]/.test(remaining[0])) {
      parts.push({ text: remaining[0], color: 'text-slate-500' });
      remaining = remaining.slice(1);
      continue;
    }

    // Fallback
    parts.push({ text: remaining[0], color: 'text-slate-300' });
    remaining = remaining.slice(1);
  }

  return (
    <span>
      {parts.map((p, i) => (
        <span key={i} className={p.color}>{p.text}</span>
      ))}
    </span>
  );
}

function findStringEnd(str: string): number {
  let i = 1;
  while (i < str.length) {
    if (str[i] === '\\') { i += 2; continue; }
    if (str[i] === '"') return i;
    i++;
  }
  return str.length - 1;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-fire-500/20 flex items-center justify-center mb-6 border border-brand-500/10">
        <span className="text-4xl font-mono font-bold gradient-text">{'{}'}</span>
      </div>
      <h2 className="text-xl font-bold text-slate-200 mb-2">
        Paste your JSON
      </h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        Drop your JSON in the input panel, and JsonForge will instantly format, validate, and transform it.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">Format</span>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">Minify</span>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">Validate</span>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">Tree View</span>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">CSV</span>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">YAML</span>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">TypeScript</span>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700/50">Diff</span>
      </div>
    </div>
  );
}

function countKeys(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) return data.reduce<number>((sum, item) => sum + countKeys(item), 0);
  const obj = data as Record<string, unknown>;
  return Object.keys(obj).length + Object.values(obj).reduce<number>((sum, val) => sum + countKeys(val), 0);
}

function getDepth(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  if (Array.isArray(data)) return 1 + Math.max(0, ...data.map(getDepth));
  const obj = data as Record<string, unknown>;
  return 1 + Math.max(0, ...Object.values(obj).map(getDepth));
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
