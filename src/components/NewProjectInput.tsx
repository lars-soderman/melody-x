import React, { useState } from 'react';

type NewProjectInputProps = {
  className?: string;
  onSubmit: (name: string) => boolean; // Return false if duplicate
};

export function NewProjectInput({ className, onSubmit }: NewProjectInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onSubmit(name.trim());
    if (!success) {
      setError(true);
      return;
    }
    setName('');
    setError(false);
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <input
        aria-invalid={error}
        placeholder="New project name..."
        type="text"
        value={name}
        className={`w-full rounded border px-3 py-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onChange={(e) => {
          setName(e.target.value);
          setError(false);
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          A project with this name already exists
        </p>
      )}
    </form>
  );
}
