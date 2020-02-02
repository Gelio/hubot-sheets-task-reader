import { SpreadsheetCell } from 'google-spreadsheet';

export function transformCellArrayToMatrix(cells: SpreadsheetCell[]) {
  const matrix: string[][] = [];

  cells.forEach((cell) => {
    const rowIndex = cell.row - 1;
    const colIndex = cell.col - 1;

    if (!matrix[rowIndex]) {
      matrix[rowIndex] = [];
    }

    matrix[rowIndex][colIndex] = cell.value;
  });

  return matrix;
}
