import { TasksFromWorksheet } from '../../../tasks/types';
import { formatTasksFromWorksheet } from './format-tasks-from-worksheet';

describe('formatTasksFromWorksheet', () => {
  it('should show all task assignments', () => {
    const tasksFromWorksheet: TasksFromWorksheet = {
      worksheetName: 'Some event',
      tasks: [
        {
          name: 'Task A',
          assignees: [
            {
              name: 'User A',
              chatUsername: 'a-a',
            },
            {
              name: 'User B',
              chatUsername: 'a-b',
            },
          ],
        },
        {
          name: 'Task B',
          assignees: [],
        },
      ],
    };

    const result = formatTasksFromWorksheet(tasksFromWorksheet);
    expect(result).toBe(`For "Some event":
Task A: @a-a (User A), @a-b (User B)
Task B: nobody`);
  });

  it('should return a special message when there are no tasks', () => {
    const tasksFromWorksheet: TasksFromWorksheet = {
      worksheetName: 'Some event',
      tasks: [],
    };

    const result = formatTasksFromWorksheet(tasksFromWorksheet);
    expect(result).toBe(`There are no tasks for "Some event"`);
  });
});
