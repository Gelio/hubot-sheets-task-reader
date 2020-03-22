import { User } from '../users/types';

export interface Task {
  name: string;
  assignees: User[];
}

export interface TasksFromWorksheet {
  worksheetName: string;
  tasks: Task[];
}
