export type DiffKind = 'added' | 'removed' | 'modified' | 'unchanged';

export interface DiffEntry {
  path: string;
  kind: DiffKind;
  left?: unknown;
  right?: unknown;
}

export function diffJson(left: unknown, right: unknown, basePath: string = '$'): DiffEntry[] {
  const results: DiffEntry[] = [];
  compare(left, right, basePath, results);
  return results;
}

function compare(left: unknown, right: unknown, path: string, out: DiffEntry[]) {
  if (left === right) {
    out.push({ path, kind: 'unchanged', left, right });
    return;
  }

  if (left === null || left === undefined) {
    if (right === null || right === undefined) {
      out.push({ path, kind: 'unchanged', left, right });
    } else {
      out.push({ path, kind: 'added', left, right });
    }
    return;
  }

  if (right === null || right === undefined) {
    out.push({ path, kind: 'removed', left, right });
    return;
  }

  if (typeof left !== typeof right || Array.isArray(left) !== Array.isArray(right)) {
    out.push({ path, kind: 'modified', left, right });
    return;
  }

  if (typeof left !== 'object') {
    out.push({ path, kind: left === right ? 'unchanged' : 'modified', left, right });
    return;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= left.length) {
        out.push({ path: `${path}[${i}]`, kind: 'added', right: right[i] });
      } else if (i >= right.length) {
        out.push({ path: `${path}[${i}]`, kind: 'removed', left: left[i] });
      } else {
        compare(left[i], right[i], `${path}[${i}]`, out);
      }
    }
    return;
  }

  const leftObj = left as Record<string, unknown>;
  const rightObj = right as Record<string, unknown>;
  const allKeys = [...new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])];

  for (const key of allKeys) {
    const childPath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? `${path}.${key}` : `${path}["${key}"]`;
    if (!(key in leftObj)) {
      out.push({ path: childPath, kind: 'added', right: rightObj[key] });
    } else if (!(key in rightObj)) {
      out.push({ path: childPath, kind: 'removed', left: leftObj[key] });
    } else {
      compare(leftObj[key], rightObj[key], childPath, out);
    }
  }
}

export function countDiffs(entries: DiffEntry[]): { added: number; removed: number; modified: number } {
  return entries.reduce(
    (acc, e) => {
      if (e.kind === 'added') acc.added++;
      else if (e.kind === 'removed') acc.removed++;
      else if (e.kind === 'modified') acc.modified++;
      return acc;
    },
    { added: 0, removed: 0, modified: 0 }
  );
}
