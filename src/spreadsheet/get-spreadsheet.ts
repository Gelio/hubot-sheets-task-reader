import GoogleSpreadsheet from 'google-spreadsheet';
import { promisify } from 'util';
import { ScriptError } from '../script-error';

export function getSpreadsheet(
  spreadsheetKey: string,
  googleSheetsCredentials: object,
) {
  const doc = new GoogleSpreadsheet(spreadsheetKey);

  const useServiceAccountAuth = promisify(doc.useServiceAccountAuth);

  return useServiceAccountAuth(googleSheetsCredentials)
    .then(() => doc)
    .catch((error?: Error) =>
      Promise.reject({
        error: new Error(
          `Cannot authenticate to Google Sheets (${error?.message})`,
        ),
        consoleLogOnly: true,
      } as ScriptError),
    );
}
