'use client';

import { Box } from '@types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';

type ExportButtonProps = {
  boxes: Box[];
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
};

export function ExportButton({
  boxes,
  minRow,
  maxRow,
  minCol,
  maxCol,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const exportToPDF = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      if (buttonRef.current) buttonRef.current.style.display = 'none';

      const element = document.getElementById('crossword-grid');
      if (!element) {
        throw new Error('Grid element not found');
      }

      const numRows = maxRow - minRow + 1;
      const numCols = maxCol - minCol + 1;
      const cellSize = element.clientWidth / numCols;
      const actualWidth = cellSize * numCols;
      const actualHeight = cellSize * numRows;

      const canvas = await html2canvas(element, {
        backgroundColor: 'white',
        scale: 2,
        width: actualWidth,
        height: actualHeight,
        onclone: (doc) => {
          const inputs = doc.getElementsByTagName('input');
          Array.from(inputs).forEach((input) => {
            input.value = '';
          });
          const buttons = doc.getElementsByTagName('button');
          Array.from(buttons).forEach((button) => {
            if (!button.classList.contains('options-button')) {
              button.textContent = '';
            }
          });
        },
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const targetWidth = pdfWidth * 0.8;
      const aspectRatio = canvas.height / canvas.width;
      const targetHeight = targetWidth * aspectRatio;
      const x = (pdfWidth - targetWidth) / 2;
      const y = (pdfHeight - targetHeight) / 2;

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        x,
        y,
        targetWidth,
        targetHeight
      );

      pdf.save('crossword.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      if (buttonRef.current) buttonRef.current.style.display = 'block';
      setIsExporting(false);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={() => void exportToPDF()}
      disabled={isExporting}
      className="h-6 w-6 rounded text-gray-400 transition-colors hover:bg-gray-200 disabled:opacity-50"
      aria-label="Export to PDF"
    >
      ⬇
    </button>
  );
}
