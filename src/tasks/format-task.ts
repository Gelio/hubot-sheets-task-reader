import { formatUser } from '../users/format-user';
import { Task } from './types';

export function formatTask(task: Task) {
  return `${task.name}: ${task.assignees.map(formatUser).join(', ')}`;
}
