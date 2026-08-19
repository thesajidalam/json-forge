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

  const kindStyle: Record<string, string> = {
    added: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    removed: 'bg-red-500/10 border-red-500/30 text-red-300',
    modified: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    unchanged: '',
  };

  const kindIcon: Record<string, string> = {
    added: '+',
    removed: '-',
    modified: '~',
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 text-[11px] border-b border-slate-700/30 shrink-0">
        <span className="text-emerald-400">+{counts.added} added</span>
        <span className="text-red-400">-{counts.removed} removed</span>
        <span className="text-amber-400">~{counts.modified} modified</span>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-5">
        {visible.length === 0 ? (
          <div className="text-slate-500 italic text-center py-8">
            No differences found — both inputs are identical.
          </div>
        ) : (
          visible.map((entry, i) => (
            <DiffRow key={i} entry={entry} style={kindStyle[entry.kind]} icon={kindIcon[entry.kind]} />
          ))
        )}
      </div>
    </div>
  );
}

function DiffRow({ entry, style, icon }: { entry: DiffEntry; style: string; icon: string }) {
  const valStr = (v: unknown) => {
    if (v === undefined) return '';
    return typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
  };

  return (
    <div className={`flex gap-2 py-0.5 px-2 rounded border-l-2 ${style} mb-0.5`}>
      <span className="w-4 text-center shrink-0 opacity-60 font-bold">{icon}</span>
      <span className="text-slate-400 shrink-0 min-w-[120px] truncate">{entry.path}</span>
      <span className="text-slate-500 mx-1">→</span>
      <span className="truncate">
        {entry.kind === 'added' && valStr(entry.right)}
        {entry.kind === 'removed' && valStr(entry.left)}
        {entry.kind === 'modified' && (
          <span>
            <span className="text-red-400 line-through mr-2">{valStr(entry.left)}</span>
            <span className="text-emerald-400">{valStr(entry.right)}</span>
          </span>
        )}
      </span>
    </div>
  );
}
