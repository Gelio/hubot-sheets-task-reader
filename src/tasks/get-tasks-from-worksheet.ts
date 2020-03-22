import { SpreadsheetWorksheet } from 'google-spreadsheet';

import { createTasksFromHeaders } from './create-tasks-from-headers';
import { assignUsersToTasks } from './assign-users-to-tasks';
import { TasksFromWorksheet } from './types';

export async function getTasksFromWorksheet(
  worksheet: SpreadsheetWorksheet,
): Promise<TasksFromWorksheet> {
  const { title, headerValues } = worksheet;

  const tasks = createTasksFromHeaders(headerValues);

  const worksheetRows = await worksheet.getRows();

  assignUsersToTasks(headerValues, worksheetRows, tasks);

  return { tasks, worksheetName: title };
}
