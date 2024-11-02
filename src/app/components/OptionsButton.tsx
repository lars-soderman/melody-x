import { useState } from 'react';
import { ArrowDown } from '../icons/arrowDown';
import { ArrowRight } from '../icons/arrowRight';

type OptionsButtonProps = {
  onArrowDown: () => void;
  onArrowRight: () => void;
  onBlack: () => void;
  onStopBottom: () => void;
  onStopRight: () => void;
  toggleHint: () => void;
};

export function OptionsButton(props: OptionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Show options"
        className={`rounded-2 absolute right-[2px] top-[2px] z-20 flex ${isOpen ? 'h-3' : 'h-6'} w-4 cursor-pointer items-center justify-center border-none bg-transparent text-xl font-bold hover:bg-gray-100 active:bg-gray-200`}
        title="Show options"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? '⋮' : '╳'}
      </button>

      {isOpen && (
        <div className="absolute inset-0 z-10">
          {/* Arrow Down option */}
          <button
            aria-label="Add down arrow"
            className="absolute right-0 top-[20%] cursor-pointer p-1"
            title="Add down arrow"
            onClick={() => {
              props.onArrowDown();
              setIsOpen(false);
            }}
          >
            <ArrowDown className="h-3 w-3 text-gray-400 hover:text-gray-600" />
          </button>

          {/* Stop Right option */}
          <button
            aria-label="Toggle right stop"
            className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 cursor-pointer bg-gray-400 hover:bg-gray-600"
            title="Toggle right stop"
            onClick={() => {
              props.onStopRight();
              setIsOpen(false);
            }}
          />
          {/* Black square option */}
          <button
            aria-label="Toggle black square"
            className="absolute bottom-0 right-0 h-3 w-3 cursor-pointer rounded-sm bg-gray-400 hover:bg-gray-600"
            title="Toggle black square"
            onClick={() => {
              props.onBlack();
              setIsOpen(false);
            }}
          />

          {/* Stop Bottom option */}
          <button
            aria-label="Toggle bottom stop"
            className="absolute bottom-0 left-1/2 h-1 w-6 -translate-x-1/2 cursor-pointer bg-gray-400 hover:bg-gray-600"
            title="Toggle bottom stop"
            onClick={() => {
              props.onStopBottom();
              setIsOpen(false);
            }}
          />
          {/* Arrow Right option */}
          <button
            aria-label="Add right arrow"
            className="absolute bottom-0 left-0 cursor-pointer p-1"
            title="Add right arrow"
            onClick={() => {
              props.onArrowRight();
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
              props.toggleHint();
              setIsOpen(false);
            }}
          ></button>
        </div>
      )}
    </>
  );
}
