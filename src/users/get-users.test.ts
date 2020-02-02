import { getUsers } from './get-users';
import { User } from './types';

describe('getUsers', () => {
  it('should return 0 users when the worksheet only contains headers', () => {
    const worksheetValues = [['Name', 'Chat username']];

    const users = getUsers(worksheetValues);

    expect(users).toHaveLength(0);
  });

  it('should return a list of users', () => {
    const worksheetValues = [
      ['Name', 'Chat username'],
      ['Joe Doe', 'joe.doe'],
      ['John Smith', 'john.smith'],
      ['Anna Kowalska', 'anna.kowalska'],
    ];

    const users = getUsers(worksheetValues);

    expect(users).toContainEqual<User>({
      name: 'Joe Doe',
      chatUsername: 'joe.doe',
    });

    expect(users).toContainEqual<User>({
      name: 'John Smith',
      chatUsername: 'john.smith',
    });

    expect(users).toContainEqual<User>({
      name: 'Anna Kowalska',
      chatUsername: 'anna.kowalska',
    });
  });
});
