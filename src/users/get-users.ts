import { User } from './types';

export function getUsers(worksheetValues: string[][]): User[] {
  const valuesWithoutHeaders = worksheetValues.slice(1);

  return valuesWithoutHeaders.map(
    (row): User => {
      return {
        name: row[0],
        chatUsername: row[1],
      };
    },
  );
}
