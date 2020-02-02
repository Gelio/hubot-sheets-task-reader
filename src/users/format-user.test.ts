import { formatUser } from './format-user';
import { User } from './types';

describe('formatUser', () => {
  it("should display the user's name", () => {
    const user: User = {
      name: 'Joe Doe',
      chatUsername: 'joe.doe',
    };

    const result = formatUser(user);

    expect(result).toMatch(user.name);
  });

  it("should display the user's chat name prefixed with @", () => {
    const user: User = {
      name: 'Joe Doe',
      chatUsername: 'joe.doe',
    };

    const result = formatUser(user);

    expect(result).toMatch(`@${user.chatUsername}`);
  });
});
