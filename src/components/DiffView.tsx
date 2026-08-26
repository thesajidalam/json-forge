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
      <div className="flex items-center gap-3 px-4 py-2 text-[11px] shrink-0"
        style={{ borderBottom: '1px solid var(--jf-border)' }}>
        <span className="text-emerald-500 font-medium">+{counts.added} added</span>
        <span className="text-red-500 font-medium">-{counts.removed} removed</span>
        <span className="text-amber-500 font-medium">~{counts.modified} modified</span>
        <span className="ml-auto" style={{ color: 'var(--jf-text-muted)' }}>{entries.length} total paths</span>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-5">
        {visible.length === 0 ? (
          <div className="italic text-center py-12" style={{ color: 'var(--jf-text-muted)' }}>
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

  const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    added:    { bg: 'rgba(34, 197, 94, 0.06)', border: '#22c55e', text: '#22c55e', icon: '+' },
    removed:  { bg: 'rgba(239, 68, 68, 0.06)', border: '#ef4444', text: '#ef4444', icon: '−' },
    modified: { bg: 'rgba(234, 179, 8, 0.06)', border: '#eab308', text: '#eab308', icon: '~' },
    unchanged: { bg: '', border: '', text: '', icon: '' },
  };

  const c = colors[entry.kind];

  return (
    <div className="flex gap-2 py-1 px-2 rounded mb-1"
      style={{ background: c.bg, borderLeft: `2px solid ${c.border}` }}>
      <span className="w-4 text-center shrink-0 font-bold" style={{ color: c.text }}>{c.icon}</span>
      <span className="shrink-0 min-w-[100px] truncate text-[11px]" style={{ color: 'var(--jf-text-muted)' }}>{entry.path}</span>
      <span style={{ color: 'var(--jf-text-muted)' }}>→</span>
      <span className="truncate text-[12px]">
        {entry.kind === 'added' && <span style={{ color: '#22c55e' }}>{valStr(entry.right)}</span>}
        {entry.kind === 'removed' && <span style={{ color: '#ef4444' }} className="line-through opacity-70">{valStr(entry.left)}</span>}
        {entry.kind === 'modified' && (
          <span>
            <span style={{ color: '#ef4444' }} className="line-through opacity-60 mr-2">{valStr(entry.left)}</span>
            <span style={{ color: '#22c55e' }}>{valStr(entry.right)}</span>
          </span>
        )}
      </span>
    </div>
  );
}
