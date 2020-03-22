import { Task } from './types';
import { FIRST_TASK_COLUMN_INDEX } from '../consts';

export function createTasksFromHeaders(headerValues: string[]) {
  return headerValues.slice(FIRST_TASK_COLUMN_INDEX).map(
    (taskName): Task => ({
      name: taskName,
      assignees: [],
    }),
  );
}
