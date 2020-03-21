import { SpreadsheetRow } from 'google-spreadsheet';

import { Task } from './types';
import { User } from '../users/types';
import { NAME_COLUMN_INDEX, CHAT_USERNAME_COLUMN_INDEX } from '../consts';

export function assignUsersToTasks(
  headerValues: string[],
  worksheetRows: SpreadsheetRow[],
  tasks: Task[],
) {
  const nameColumnKey = headerValues[NAME_COLUMN_INDEX];
  const chatUsernameColumnKey = headerValues[CHAT_USERNAME_COLUMN_INDEX];

  worksheetRows.forEach((row) => {
    const user: User = {
      name: row[nameColumnKey],
      chatUsername: row[chatUsernameColumnKey],
    };

    tasks.forEach((task) => {
      const cellValue = row[task.name]?.trim();
      const isAssigned = typeof cellValue === 'string' && cellValue !== '';

      if (isAssigned) {
        task.assignees.push(user);
      }
    });
  });
}
