import { CrosswordGrid } from '@/app/components/CrosswordGrid';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('CrosswordGrid', () => {
  const mockProps = {
    boxSize: 64,
    boxes: [
      { row: 0, col: 0, letter: 'A' },
      { row: 0, col: 1, letter: 'B' },
    ],
    grid: [
      [
        { row: 0, col: 0, letter: 'A' },
        { row: 0, col: 1, letter: 'B' },
      ],
    ],
    editingBox: null,
    font: 'var(--font-default)',
    confirmingRemove: null,
    minCol: 0,
    maxCol: 1,
    minRow: 0,
    maxRow: 0,
    onLetterChange: jest.fn(),
    onNavigate: jest.fn(),
    onSetEditingBox: jest.fn(),
    onUpdateArrow: jest.fn(),
    onToggleBlack: jest.fn(),
    onUpdateStop: jest.fn(),
    toggleHint: jest.fn(),
    handleRemoveColumn: jest.fn(),
    handleRemoveRow: jest.fn(),
    onToggleArrowDown: jest.fn(),
    onToggleArrowRight: jest.fn(),
  };

  it('renders grid cells', () => {
    render(<CrosswordGrid {...mockProps} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
