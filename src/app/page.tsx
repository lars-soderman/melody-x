"use client";
import { useState } from "react";

type Box = {
  letter: string | null;
  row: number;
  col: number;
  arrow?: "top-right" | "bottom-left";
  stop?: "bottom" | "right";
  black?: boolean;
  hint?: number;
};

type ShowBoxProps = Box & {
  onClick: () => void;
  id: string;
};

const ShowBox = ({
  letter,
  onClick,
  id,
  arrow,
  stop,
  black,
  hint,
}: ShowBoxProps) => {
  const getArrowRotation = (direction: "top-right" | "bottom-left") => {
    switch (direction) {
      case "top-right":
        return "top-2 right-1";
      case "bottom-left":
        return "bottom-1 left-1 rotate-90 -scale-y-100";
    }
  };

  return (
    <button
      key={id}
      onClick={onClick}
      className={`${
        black ? "bg-black" : "bg-white"
      } border-2 border-black w-16 h-16 text-black text-center flex items-center text-4xl justify-center relative`} // Added relative positioning
    >
      {!black && <p>{letter}</p>}
      {arrow && (
        <div className={`absolute ${getArrowRotation(arrow)}`}>
          <svg
            width="16"
            height="11"
            viewBox="0 0 16 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.857147 1.55957C0.442934 1.55957 0.107147 1.22378 0.107147 0.80957C0.107147 0.395357 0.442934 0.0595703 0.857147 0.0595703L0.857147 1.55957ZM9.66667 0.809571L9.66667 0.0595707L10.4167 0.0595707L10.4167 0.809571L9.66667 0.809571ZM10.197 10.1494C9.90411 10.4423 9.42923 10.4423 9.13634 10.1494L4.36337 5.37645C4.07048 5.08356 4.07048 4.60869 4.36337 4.31579C4.65626 4.0229 5.13114 4.0229 5.42403 4.31579L9.66667 8.55843L13.9093 4.31579C14.2022 4.0229 14.6771 4.0229 14.97 4.31579C15.2629 4.60869 15.2629 5.08356 14.97 5.37645L10.197 10.1494ZM0.857147 0.0595703L9.66667 0.0595707L9.66667 1.55957L0.857147 1.55957L0.857147 0.0595703ZM10.4167 0.809571L10.4167 9.61909L8.91667 9.61909L8.91667 0.809571L10.4167 0.809571Z"
              fill="black"
            />
          </svg>
        </div>
      )}
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
      onFocus={(e) => e.target.select()}
      onChange={(e) => onChange(id, e.target.value)}
      className="border-2 border-black w-16 h-16 text-black text-center flex items-center justify-center text-3xl"
      value={letter ?? ""}
    />
  );
};

const getGridColumnsClass = (numColumns: number) => {
  return `grid-cols-${numColumns}`;
};

// Add this with other constants at the top of the file
const BOX_SIZE = 64; // w-16 = 64px

export default function Home() {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [editingBox, setEditingBox] = useState<Box | null>(null);

  const minRow = getMinRow(boxes);
  const maxRow = getMaxRow(boxes);
  const minCol = getMinCol(boxes);
  const maxCol = getMaxCol(boxes);

  const grid = toGrid(boxes, minRow, maxRow, minCol, maxCol);

  const addRow = (position: "top" | "bottom") => {
    if (position === "top") {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) => ({ ...box, row: box.row + 1 }))
      );
    }

    const newRowIndex = position === "top" ? minRow : maxRow + 1;
    const newRow = Array.from(
      { length: stepsBetween(maxCol, minCol) },
      (_, colIndex) => ({
        letter: null,
        row: newRowIndex,
        col: colIndex + minCol,
      })
    );
    setBoxes((prevBoxes) => [...prevBoxes, ...newRow]);
  };

  const addColumn = (position: "left" | "right") => {
    if (position === "left") {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) => ({ ...box, col: box.col + 1 }))
      );
    }

    const newColIndex = position === "left" ? minCol : maxCol + 1;
    const newCol = Array.from(
      { length: stepsBetween(maxRow, minRow) },
      (_, rowIndex) => ({
        letter: null,
        row: rowIndex + minRow,
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

  const removeRow = (rowIndex: number) => {
    setBoxes((prevBoxes) => {
      // First remove the target row
      const filtered = prevBoxes.filter((box) => box.row !== rowIndex);
      // Then shift all rows above the removed row down by 1
      return filtered.map((box) => ({
        ...box,
        row: box.row > rowIndex ? box.row - 1 : box.row,
      }));
    });
  };

  const removeColumn = (colIndex: number) => {
    setBoxes((prevBoxes) => {
      // First remove the target column
      const filtered = prevBoxes.filter((box) => box.col !== colIndex);
      // Then shift all columns to the right of the removed column left by 1
      return filtered.map((box) => ({
        ...box,
        col: box.col > colIndex ? box.col - 1 : box.col,
      }));
    });
  };

  return (
    <main className="absolute inset-0 bg-white text-black flex flex-col items-center justify-center">
      <div className="flex relative">
        <div
          className={`grid w-full ${getGridColumnsClass(
            maxCol - minCol + 1
          )} gap-0 border-collapse border-2 border-black`}
        >
          {grid.map((row) =>
            row.map((box) => (
              <>
                {editingBox &&
                getId(editingBox?.row, editingBox?.col) ===
                  getId(box.row, box.col) ? (
                  <BoxInput
                    key={getId(box.row, box.col)}
                    id={getId(box.row, box.col)}
                    letter={box.letter}
                    onChange={updateBoxLetter}
                  />
                ) : (
                  <>
                    <ShowBox
                      key={getId(box.row, box.col)}
                      id={getId(box.row, box.col)}
                      letter={box.letter}
                      onClick={() => setEditingBox(box)}
                      row={box.row}
                      col={box.col}
                      arrow={box.arrow}
                      stop={box.stop}
                      black={box.black}
                      hint={box.hint}
                    />
                    {/* Row remove buttons - show at the end of each row */}
                    {box.col === maxCol && (
                      <button
                        onClick={() => removeRow(box.row)}
                        style={{
                          top: `${
                            (box.row - minRow) * BOX_SIZE + BOX_SIZE / 4
                          }px`,
                        }}
                        className="absolute text-2xl bg-slate-50 -right-1 border-2 border-black rounded w-4 h-10 opacity-0 hover:opacity-100 transition-opacity duration-200 delay-500 flex items-center justify-center"
                      >
                        -
                      </button>
                    )}
                    {/* Column remove buttons - show at the bottom of each column */}
                    {box.row === maxRow && (
                      <button
                        onClick={() => removeColumn(box.col)}
                        style={{
                          left: `${
                            (box.col - minCol) * BOX_SIZE + BOX_SIZE / 4
                          }px`,
                        }}
                        className="absolute text-2xl bg-slate-50 -bottom-1 border-2 border-black rounded h-4 w-10 opacity-0 hover:opacity-100 transition-opacity duration-200 delay-500 flex items-center justify-center"
                      >
                        -
                      </button>
                    )}
                  </>
                )}
              </>
            ))
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
