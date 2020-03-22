import { Response, TextMessage } from 'hubot';

import { ScriptConfiguration } from '../get-configuration';
import { ScriptExecutor, ScriptErrorHandler } from './types';
import { getSpreadsheet } from '../spreadsheet/get-spreadsheet';
import { isScriptError } from '../script-error';

export const runScriptExecutor = (
  scriptConfiguration: ScriptConfiguration,
  response: Response<any, TextMessage>,
  scriptExecutor: ScriptExecutor,
  scriptErrorHandler: ScriptErrorHandler,
) =>
  getSpreadsheet(scriptConfiguration)
    .then(scriptExecutor)
    .catch((error) => {
      if (isScriptError(error)) {
        return scriptErrorHandler(error);
      }

      return scriptErrorHandler({
        error,
        consoleLogOnly: true,
      });
    })
    .then((responseMessage) => response.reply(responseMessage));
