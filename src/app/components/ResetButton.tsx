// put the reset button in this file

type ResetButtonProps = {
  isConfirming: boolean;
  onConfirmingChange: (isConfirming: boolean) => void;
  onReset: () => void;
};

export function ResetButton({
  isConfirming,
  onReset,
  onConfirmingChange,
}: ResetButtonProps) {
  return (
    <button
      className="w-10 rounded text-2xl text-gray-400 transition-colors hover:bg-gray-200"
      aria-label={
        isConfirming ? 'Confirm reset grid' : 'Reset grid to initial state'
      }
      onClick={(e) => {
        e.stopPropagation();
        if (isConfirming) {
          onReset();
          onConfirmingChange(false);
        } else {
          onConfirmingChange(true);
        }
      }}
    >
      {isConfirming ? '×' : '⟲'}
    </button>
  );
}
