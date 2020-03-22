import { ScriptExecutor } from '../types';
import { getTasksFromWorksheet } from '../../tasks/get-tasks-from-worksheet';
import { verifyWorksheetHeaders } from '../../tasks/verify-worksheet-headers';
import { findMatchingWorksheet } from '../../spreadsheet/find-matching-worksheet';
import { isScriptError } from '../../script-error';
import { formatTasksFromWorksheet } from './common/format-tasks-from-worksheet';

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

  const tasksFromWorksheet = await getTasksFromWorksheet(worksheetResult);

  return `Got it! ${formatTasksFromWorksheet(tasksFromWorksheet)}`;
};
