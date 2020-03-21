import { getTasksFromHeaders } from './get-tasks-from-headers';

describe('getTasksFromHeaders', () => {
  it('should return the list of tasks', () => {
    const taskNames = ['task A', 'task B', 'task C'];
    const tasks = getTasksFromHeaders(['name', 'chat username', ...taskNames]);

    expect(tasks.map((task) => task.name)).toEqual(taskNames);
  });

  it('should return tasks with empty list of assignees', () => {
    const taskNames = ['task A', 'task B', 'task C'];
    const tasks = getTasksFromHeaders(['name', 'chat username', ...taskNames]);

    tasks.forEach((task) => {
      expect(task.assignees).toHaveLength(0);
    });
  });

  it('should return an empty list when there is not enough headers', () => {
    const tasks = getTasksFromHeaders(['name']);

    expect(tasks).toHaveLength(0);
  });
});
