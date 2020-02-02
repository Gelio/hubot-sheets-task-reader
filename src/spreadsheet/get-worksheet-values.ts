import { SpreadsheetWorksheet } from 'google-spreadsheet';
import { promisify } from 'util';
import { transformCellArrayToMatrix } from './transform-cell-array-to-matrix';

export function getWorksheetValues(worksheet: SpreadsheetWorksheet) {
  const getCells = promisify(worksheet.getCells);

  return getCells({
    'min-row': 1,
    'max-row': worksheet.rowCount,
    'min-col': 1,
    'max-col': worksheet.colCount,
  }).then(transformCellArrayToMatrix);
}
