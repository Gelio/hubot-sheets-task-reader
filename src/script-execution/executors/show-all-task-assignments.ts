import { ScriptExecutor } from '../types';
import { getAllWorksheetsWithTaskAssignments } from '../../tasks/get-tasks-from-all-worksheets';
import { formatTask } from '../../tasks/format-task';

export const showAllTaskAssignmentsExecutor: ScriptExecutor = (spreadsheet) =>
  getAllWorksheetsWithTaskAssignments(spreadsheet).then((worksheetsWithTasks) =>
    [
      "I've got assignments for all tasks :)",
      ...worksheetsWithTasks.map(({ tasks, worksheetName }) =>
        [`For ${worksheetName}:`, ...tasks.map(formatTask)].join('\n'),
      ),
    ].join('\n\n'),
  );
