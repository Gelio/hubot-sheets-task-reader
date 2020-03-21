import { User } from '../users/types';
import { assignUsersToTasks } from './assign-users-to-tasks';
import { SpreadsheetRow } from 'google-spreadsheet';
import { Task } from './types';

describe('assignUsersToTasks', () => {
  let headerValues: string[];
  let tasks: Task[];

  beforeEach(() => {
    headerValues = ['Name', 'Chat username', 'Task A', 'Task B'];
    tasks = [
      {
        name: 'Task A',
        assignees: [],
      },
      {
        name: 'Task B',
        assignees: [],
      },
    ];
  });

  it('should leave the tasks untouched when there are no assignments', () => {
    const worksheetRows: SpreadsheetRow[] = [
      { Name: 'User A', 'Chat username': 'a-a', 'Task A': '', 'Task B': '' },
      { Name: 'User B', 'Chat username': 'a-b', 'Task A': '', 'Task B': '' },
    ];

    assignUsersToTasks(headerValues, worksheetRows, tasks);

    tasks.forEach((task) => {
      expect(task.assignees).toHaveLength(0);
    });
  });

  it('should fill in task assignees based on assignments', () => {
    const worksheetRows: SpreadsheetRow[] = [
      { Name: 'User A', 'Chat username': 'a-a', 'Task A': 'x', 'Task B': '' },
      { Name: 'User B', 'Chat username': 'a-b', 'Task A': '', 'Task B': 'x' },
    ];

    assignUsersToTasks(headerValues, worksheetRows, tasks);

    expect(tasks[0].assignees).toHaveLength(1);
    expect(tasks[0].assignees[0]).toEqual({
      name: 'User A',
      chatUsername: 'a-a',
    } as User);

    expect(tasks[1].assignees).toHaveLength(1);
    expect(tasks[1].assignees[0]).toEqual({
      name: 'User B',
      chatUsername: 'a-b',
    } as User);
  });
});
