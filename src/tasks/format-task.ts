import { formatUser } from '../users/format-user';
import { Task } from './types';

export function formatTask(task: Task) {
  if (task.assignees.length === 0) {
    return `${task.name}: nobody`;
  }

  return `${task.name}: ${task.assignees.map(formatUser).join(', ')}`;
}
