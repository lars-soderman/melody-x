import { useEffect } from 'react';

type ToastProps = {
  duration?: number;
  message: string;
  onClose: () => void;
};

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed right-1/2 top-4 z-50 flex translate-x-1/2 items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white shadow-lg">
      <svg
        className="h-4 w-4 text-green-400"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
