import { GoogleSpreadsheet } from 'google-spreadsheet';

import { ScriptError } from '../script-error';
import { ScriptConfiguration } from '../get-configuration';

export function getSpreadsheet(scriptConfiguration: ScriptConfiguration) {
  const { googleSheetsCredentials, spreadsheetKey } = scriptConfiguration;

  const doc = new GoogleSpreadsheet(spreadsheetKey);

  return doc
    .useServiceAccountAuth(googleSheetsCredentials)
    .then(() => doc.loadInfo())
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
