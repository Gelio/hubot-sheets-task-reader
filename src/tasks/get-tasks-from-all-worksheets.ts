import { verifyWorksheetHeaders } from './verify-worksheet-headers';
import { getTasksFromHeaders } from './get-tasks-from-headers';
import { assignUsersToTasks } from './assign-users-to-tasks';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Task } from './types';

interface TasksFromWorksheet {
  worksheetName: string;
  tasks: Task[];
}

export async function getAllWorksheetsWithTaskAssignments(
  spreadsheet: GoogleSpreadsheet,
): Promise<TasksFromWorksheet[]> {
  const allWorksheets = spreadsheet.sheetsByIndex;
  await Promise.all(
    allWorksheets.map((worksheet) => worksheet.loadHeaderRow()),
  );

  const worksheetsWithTaskAssignments = allWorksheets.filter((worksheet) => {
    const verificationError = verifyWorksheetHeaders(worksheet.headerValues);

    return verificationError === null;
  });

  return Promise.all(
    worksheetsWithTaskAssignments.map(async (worksheet) => {
      const { headerValues } = worksheet;
      const tasks = getTasksFromHeaders(headerValues);

      const worksheetRows = await worksheet.getRows();

      assignUsersToTasks(headerValues, worksheetRows, tasks);

      return { tasks, worksheetName: worksheet.title };
    }),
  );
}
