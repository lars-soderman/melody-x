'use client';

import { Box } from '@types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';

type ExportButtonProps = {
  boxes: Box[];
  maxCol: number;
  maxRow: number;
  minCol: number;
  minRow: number;
};

export function ExportButton({}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const exportToPDF = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      if (buttonRef.current) buttonRef.current.style.display = 'none';

      const element = document.getElementById('crossword-grid');
      if (!element) throw new Error('Grid element not found');

      // Hide letters but preserve structural elements
      const style = document.createElement('style');
      style.textContent = `
        [data-letter] {
          color: transparent !important;
        }
        [data-hint] span {
          position: absolute;
          top: -7px;
        }
      `;
      document.head.appendChild(style);

      const canvas = await html2canvas(element, {
        backgroundColor: 'white',
        scale: 4,
        useCORS: true,
        logging: false,
      });

      // Remove temporary style
      document.head.removeChild(style);

      // A4 dimensions in mm
      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;

      const scaleWidth = A4_WIDTH / canvas.width;
      const scaleHeight = A4_HEIGHT / canvas.height;
      const scale = Math.min(scaleWidth, scaleHeight) * 0.6;

      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const marginLeft = (A4_WIDTH - scaledWidth) / 2;
      const marginTop = (A4_HEIGHT - scaledHeight) / 2;

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        marginLeft,
        marginTop,
        scaledWidth,
        scaledHeight
      );

      pdf.save('crossword.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      if (buttonRef.current) buttonRef.current.style.display = 'block';
    }
  };

  return (
    <button
      ref={buttonRef}
      className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
      disabled={isExporting}
      onClick={exportToPDF}
    >
      {isExporting ? 'Exporting...' : 'Export'}
    </button>
  );
}
