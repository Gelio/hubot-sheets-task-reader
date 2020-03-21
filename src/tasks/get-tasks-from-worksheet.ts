import { getSpreadsheet } from '../spreadsheet/get-spreadsheet';
import { getWorksheet } from '../spreadsheet/get-worksheet';
import { verifyWorksheetHeaders } from './verify-worksheet-headers';
import { ScriptConfiguration } from '../get-configuration';
import { getTasksFromHeaders } from './get-tasks-from-headers';
import { assignUsersToTasks } from './assign-users-to-tasks';

export async function getTasksFromWorksheet(
  scriptConfiguration: ScriptConfiguration,
  worksheetSearchPhrase: string,
) {
  const spreadsheet = await getSpreadsheet(scriptConfiguration);

  const worksheet = await getWorksheet(spreadsheet, worksheetSearchPhrase);
  const headerValues = worksheet.headerValues;

  const worksheetValidationError = verifyWorksheetHeaders(headerValues);

  if (worksheetValidationError) {
    return Promise.reject(worksheetValidationError);
  }

  const tasks = getTasksFromHeaders(headerValues);

  const worksheetRows = await worksheet.getRows();

  assignUsersToTasks(headerValues, worksheetRows, tasks);

  return { tasks, worksheetName: worksheet.title };
}
