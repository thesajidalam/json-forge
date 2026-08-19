export interface TreeNode {
  key: string;
  value: unknown;
  type: string;
  path: string;
  depth: number;
  isLast: boolean;
  childCount?: number;
  children?: TreeNode[];
}

export function buildTree(data: unknown, key: string = 'root', path: string = '$', depth: number = 0): TreeNode {
  const type = data === null ? 'null' : Array.isArray(data) ? 'array' : typeof data;

  const node: TreeNode = {
    key,
    value: data,
    type,
    path,
    depth,
    isLast: true,
  };

  if (type === 'object' && data !== null) {
    const entries = Object.entries(data as Record<string, unknown>);
    node.childCount = entries.length;
    node.children = entries.map(([k, v], i) => {
      const childPath = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? `${path}.${k}` : `${path}["${k}"]`;
      const child = buildTree(v, k, childPath, depth + 1);
      child.isLast = i === entries.length - 1;
      return child;
    });
  } else if (type === 'array' && Array.isArray(data)) {
    node.childCount = data.length;
    node.children = data.map((item, i) => {
      const childPath = `${path}[${i}]`;
      const child = buildTree(item, String(i), childPath, depth + 1);
      child.isLast = i === data.length - 1;
      return child;
    });
  }

  return node;
}
