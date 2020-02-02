import { getSpreadsheet } from '../spreadsheet/get-spreadsheet';
import { getWorksheet } from '../spreadsheet/get-worksheet';
import { getWorksheetValues } from '../spreadsheet/get-worksheet-values';
import { verifyWorksheetValues } from '../verify-worksheet-values';
import { getUsers } from '../users/get-users';
import { getTasks } from './get-tasks';

export async function getTasksFromWorksheet(
  spreadsheetKey: string,
  googleSheetsCredentials: object,
  worksheetName: string,
) {
  const spreadsheet = await getSpreadsheet(
    spreadsheetKey,
    googleSheetsCredentials,
  );

  const worksheet = await getWorksheet(spreadsheet, worksheetName);
  const worksheetValues = await getWorksheetValues(worksheet);

  const worksheetValidationError = verifyWorksheetValues(worksheetValues);

  if (worksheetValidationError) {
    return Promise.reject(worksheetValidationError);
  }

  const users = getUsers(worksheetValues);

  return getTasks(worksheetValues, users);
}
