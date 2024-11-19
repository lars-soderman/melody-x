export function FontSelector({
  value,
  onChange,
  id,
}: {
  id: string;
  onChange: (font: string) => void;
  value: string;
}) {
  return (
    <select
      className="rounded border p-1 text-sm"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="var(--font-default)">Default</option>
      <option value="var(--font-creepster)">Halloween</option>
    </select>
  );
}
