import { Hint } from '@/types';

type HintNotepadProps = {
  hint: Hint;
  onRemove: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
};

export function HintNotepad({
  hint,
  onTextChange,
  onRemove,
}: HintNotepadProps) {
  return (
    <div
      className="fixed bottom-4 right-4 w-80 rounded-lg bg-yellow-50 p-4 shadow-lg transition-all duration-200"
      style={{
        backgroundImage:
          'repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)',
        boxShadow: '3px 3px 10px rgba(0,0,0,0.1)',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-gray-700">
            #{hint.number}
          </span>
          <span className="text-sm text-gray-500">
            {hint.direction}, {hint.length} letters
          </span>
        </div>
        <button
          className="rounded-full p-1 text-gray-400 hover:bg-yellow-100 hover:text-gray-600"
          title="Remove hint"
          onClick={() => onRemove(hint.id)}
        >
          ×
        </button>
      </div>
      <textarea
        className="w-full bg-transparent p-2 text-gray-700 focus:outline-none"
        placeholder="Enter your hint here..."
        rows={4}
        value={hint.text}
        style={{
          lineHeight: '32px',
          background: 'transparent',
          border: 'none',
          resize: 'vertical',
        }}
        onChange={(e) => onTextChange(hint.id, e.target.value)}
      />
    </div>
  );
}
