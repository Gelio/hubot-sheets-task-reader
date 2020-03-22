import { ScriptExecutor } from '../types';
import { getTasksFromWorksheet } from '../../tasks/get-tasks-from-worksheet';
import { formatTask } from '../../tasks/format-task';

export const showTaskAssignmentsInWorksheetExecutorFactory = (
  worksheetSearchPhrase: string,
): ScriptExecutor => (spreadsheet) =>
  getTasksFromWorksheet(
    spreadsheet,
    worksheetSearchPhrase,
  ).then(({ tasks, worksheetName }) =>
    [`Got it! For ${worksheetName}:`, ...tasks.map(formatTask)].join('\n'),
  );
