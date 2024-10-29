import { useState } from 'react';
import { ArrowDown } from '../icons/arrowDown';
import { ArrowRight } from '../icons/arrowRight';

type OptionsButtonProps = {
  onArrowDown: () => void;
  onArrowRight: () => void;
  onBlack: () => void;
  onStopBottom: () => void;
  onStopRight: () => void;
  onHint: () => void;
  onStop: () => void;
};

export function OptionsButton(props: OptionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="rounded-2 absolute right-[2px] top-[2px] z-20 flex h-6 w-4 cursor-pointer items-center justify-center border-none bg-transparent text-xl font-bold hover:bg-gray-100 active:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Show options"
      >
        {!isOpen ? '⋮' : '╳'}
      </button>

      {isOpen && (
        <div className="absolute inset-0 z-10">
          {/* Black square option */}
          <button
            onClick={() => {
              props.onBlack();
              setIsOpen(false);
            }}
            className="absolute left-1 top-1 h-3 w-3 cursor-pointer rounded-sm bg-gray-400 hover:bg-gray-600"
            aria-label="Toggle black square"
          />

          {/* Arrow Down option */}
          <button
            onClick={() => {
              props.onArrowDown();
              setIsOpen(false);
            }}
            className="absolute right-0 top-1/4 cursor-pointer p-1"
            aria-label="Add down arrow"
          >
            <ArrowDown className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </button>

          {/* Arrow Right option */}
          <button
            onClick={() => {
              props.onArrowRight();
              setIsOpen(false);
            }}
            className="absolute bottom-0 left-0 cursor-pointer p-1"
            aria-label="Add right arrow"
          >
            <ArrowRight className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </button>

          {/* Stop Bottom option */}
          <button
            onClick={() => {
              props.onStopBottom();
              setIsOpen(false);
            }}
            className="absolute bottom-0 left-1/2 h-1 w-6 -translate-x-1/2 cursor-pointer bg-gray-400 hover:bg-gray-600"
            aria-label="Toggle bottom stop"
          />

          {/* Stop Right option */}
          <button
            onClick={() => {
              props.onStopRight();
              setIsOpen(false);
            }}
            className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 cursor-pointer bg-gray-400 hover:bg-gray-600"
            aria-label="Toggle right stop"
          />
        </div>
      )}
    </>
  );
}
