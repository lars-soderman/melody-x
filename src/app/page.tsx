"use client";

import { useState } from "react";

type Box = {
  id: string;
  letter: string | null;
  // onClick: () => void;
  row: number;
  col: number;
};

const Box = ({ letter, onClick, id }: Box) => {
  return (
    <button
      key={id}
      onClick={onClick}
      className="border-2 border-black w-16 h-16 text-black text-center flex items-center text-4xl justify-center"
    >
      <p>{letter}</p>
    </button>
  );
};

const existingIds = new Set<string>();

const createBox = (letter: string | null) => {
  let id;
  do {
    id = generateGUID();
  } while (existingIds.has(id));
  existingIds.add(id);

  return {
    letter,
    onClick: () => {},
    id,
  };
};

const generateGUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const initialBox: Box = {
  letter: null,
  onClick: () => {},
  id: generateGUID(),
};

type Grid = Box[][];

const gridSize = (grid: Grid) => ({
  rows: grid.length,
  columns: grid[0].length,
});

const getGridColumnsClass = (columns: number) => {
  return `grid-cols-${columns}`;
};

export default function Home() {
  const [grid, setGrid] = useState<Grid>([[initialBox]]);
  const [editingBox, setEditingBox] = useState<Box | null>(null);

  const addRow = () => {
    const newRow = Array.from({ length: gridSize(grid).columns }, () =>
      createBox(null)
    );
    setGrid([...grid, newRow]); // Add the new row at the bottom
  };

  const addRowTop = () => {
    const newRow = Array.from({ length: gridSize(grid).columns }, () =>
      createBox(null)
    );
    setGrid((prevGrid) => [newRow, ...prevGrid]); // Add the new row at the top
  };

  const addColumn = () => {
    setGrid(grid.map((row) => [...row, createBox(null)])); // Add a new box to the right of each row
  };

  const addColumnLeft = () => {
    setGrid(grid.map((row) => [createBox(null), ...row])); // Add a new box to the left of each row
  };

  const updateBoxLetter = (id: string, newLetter: string) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const boxToUpdate = newGrid.flat().find((box) => box?.id === id);
      if (boxToUpdate) {
        boxToUpdate.letter = newLetter.toUpperCase(); // Convert to uppercase before saving
      }
      return newGrid;
    });
    setEditingBox(null);
  };

  type BoxInputProps = { letter: string | null; id: string };

  const BoxInput = ({ letter, id }: BoxInputProps) => {
    return (
      <input
        autoFocus
        key={id}
        onFocus={(e) => e.target.select()} // Automatically select the text on focus
        onChange={(e) => updateBoxLetter(id, e.target.value)}
        className="border-2 border-black w-16 h-16 text-black text-center flex items-center justify-center text-3xl"
        value={letter ?? ""}
      />
    );
  };

  const addRowAndColumnTopLeft = () => {
    addRowTop(); // Add a row at the top
    addColumnLeft(); // Add a column to the left
  };

  const addRowAndColumnTopRight = () => {
    addRowTop(); // Add a row at the top
    addColumn(); // Add a column to the right
  };

  const addRowAndColumnBottomLeft = () => {
    addRow(); // Add a row at the bottom
    addColumnLeft(); // Add a column to the left
  };

  const addRowAndColumnBottomRight = () => {
    addRow(); // Add a row at the bottom
    addColumn(); // Add a column to the right
  };

  return (
    <main className="absolute inset-0 bg-white text-black flex flex-col items-center justify-center">
      <div className="flex relative">
        <div
          className={`grid w-full ${getGridColumnsClass(
            gridSize(grid).columns
          )} gap-0 border-collapse border-2 border-black`}
        >
          {grid.map((row) =>
            row.map((box) =>
              editingBox?.id === box.id ? (
                <BoxInput key={box.id} id={box.id} letter={box.letter} />
              ) : (
                <Box
                  key={box.id}
                  id={box.id}
                  letter={box.letter}
                  onClick={() => setEditingBox(box)}
                />
              )
            )
          )}
        </div>

        {/* Individual Buttons */}
        <button
          onClick={addRowTop} // Add row at the top
          className="absolute text-2xl bg-slate-50 -translate-x-1/2 left-1/2 h-10 -top-12 rounded w-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={addColumnLeft} // Add column to the left
          className="absolute text-2xl bg-slate-50 top-1/2 -translate-y-1/2 w-10 -left-12 rounded h-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={addRow} // Add row at the bottom
          className="absolute text-2xl bg-slate-50 -translate-x-1/2 left-1/2 h-10 -bottom-12 rounded w-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={addColumn} // Add column to the right
          className="absolute text-2xl bg-slate-50 top-1/2 -translate-y-1/2 w-10 -right-12 rounded h-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>

        {/* Corner Buttons */}
        <button
          onClick={addRowAndColumnTopLeft} // Add row at the top and column to the left
          className="absolute text-2xl bg-slate-50 -left-12 h-10 -top-12 rounded w-10 opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={addRowAndColumnTopRight} // Add row at the top and column to the right
          className="absolute text-2xl bg-slate-50 -right-12 h-10 -top-12 rounded w-10 opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={addRowAndColumnBottomLeft} // Add row at the bottom and column to the left
          className="absolute text-2xl bg-slate-50 -left-12 h-10 -bottom-12 rounded w-10 opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={addRowAndColumnBottomRight} // Add row at the bottom and column to the right
          className="absolute text-2xl bg-slate-50 -right-12 h-10 -bottom-12 rounded w-10 opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
      </div>
    </main>
  );
}
