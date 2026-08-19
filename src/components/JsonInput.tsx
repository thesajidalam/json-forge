import { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  errorLine?: number;
  placeholder?: string;
}

export default function JsonInput({ value, onChange, errorLine, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const lineNums = lineNumbersRef.current;
    if (!textarea || !lineNums) return;

    const sync = () => {
      lineNums.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener('scroll', sync);
    return () => textarea.removeEventListener('scroll', sync);
  }, []);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 20);

  return (
    <div className="relative flex-1 flex overflow-hidden min-h-0">
      <div
        ref={lineNumbersRef}
        className="w-12 shrink-0 pt-4 pb-4 text-right pr-2 select-none overflow-hidden bg-slate-900/30 border-r border-slate-700/30"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i + 1}
            className={`text-[11px] leading-5 font-mono ${
              errorLine === i + 1
                ? 'text-red-400 font-bold'
                : 'text-slate-600'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Paste your JSON here...'}
        spellCheck={false}
        className="input-area !pl-3 font-mono text-[13px] leading-5"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}
