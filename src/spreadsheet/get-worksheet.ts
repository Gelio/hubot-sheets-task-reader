import { GoogleSpreadsheet } from 'google-spreadsheet';
import { ScriptError } from '../script-error';

export function getWorksheet(
  spreadsheet: GoogleSpreadsheet,
  worksheetName: string,
) {
  const worksheets = spreadsheet.sheetsByIndex;

  // TODO: try case insensitive or partial search
  const matchingWorksheet = worksheets.find(
    (worksheet) => worksheet.title === worksheetName,
  );

  if (!matchingWorksheet) {
    return Promise.reject({
      error: new Error(`Cannot find worksheet with name ${worksheetName}`),
    } as ScriptError);
  }

  return matchingWorksheet.loadHeaderRow().then(() => matchingWorksheet);
}
