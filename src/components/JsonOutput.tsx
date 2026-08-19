import { useMemo, useState, useCallback } from 'react';
import { buildTree, TreeNode } from '../utils/tree';
import { getType, getLength } from '../utils/json';

interface Props {
  data: unknown;
  searchQuery?: string;
}

export default function JsonTreeView({ data, searchQuery }: Props) {
  const tree = useMemo(() => buildTree(data), [data]);

  return (
    <div className="p-4 overflow-auto flex-1 font-mono text-[13px] leading-6">
      <TreeNodeItem node={tree} searchQuery={searchQuery} />
    </div>
  );
}

function TreeNodeItem({ node, searchQuery }: { node: TreeNode; searchQuery?: string }) {
  const [expanded, setExpanded] = useState(node.depth < 2);

  const toggle = useCallback(() => setExpanded((p) => !p), []);

  const isExpandable = node.type === 'object' || node.type === 'array';
  const isEmpty = isExpandable && node.childCount === 0;
  const matchesSearch = searchQuery && node.key.toLowerCase().includes(searchQuery.toLowerCase());

  const typeColor: Record<string, string> = {
    string: 'text-emerald-400',
    number: 'text-amber-400',
    boolean: 'text-purple-400',
    null: 'text-red-400',
    object: 'text-brand-400',
    array: 'text-brand-300',
  };

  const bracket = node.type === 'array' ? ['[', ']'] : ['{', '}'];

  if (!isExpandable) {
    return (
      <div className="flex items-center gap-1 hover:bg-white/5 rounded px-1 -mx-1">
        {node.key !== 'root' && (
          <>
            <span className="text-slate-400">{node.key}</span>
            <span className="text-slate-600">:</span>
          </>
        )}
        <span className={typeColor[node.type] || 'text-slate-300'}>
          {node.type === 'string' ? `"${String(node.value)}"` : String(node.value)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={toggle}
        className={`flex items-center gap-1 hover:bg-white/5 rounded px-1 -mx-1 w-full text-left ${
          matchesSearch ? 'bg-brand-500/10 ring-1 ring-brand-500/30 rounded' : ''
        }`}
      >
        <svg
          className={`w-3 h-3 text-slate-500 shrink-0 transition-transform duration-150 ${
            expanded ? 'rotate-90' : ''
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {node.key !== 'root' && (
          <>
            <span className="text-slate-400">{node.key}</span>
            <span className="text-slate-600">:</span>
          </>
        )}
        <span className="text-slate-500">{bracket[0]}</span>
        {!expanded && (
          <>
            <span className="text-slate-600 text-xs">
              {node.childCount} {node.type === 'array' ? 'items' : 'keys'}
            </span>
            <span className="text-slate-500">{bracket[1]}</span>
          </>
        )}
      </button>
      {expanded && !isEmpty && (
        <div className="pl-4 border-l border-slate-700/40 ml-1.5">
          {node.children?.map((child) => (
            <TreeNodeItem key={child.key} node={child} searchQuery={searchQuery} />
          ))}
        </div>
      )}
      {expanded && isEmpty && (
        <div className="pl-4 text-slate-600 text-xs italic">
          {node.type === 'array' ? 'empty array' : 'empty object'}
        </div>
      )}
      {expanded && (
        <div className="text-slate-500 ml-4">{bracket[1]}</div>
      )}
    </div>
  );
}
