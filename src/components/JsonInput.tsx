import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  errorLine?: number;
  placeholder?: string;
}

const JsonInput = forwardRef<HTMLTextAreaElement, Props>(({ value, onChange, errorLine, placeholder }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => textareaRef.current!);

  useEffect(() => {
    const ta = textareaRef.current;
    const ln = lineNumbersRef.current;
    if (!ta || !ln) return;
    const sync = () => { ln.scrollTop = ta.scrollTop; };
    ta.addEventListener('scroll', sync);
    return () => ta.removeEventListener('scroll', sync);
  }, []);

  useEffect(() => {
    if (errorLine && textareaRef.current && lineNumbersRef.current) {
      const lineH = 22;
      lineNumbersRef.current.scrollTop = Math.max(0, (errorLine - 3) * lineH);
      textareaRef.current.scrollTop = Math.max(0, (errorLine - 3) * lineH);
    }
  }, [errorLine]);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 20);

  return (
    <div className="relative flex-1 flex overflow-hidden min-h-0">
      <div
        ref={lineNumbersRef}
        className="w-12 shrink-0 pt-4 pb-4 text-right pr-2 select-none overflow-hidden line-numbers-bg"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i + 1}
            className={errorLine === i + 1 ? 'line-num-error' : 'line-num'}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="input-area !pl-3 font-mono text-[13px] leading-[22px]"
        style={{ tabSize: 2 }}
      />
    </div>
  );
});

JsonInput.displayName = 'JsonInput';
export default JsonInput;
