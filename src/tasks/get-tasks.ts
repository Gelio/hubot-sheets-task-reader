import { User } from '../users/types';
import { Task } from './types';

const FIRST_TASK_INDEX_OFFSET = 2;

export function getTasks(worksheetValues: string[][], users: User[]) {
  const tasks: Task[] = [];
  const tasksCount = worksheetValues[0].length - FIRST_TASK_INDEX_OFFSET;

  const valuesWithoutHeaders = worksheetValues.slice(1);

  for (let taskIndex = 0; taskIndex < tasksCount; taskIndex++) {
    const columnIndex = FIRST_TASK_INDEX_OFFSET + taskIndex;

    const task: Task = {
      name: worksheetValues[0][columnIndex],
      assignees: [],
    };

    valuesWithoutHeaders.forEach((row, index) => {
      const taskAssignmentValue = row[columnIndex];

      if (!taskAssignmentValue || taskAssignmentValue.trim() === '') {
        return;
      }

      task.assignees.push(users[index]);
    });

    tasks.push(task);
  }

  return tasks;
}
