import { ArrowDown } from '@/components/ui/icons/arrowDown';
import { ArrowRight } from '@/components/ui/icons/arrowRight';
import { useState } from 'react';

type OptionsButtonProps = {
  onArrowDown: () => void;
  onArrowRight: () => void;
  onBlack: () => void;
  onHyphenBottom: () => void;
  onHyphenRight: () => void;
  onStopDown: () => void;
  onStopRight: () => void;
  onToggleHint: () => void;
};

export function OptionsButton({
  onArrowDown,
  onArrowRight,
  onBlack,
  onHyphenBottom,
  onHyphenRight,
  onStopDown,
  onStopRight,
  onToggleHint,
}: OptionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Show options"
        className={`rounded-1 absolute right-[2px] top-[2px] z-30 flex ${isOpen ? 'h-3' : 'h-6'} w-4 cursor-pointer items-center justify-center border-none bg-transparent text-xl text-gray-400 hover:text-gray-600`}
        title="Show options"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? '⋮' : '×'}
      </button>

      {isOpen && (
        <div className="absolute inset-0 z-20 bg-gray-800">
          {/* Arrow Down option */}
          <button
            aria-label="Add down arrow"
            className="absolute right-0 top-3 cursor-pointer p-1"
            title="Down arrow"
            onClick={() => {
              onArrowDown();
              setIsOpen(false);
            }}
          >
            <ArrowDown className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </button>

          {/* Stop Right option */}
          <button
            aria-label="Toggle right stop"
            className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 cursor-pointer bg-gray-400 hover:bg-gray-600"
            title="Right stop"
            onClick={() => {
              onStopRight();
              setIsOpen(false);
            }}
          />
          {/* Hyphen Right option */}
          <button
            aria-label="Toggle right hyphen"
            className="absolute -right-[2px] top-1/2 z-10 h-1 w-5 translate-x-1/2 bg-gray-400 hover:bg-gray-600"
            title="Right hyphen"
            onClick={() => {
              onHyphenRight();
              setIsOpen(false);
            }}
          />
          {/* Black square option */}
          <button
            aria-label="Toggle black square"
            className="absolute bottom-0 right-0 h-3 w-3 cursor-pointer rounded-sm bg-gray-400 hover:bg-gray-600"
            title="Black square"
            onClick={() => {
              onBlack();
              setIsOpen(false);
            }}
          />

          {/* Stop Bottom option */}
          <button
            aria-label="Toggle bottom stop"
            className="absolute bottom-0 left-1/2 h-1 w-6 -translate-x-1/2 cursor-pointer bg-gray-400 hover:bg-gray-600"
            title="Bottom stop"
            onClick={() => {
              onStopDown();
              setIsOpen(false);
            }}
          />
          {/* Hyphen Bottom option */}
          <button
            aria-label="Toggle bottom hyphen"
            className="absolute -bottom-[2px] left-1/2 z-10 h-5 w-1 translate-y-1/2 bg-gray-400 hover:bg-gray-600"
            title="Bottom hyphen"
            onClick={() => {
              onHyphenBottom();
              setIsOpen(false);
            }}
          />
          {/* Arrow Right option */}
          <button
            aria-label="Add right arrow"
            className="absolute bottom-0 left-0 cursor-pointer p-1"
            title="Right arrow"
            onClick={() => {
              onArrowRight();
              setIsOpen(false);
            }}
          >
            <ArrowRight className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </button>

          {/* Add hint option */}
          <button
            aria-label="Add hint number"
            className="absolute left-1 top-1 h-3 w-3 rounded-full border-2 border-gray-400 hover:border-gray-600"
            title="Add hint number"
            onClick={() => {
              onToggleHint();
              setIsOpen(false);
            }}
          ></button>
        </div>
      )}
    </>
  );
}
