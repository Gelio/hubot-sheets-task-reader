import { User } from './types';

export function formatUser(user: User) {
  return `@${user.chatUsername} (${user.name})`;
}
