import { ScriptExecutor } from '../types';
import { getTasksFromWorksheet } from '../../tasks/get-tasks-from-worksheet';
import { formatTask } from '../../tasks/format-task';
import { verifyWorksheetHeaders } from '../../tasks/verify-worksheet-headers';
import { findMatchingWorksheet } from '../../spreadsheet/find-matching-worksheet';
import { isScriptError } from '../../script-error';

export const showTaskAssignmentsInWorksheetExecutorFactory = (
  worksheetSearchPhrase: string,
): ScriptExecutor => async (spreadsheet) => {
  const worksheetResult = await findMatchingWorksheet(
    spreadsheet.sheetsByIndex,
    worksheetSearchPhrase,
  );

  if (isScriptError(worksheetResult)) {
    return Promise.reject(worksheetResult);
  }

  await worksheetResult.loadHeaderRow();

  const worksheetValidationError = verifyWorksheetHeaders(
    worksheetResult.headerValues,
  );

  if (isScriptError(worksheetValidationError)) {
    return Promise.reject(worksheetValidationError);
  }

  const { tasks, worksheetName } = await getTasksFromWorksheet(worksheetResult);

  return [`Got it! For ${worksheetName}:`, ...tasks.map(formatTask)].join('\n');
};
