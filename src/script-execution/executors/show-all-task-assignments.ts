import { ScriptExecutor } from '../types';
import { verifyWorksheetHeaders } from '../../tasks/verify-worksheet-headers';
import { getTasksFromWorksheet } from '../../tasks/get-tasks-from-worksheet';
import { formatTasksFromWorksheet } from './common/format-tasks-from-worksheet';

export const showAllTaskAssignmentsExecutor: ScriptExecutor = async (
  spreadsheet,
) => {
  const allWorksheets = spreadsheet.sheetsByIndex;
  await Promise.all(
    allWorksheets.map((worksheet) => worksheet.loadHeaderRow()),
  );

  const worksheetsWithTaskAssignments = allWorksheets.filter((worksheet) => {
    const verificationError = verifyWorksheetHeaders(worksheet.headerValues);

    return verificationError === null;
  });

  const worksheetsWithTasks = await Promise.all(
    worksheetsWithTaskAssignments.map(getTasksFromWorksheet),
  );

  return [
    "I've got assignments for all tasks :)",
    ...worksheetsWithTasks.map(formatTasksFromWorksheet),
  ].join('\n\n');
};
