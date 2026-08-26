import { useMemo, useState, useCallback } from 'react';
import { buildTree, TreeNode } from '../utils/tree';

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
  const matchesSearch = searchQuery && searchQuery.length > 0 && node.key.toLowerCase().includes(searchQuery.toLowerCase());

  const valColor: Record<string, string> = {
    string: 'var(--syn-str)',
    number: 'var(--syn-num)',
    boolean: 'var(--syn-bool)',
    null: 'var(--syn-null)',
    object: 'var(--syn-key)',
    array: 'var(--syn-key)',
  };

  const bracket = node.type === 'array' ? ['[', ']'] : ['{', '}'];

  if (!isExpandable) {
    return (
      <div
        className="flex items-center gap-1 rounded px-1 -mx-1 transition-colors"
        style={matchesSearch
          ? { background: 'var(--jf-accent-bg)', boxShadow: `inset 0 0 0 1px var(--jf-accent-border)` }
          : {}
        }
        onMouseEnter={(e) => { if (!matchesSearch) e.currentTarget.style.background = 'var(--syn-hover)'; }}
        onMouseLeave={(e) => { if (!matchesSearch) e.currentTarget.style.background = 'transparent'; }}
      >
        {node.key !== 'root' && (
          <>
            <span style={{ color: 'var(--jf-text-secondary)' }}>{node.key}</span>
            <span style={{ color: 'var(--jf-text-muted)' }}>:</span>
          </>
        )}
        <span style={{ color: valColor[node.type] || 'var(--jf-text)' }}>
          {node.type === 'string' ? `"${String(node.value)}"` : String(node.value)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1 rounded px-1 -mx-1 w-full text-left transition-colors"
        style={matchesSearch
          ? { background: 'var(--jf-accent-bg)', boxShadow: `inset 0 0 0 1px var(--jf-accent-border)` }
          : {}
        }
        onMouseEnter={(e) => { if (!matchesSearch) e.currentTarget.style.background = 'var(--syn-hover)'; }}
        onMouseLeave={(e) => { if (!matchesSearch) e.currentTarget.style.background = 'transparent'; }}
      >
        <svg
          className={`w-3 h-3 shrink-0 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
          style={{ color: 'var(--jf-text-muted)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {node.key !== 'root' && (
          <>
            <span style={{ color: 'var(--jf-text-secondary)' }}>{node.key}</span>
            <span style={{ color: 'var(--jf-text-muted)' }}>:</span>
          </>
        )}
        <span style={{ color: 'var(--jf-text-muted)' }}>{bracket[0]}</span>
        {!expanded && (
          <>
            <span className="text-xs" style={{ color: 'var(--jf-text-muted)' }}>
              {node.childCount} {node.type === 'array' ? 'items' : 'keys'}
            </span>
            <span style={{ color: 'var(--jf-text-muted)' }}>{bracket[1]}</span>
          </>
        )}
      </button>
      {expanded && !isEmpty && (
        <div className="pl-4 ml-1.5" style={{ borderLeft: '1px solid var(--jf-border)' }}>
          {node.children?.map((child) => (
            <TreeNodeItem key={child.key} node={child} searchQuery={searchQuery} />
          ))}
        </div>
      )}
      {expanded && isEmpty && (
        <div className="pl-4 text-xs italic" style={{ color: 'var(--jf-text-muted)' }}>
          {node.type === 'array' ? 'empty array' : 'empty object'}
        </div>
      )}
      {expanded && <div className="ml-4" style={{ color: 'var(--jf-text-muted)' }}>{bracket[1]}</div>}
    </div>
  );
}
