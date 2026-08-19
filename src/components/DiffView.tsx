import { useMemo } from 'react';
import { diffJson, countDiffs, DiffEntry } from '../utils/diff';

interface Props {
  left: unknown;
  right: unknown;
}

export default function DiffView({ left, right }: Props) {
  const entries = useMemo(() => diffJson(left, right), [left, right]);
  const counts = useMemo(() => countDiffs(entries), [entries]);
  const visible = entries.filter((e) => e.kind !== 'unchanged');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 text-[11px] border-b border-slate-200 dark:border-slate-700/30 shrink-0 bg-white dark:bg-transparent">
        <span className="text-emerald-600 dark:text-emerald-400">+{counts.added} added</span>
        <span className="text-red-600 dark:text-red-400">-{counts.removed} removed</span>
        <span className="text-amber-600 dark:text-amber-400">~{counts.modified} modified</span>
        <span className="text-slate-400 dark:text-slate-600 ml-auto">{entries.length} total paths</span>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-5">
        {visible.length === 0 ? (
          <div className="text-slate-400 dark:text-slate-500 italic text-center py-12">
            {entries.length === 0
              ? 'Paste JSON in both panels to compare.'
              : 'No differences — both inputs are identical.'
            }
          </div>
        ) : (
          visible.map((entry, i) => <DiffRow key={i} entry={entry} />)
        )}
      </div>
    </div>
  );
}

function DiffRow({ entry }: { entry: DiffEntry }) {
  const valStr = (v: unknown): string => {
    if (v === undefined) return '';
    return typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
  };

  const styles: Record<string, { bg: string; border: string; icon: string; iconColor: string }> = {
    added: { bg: 'bg-emerald-50 dark:bg-emerald-500/5', border: 'border-emerald-300 dark:border-emerald-500/30', icon: '+', iconColor: 'text-emerald-500 dark:text-emerald-400' },
    removed: { bg: 'bg-red-50 dark:bg-red-500/5', border: 'border-red-300 dark:border-red-500/30', icon: '−', iconColor: 'text-red-500 dark:text-red-400' },
    modified: { bg: 'bg-amber-50 dark:bg-amber-500/5', border: 'border-amber-300 dark:border-amber-500/30', icon: '~', iconColor: 'text-amber-500 dark:text-amber-400' },
    unchanged: { bg: '', border: '', icon: '', iconColor: '' },
  };

  const s = styles[entry.kind];

  return (
    <div className={`flex gap-2 py-1 px-2 rounded border-l-2 ${s.bg} ${s.border} mb-1`}>
      <span className={`w-4 text-center shrink-0 font-bold ${s.iconColor}`}>{s.icon}</span>
      <span className="text-slate-500 dark:text-slate-400 shrink-0 min-w-[100px] truncate text-[11px]">{entry.path}</span>
      <span className="text-slate-300 dark:text-slate-600 mx-0.5">→</span>
      <span className="truncate text-[12px]">
        {entry.kind === 'added' && <span className="text-emerald-700 dark:text-emerald-400">{valStr(entry.right)}</span>}
        {entry.kind === 'removed' && <span className="text-red-700 dark:text-red-400 line-through opacity-70">{valStr(entry.left)}</span>}
        {entry.kind === 'modified' && (
          <span>
            <span className="text-red-600 dark:text-red-400 line-through opacity-60 mr-2">{valStr(entry.left)}</span>
            <span className="text-emerald-700 dark:text-emerald-400">{valStr(entry.right)}</span>
          </span>
        )}
      </span>
    </div>
  );
}
