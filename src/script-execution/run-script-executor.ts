import { Response, TextMessage } from 'hubot';

import { ScriptConfiguration } from '../get-configuration';
import { ScriptExecutor, ScriptErrorHandler } from './types';
import { getSpreadsheet } from '../spreadsheet/get-spreadsheet';

export const runScriptExecutor = (
  scriptConfiguration: ScriptConfiguration,
  response: Response<any, TextMessage>,
  scriptExecutor: ScriptExecutor,
  scriptErrorHandler: ScriptErrorHandler,
) =>
  getSpreadsheet(scriptConfiguration)
    .then(scriptExecutor)
    .catch(scriptErrorHandler)
    .then((responseMessage) => response.reply(responseMessage));
