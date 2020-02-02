import GoogleSpreadsheet from 'google-spreadsheet';
import { promisify } from 'util';
import { ScriptError } from '../script-error';

export function getWorksheet(
  spreadsheet: GoogleSpreadsheet,
  worksheetName: string,
) {
  const getSpreadsheetInfo = promisify(spreadsheet.getInfo);

  return getSpreadsheetInfo().then(({ worksheets }) => {
    const matchingWorksheet = worksheets.find(
      (worksheet) => worksheet.title === worksheetName,
    );

    if (!matchingWorksheet) {
      return Promise.reject({
        error: new Error(`Cannot find worksheet with name ${worksheetName}`),
      } as ScriptError);
    }

    return matchingWorksheet;
  });
}
