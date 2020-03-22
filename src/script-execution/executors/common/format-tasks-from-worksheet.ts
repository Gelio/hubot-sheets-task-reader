import { TasksFromWorksheet } from '../../../tasks/types';
import { formatTask } from '../../../tasks/format-task';

export function formatTasksFromWorksheet({
  tasks,
  worksheetName,
}: TasksFromWorksheet) {
  if (tasks.length === 0) {
    return `There are no tasks for "${worksheetName}"`;
  }

  return [`For "${worksheetName}":`, ...tasks.map(formatTask)].join('\n');
}
