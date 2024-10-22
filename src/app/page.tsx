"use client";
import { useState } from "react";

type Box = {
  letter: string | null;
  row: number;
  col: number;
};

type ShowBoxProps = Box & {
  onClick: () => void;
  id: string;
};

const ShowBox = ({ letter, onClick, id }: ShowBoxProps) => {
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

const getId = (row: number, col: number) => {
  return `box-row-${row}-col-${col}`;
};

const initialBoxes: Box[] = [
  {
    letter: null,
    row: 0,
    col: 0,
  },
  {
    letter: null,
    row: 0,
    col: 1,
  },
  {
    letter: null,
    row: 1,
    col: 0,
  },
  {
    letter: null,
    row: 1,
    col: 1,
  },
];

// Utility to get minimum and maximum rows and columns
const getMaxRow = (boxes: Box[]) => Math.max(...boxes.map((box) => box.row));
const getMaxCol = (boxes: Box[]) => Math.max(...boxes.map((box) => box.col));
const getMinRow = (boxes: Box[]) => Math.min(...boxes.map((box) => box.row));
const getMinCol = (boxes: Box[]) => Math.min(...boxes.map((box) => box.col));

const stepsBetween = (num1: number, num2: number) => {
  return Math.abs(num1 - num2) + 1;
};

const toGrid = (
  boxes: Box[],
  minRow: number,
  maxRow: number,
  minCol: number,
  maxCol: number
): Box[][] => {
  const rowCount = stepsBetween(maxRow, minRow);
  const colCount = stepsBetween(maxCol, minCol);

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = minRow + rowIndex;
    return Array.from({ length: colCount }, (_, colIndex) => {
      const col = minCol + colIndex;
      return (
        boxes.find((b) => b.row === row && b.col === col) || {
          letter: null,
          row,
          col,
        }
      );
    });
  });
};

type BoxInputProps = {
  letter: string | null;
  id: string;
  onChange: (id: string, letter: string) => void;
};

const BoxInput = ({ letter, id, onChange }: BoxInputProps) => {
  return (
    <input
      autoFocus
      key={id}
      onFocus={(e) => e.target.select()} // Automatically select the text on focus
      onChange={(e) => onChange(id, e.target.value)}
      className="border-2 border-black w-16 h-16 text-black text-center flex items-center justify-center text-3xl"
      value={letter ?? ""}
    />
  );
};

const getGridColumnsClass = (numColumns: number) => {
  return `grid-cols-${numColumns}`;
};

export default function Home() {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [editingBox, setEditingBox] = useState<Box | null>(null);

  const minRow = getMinRow(boxes);
  const maxRow = getMaxRow(boxes);
  const minCol = getMinCol(boxes);
  const maxCol = getMaxCol(boxes);

  const grid = toGrid(boxes, minRow, maxRow, minCol, maxCol);

  const addRow = (position: "top" | "bottom") => {
    const newRowIndex = position === "top" ? minRow - 1 : maxRow + 1;
    console.log("newRowIndex", newRowIndex);
    const newRow = Array.from(
      { length: stepsBetween(maxCol, minCol) },
      (_, colIndex) => ({
        letter: null,
        row: newRowIndex,
        col: colIndex,
      })
    );
    setBoxes((prevBoxes) => [...prevBoxes, ...newRow]);
  };

  const addColumn = (position: "left" | "right") => {
    const newColIndex = position === "left" ? minCol - 1 : maxCol + 1;
    const newCol = Array.from(
      { length: stepsBetween(maxRow, minRow) },
      (_, rowIndex) => ({
        letter: null,
        row: rowIndex,
        col: newColIndex,
      })
    );
    setBoxes((prevBoxes) => [...prevBoxes, ...newCol]);
  };

  const updateBoxLetter = (id: string, newLetter: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        getId(box.row, box.col) === id
          ? { ...box, letter: newLetter.toUpperCase() }
          : box
      )
    );
    setEditingBox(null);
  };
  console.log("boxes", boxes.length);
  console.log("grid", grid.flat().length);

  return (
    <main className="absolute inset-0 bg-white text-black flex flex-col items-center justify-center">
      <div className="flex relative">
        <div
          className={`grid w-full ${getGridColumnsClass(
            maxCol - minCol + 1
          )} gap-0 border-collapse border-2 border-black`}
        >
          {grid.map((row) =>
            row.map((box) =>
              editingBox &&
              getId(editingBox?.row, editingBox?.col) ===
                getId(box.row, box.col) ? (
                <BoxInput
                  key={getId(box.row, box.col)}
                  id={getId(box.row, box.col)}
                  letter={box.letter}
                  onChange={updateBoxLetter}
                />
              ) : (
                // <div className="border-2 border-black w-16 h-16 text-black text-center flex items-center text-4xl justify-center">
                //   {box.row}
                //   {box.col}
                // </div>
                <ShowBox
                  key={getId(box.row, box.col)}
                  id={getId(box.row, box.col)}
                  letter={box.letter}
                  onClick={() => setEditingBox(box)}
                  row={box.row}
                  col={box.col}
                />
              )
            )
          )}
        </div>

        {/* Buttons for adding rows and columns */}
        <button
          onClick={() => addRow("top")}
          className="absolute text-2xl bg-slate-50 -translate-x-1/2 left-1/2 h-10 -top-12 rounded w-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={() => addColumn("left")}
          className="absolute text-2xl bg-slate-50 top-1/2 -translate-y-1/2 w-10 -left-12 rounded h-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={() => addRow("bottom")}
          className="absolute text-2xl bg-slate-50 -translate-x-1/2 left-1/2 h-10 -bottom-12 rounded w-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
        <button
          onClick={() => addColumn("right")}
          className="absolute text-2xl bg-slate-50 top-1/2 -translate-y-1/2 w-10 -right-12 rounded h-full opacity-0 hover:opacity-100 p-2 transition-opacity"
        >
          +
        </button>
      </div>
    </main>
  );
}
