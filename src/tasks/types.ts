import { User } from '../users/types';

export interface Task {
  name: string;
  assignees: User[];
}
