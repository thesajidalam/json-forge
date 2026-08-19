export function jsonToCsv(data: unknown): string {
  let arr: Record<string, unknown>[];
  if (Array.isArray(data)) {
    arr = data as Record<string, unknown>[];
  } else if (typeof data === 'object' && data !== null) {
    arr = [data as Record<string, unknown>];
  } else {
    return String(data);
  }
  if (arr.length === 0) return '';

  const headers = [...new Set(arr.flatMap((r) => Object.keys(r)))];

  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return '';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.map(escape).join(',')];
  for (const row of arr) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

export function jsonToYaml(data: unknown, indent: number = 0): string {
  const prefix = '  '.repeat(indent);

  if (data === null) return `${prefix}null`;
  if (data === undefined) return `${prefix}null`;
  if (typeof data === 'boolean') return `${prefix}${data}`;
  if (typeof data === 'number') return `${prefix}${data}`;
  if (typeof data === 'string') {
    if (data.includes('\n') || data.includes(':') || data.includes('#') ||
        data.startsWith(' ') || data.startsWith('{') || data.startsWith('[') ||
        data === 'true' || data === 'false' || data === 'null' ||
        /^\d/.test(data) || /^\s*$/.test(data)) {
      const escaped = data.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `${prefix}"${escaped}"`;
    }
    return `${prefix}${data}`;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return `${prefix}[]`;
    const items = data.map((item) => {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const keys = Object.entries(item as Record<string, unknown>);
        if (keys.length === 0) return `${prefix}- {}`;
        const first = `${prefix}- ${keys[0][0]}: ${jsonToYaml(keys[0][1], indent + 2).trimStart()}`;
        const rest = keys.slice(1).map(([k, v]) => `${prefix}  ${k}: ${jsonToYaml(v, indent + 2).trimStart()}`);
        return [first, ...rest].join('\n');
      }
      return `${prefix}- ${jsonToYaml(item, indent + 1).trimStart()}`;
    });
    return items.join('\n');
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return `${prefix}{}`;
    const lines = entries.map(([key, val]) => {
      const safeKey = /[:\s#\[\]{}&*!|>'"%@`]/.test(key) || /^\d/.test(key) ? `"${key}"` : key;
      const formatted = jsonToYaml(val, indent + 1);
      if (typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val as Record<string, unknown>).length > 0) {
        return `${prefix}${safeKey}:\n${formatted}`;
      }
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
        return `${prefix}${safeKey}:\n${formatted}`;
      }
      return `${prefix}${safeKey}: ${formatted.trimStart()}`;
    });
    return lines.join('\n');
  }

  return `${prefix}${String(data)}`;
}

export function jsonToTypeScript(data: unknown, name: string = 'RootType', indent: number = 0): string {
  const prefix = '  '.repeat(indent);

  if (data === null) return `${prefix}null`;
  if (data === undefined) return `${prefix}unknown`;
  if (typeof data === 'boolean') return `${prefix}boolean`;
  if (typeof data === 'number') return `${prefix}number`;
  if (typeof data === 'string') return `${prefix}string`;

  if (Array.isArray(data)) {
    if (data.length === 0) return `${prefix}unknown[]`;
    const types = [...new Set(data.map((item) => jsonToTypeScript(item, '', indent + 1).trim()))];
    if (types.length === 1) return `${prefix}${types[0]}[]`;
    return `${prefix}(${types.join(' | ')})[]`;
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return `${prefix}Record<string, unknown>`;
    const lines = entries.map(([key, val]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      const valType = jsonToTypeScript(val, '', indent + 1).trimStart();
      return `${prefix}  ${safeKey}: ${valType};`;
    });
    return `{\n${lines.join('\n')}\n${prefix}}`;
  }

  return `${prefix}unknown`;
}

export function generateInterfaces(data: unknown, name: string = 'Root'): string {
  const interfaces: string[] = [];

  function walk(val: unknown, typeName: string) {
    if (val === null || val === undefined || typeof val !== 'object') return;
    if (Array.isArray(val)) {
      if (val.length > 0 && typeof val[0] === 'object' && val[0] !== null && !Array.isArray(val[0])) {
        walk(val[0], typeName + 'Item');
      }
      return;
    }

    const entries = Object.entries(val as Record<string, unknown>);
    const lines: string[] = [];
    const childTypes: { key: string; type: string }[] = [];

    for (const [key, v] of entries) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;

      if (v === null) { lines.push(`  ${safeKey}: null;`); continue; }
      if (typeof v === 'boolean') { lines.push(`  ${safeKey}: boolean;`); continue; }
      if (typeof v === 'number') { lines.push(`  ${safeKey}: number;`); continue; }
      if (typeof v === 'string') { lines.push(`  ${safeKey}: string;`); continue; }

      if (Array.isArray(v)) {
        if (v.length === 0) { lines.push(`  ${safeKey}: unknown[];`); continue; }
        const childName = capitalize(key) + 'Item';
        const first = v[0];
        if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
          walk(first, childName);
          lines.push(`  ${safeKey}: ${childName}[];`);
        } else {
          const t = typeof first === 'boolean' ? 'boolean' : typeof first === 'number' ? 'number' : typeof first === 'string' ? 'string' : 'unknown';
          lines.push(`  ${safeKey}: ${t}[];`);
        }
        continue;
      }

      if (typeof v === 'object') {
        const childName = capitalize(key);
        walk(v, childName);
        lines.push(`  ${safeKey}: ${childName};`);
        continue;
      }

      lines.push(`  ${safeKey}: unknown;`);
    }

    childTypes.forEach((c) => lines.push(`  ${c.key}: ${c.type};`));
    interfaces.push(`interface ${typeName} {\n${lines.join('\n')}\n}`);
  }

  walk(data, name);
  return interfaces.join('\n\n');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
