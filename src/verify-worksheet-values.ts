import { ScriptError } from './script-error';
import {
  HEADER_ROW_INDEX,
  NAME_COLUMN_INDEX,
  CHAT_USERNAME_COLUMN_INDEX,
} from './consts';

const nameColumnText = 'Name';
const chatUsernameColumnText = 'Chat username';

export function verifyWorksheetValues(
  worksheetValues: string[][],
): ScriptError | null {
  const errorMessages: string[] = [];

  if (
    worksheetValues[HEADER_ROW_INDEX][NAME_COLUMN_INDEX]?.toLowerCase() !==
    nameColumnText.toLowerCase()
  ) {
    errorMessages.push(`The first column should be named "${nameColumnText}"`);
  }

  if (
    worksheetValues[HEADER_ROW_INDEX][
      CHAT_USERNAME_COLUMN_INDEX
    ]?.toLowerCase() !== chatUsernameColumnText.toLowerCase()
  ) {
    errorMessages.push(
      `The second column should be named "${chatUsernameColumnText}"`,
    );
  }

  if (errorMessages.length > 0) {
    const finalErrorMessage = [
      'The worksheet does not follow proper format',
      ...errorMessages,
    ].join('\n');

    return {
      error: new Error(finalErrorMessage),
    };
  }

  return null;
}
