import { SpreadsheetWorksheet } from 'google-spreadsheet';

export function findMatchingWorksheet(
  worksheets: SpreadsheetWorksheet[],
  worksheetName: string,
) {
  const partialMatchRegexp = new RegExp(worksheetName, 'i');

  const partialMatchWorksheets = worksheets.filter((worksheet) =>
    partialMatchRegexp.test(worksheet.title),
  );

  if (partialMatchWorksheets.length === 0) {
    return `Cannot find worksheet that contains "${worksheetName}"`;
  } else if (partialMatchWorksheets.length === 1) {
    return partialMatchWorksheets[0];
  } else {
    // Look for an exact match
    const exactMatchRegexp = new RegExp(`^${worksheetName}$`, 'i');

    const exactMatchWorksheets = partialMatchWorksheets.filter((worksheet) =>
      exactMatchRegexp.test(worksheet.title),
    );

    if (exactMatchWorksheets.length === 1) {
      return partialMatchWorksheets[0];
    }

    return `Found more than 1 worksheet that contains "${worksheetName}". Please use a full title`;
  }
}
