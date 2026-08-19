export interface ParseError {
  message: string;
  line: number;
  column: number;
  position: number;
}

export interface ParseResult {
  success: boolean;
  data?: unknown;
  error?: ParseError;
}

export function parseJson(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, error: { message: 'Empty input', line: 1, column: 1, position: 0 } };
  }

  try {
    const data = JSON.parse(trimmed);
    return { success: true, data };
  } catch (e) {
    const err = e as SyntaxError;
    const match = err.message.match(/position\s+(\d+)/i);
    const pos = match ? parseInt(match[1], 10) : 0;
    const { line, column } = posToLineCol(trimmed, pos);
    return {
      success: false,
      error: { message: err.message, line, column, position: pos },
    };
  }
}

function posToLineCol(str: string, pos: number): { line: number; column: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < Math.min(pos, str.length); i++) {
    if (str[i] === '\n') { line++; col = 1; } else { col++; }
  }
  return { line, column: col };
}

export function formatJson(data: unknown, indent: number = 2): string {
  return JSON.stringify(data, null, indent);
}

export function minifyJson(data: unknown): string {
  return JSON.stringify(data);
}

export function validateJson(input: string): ParseResult {
  return parseJson(input);
}

export function getType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

export function getLength(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length;
  return 0;
}
