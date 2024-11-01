import { ReactNode, useEffect, useRef } from 'react';

type PopoverProps = {
  align?: 'start' | 'end';
  children: ReactNode;
  focusTrap?: boolean;
  isOpen: boolean;
  onClose: () => void;
  position?: 'top' | 'right';
  trigger: ReactNode;
};

export function Popover({
  align = 'end',
  children,
  focusTrap = false,
  isOpen,
  onClose,
  position = 'top',
  trigger,
}: PopoverProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!focusTrap || !isOpen) return;

    function handleFocusTrap(e: KeyboardEvent) {
      if (!menuRef.current || e.key !== 'Tab') return;

      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [focusTrap, isOpen]);

  return (
    <div
      ref={menuRef}
      className="relative"
      onBlur={(e) => {
        if (!focusTrap && !menuRef.current?.contains(e.relatedTarget as Node)) {
          onClose();
        }
      }}
    >
      {trigger}
      {isOpen && (
        <div
          className={`absolute z-20 min-w-[300px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg ${
            position === 'top'
              ? `${align === 'end' ? 'right-0' : 'left-0'} top-8`
              : 'left-8 top-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
