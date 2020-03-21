import { formatTask } from './format-task';

describe('formatTask', () => {
  it('should concatenate the assignees', () => {
    const result = formatTask({
      name: 'Some task',
      assignees: [
        {
          name: 'Assignee A',
          chatUsername: 'a-a',
        },
        {
          name: 'Assignee B',
          chatUsername: 'a-b',
        },
      ],
    });

    expect(result).toBe('Some task: @a-a (Assignee A), @a-b (Assignee B)');
  });

  it('should say when nobody is assigned to a task', () => {
    const result = formatTask({
      name: 'Some task',
      assignees: [],
    });

    expect(result).toBe('Some task: nobody');
  });
});
