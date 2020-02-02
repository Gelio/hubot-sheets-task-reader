export interface ScriptConfiguration {
  googleSheetsCredentials: object;
  spreadsheetKey: string;
}

export function getConfiguration(
  processEnv: NodeJS.ProcessEnv,
  require: NodeRequire,
): ScriptConfiguration {
  const googleSheetsCredentialsPath =
    processEnv.HUBOT_GOOGLE_SHEETS_CREDENTIALS_PATH;

  if (!googleSheetsCredentialsPath) {
    throw new Error(
      [
        'Google Sheets credentials path is not provided.',
        'Did you forget to pass the HUBOT_GOOGLE_SHEETS_CREDENTIALS_PATH variable?',
      ].join('\n'),
    );
  }

  const googleSheetsCredentials = getGoogleSheetsCredentials(
    googleSheetsCredentialsPath,
    require,
  );

  const spreadsheetKey = processEnv.HUBOT_SPREADSHEET_KEY;
  if (!spreadsheetKey) {
    throw new Error(
      [
        'Spreadsheet key is not provided.',
        'Did you forget to pass the HUBOT_SPREADSHEET_KEY variable?',
      ].join('\n'),
    );
  }

  return {
    spreadsheetKey,
    googleSheetsCredentials,
  };
}

function getGoogleSheetsCredentials(
  googleSheetsCredentialsPath: string,
  require: NodeRequire,
): object {
  try {
    return require(googleSheetsCredentialsPath);
  } catch (error) {
    throw new Error(
      [
        'Error while reading Google Sheets Credentials file (HUBOT_GOOGLE_SHEETS_CREDENTIALS_PATH)',
        error?.message,
      ].join('\n'),
    );
  }
}
