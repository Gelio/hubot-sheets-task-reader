import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ScriptError } from '../script-error';
import { findMatchingWorksheet } from './find-matching-worksheet';

export function getWorksheet(
  spreadsheet: GoogleSpreadsheet,
  worksheetName: string,
) {
  const worksheetSearchResult = findMatchingWorksheet(
    spreadsheet.sheetsByIndex,
    worksheetName,
  );

  if (typeof worksheetSearchResult === 'string') {
    return Promise.reject({
      error: new Error(worksheetSearchResult),
    } as ScriptError);
  }

  return worksheetSearchResult
    .loadHeaderRow()
    .then(() => worksheetSearchResult);
}
