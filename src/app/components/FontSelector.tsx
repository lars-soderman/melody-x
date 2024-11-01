export function FontSelector({
  value,
  onChange,
}: {
  onChange: (font: string) => void;
  value: string;
}) {
  return (
    <select
      className="rounded border p-1 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="var(--font-default)">Default</option>
      <option value="var(--font-creepster)">Creepster</option>
    </select>
  );
}
