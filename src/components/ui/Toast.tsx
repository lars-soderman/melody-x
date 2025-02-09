'use client';
import { useTranslations } from '@/hooks/useTranslations';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type ToastType = 'error' | 'success' | 'info';

// TODO: Add more error messages
// not_authenticated

export const Toast = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  const error = searchParams.get('error');
  const success = searchParams.get('success');
  const info = searchParams.get('info');

  const type: ToastType = error ? 'error' : success ? 'success' : 'info';

  const displayMessage = error
    ? error === 'not_authenticated'
      ? t.auth.error
      : error
    : success
      ? success
      : info;

  useEffect(() => {
    if (displayMessage) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        window.history.replaceState({}, '', window.location.pathname);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [displayMessage]);

  if (!isVisible || !displayMessage) return null;

  const textColor = {
    error: 'text-red-600',
    success: 'text-green-600',
    info: 'text-blue-600',
  }[type];

  return (
    <div
      className={`fixed left-1/2 top-4 -translate-x-1/2 transform rounded-lg bg-white px-6 py-3 shadow-lg transition-opacity duration-300 ${textColor}`}
    >
      {displayMessage}
    </div>
  );
};
