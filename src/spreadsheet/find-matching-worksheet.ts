import { SpreadsheetWorksheet } from 'google-spreadsheet';
import { ScriptError } from '../script-error';

export function findMatchingWorksheet(
  worksheets: SpreadsheetWorksheet[],
  searchPhrase: string,
): SpreadsheetWorksheet | ScriptError {
  const partialMatchRegexp = new RegExp(searchPhrase, 'i');

  const partialMatchWorksheets = worksheets.filter((worksheet) =>
    partialMatchRegexp.test(worksheet.title),
  );

  if (partialMatchWorksheets.length === 0) {
    return {
      error: new Error(`Cannot find worksheet that contains "${searchPhrase}"`),
    };
  } else if (partialMatchWorksheets.length === 1) {
    return partialMatchWorksheets[0];
  } else {
    // Look for an exact match
    const exactMatchRegexp = new RegExp(`^${searchPhrase}$`, 'i');

    const exactMatchWorksheets = partialMatchWorksheets.filter((worksheet) =>
      exactMatchRegexp.test(worksheet.title),
    );

    if (exactMatchWorksheets.length === 1) {
      return partialMatchWorksheets[0];
    }

    return {
      error: new Error(
        `Found more than 1 worksheet that contains "${searchPhrase}". Please use a full title`,
      ),
    };
  }
}
