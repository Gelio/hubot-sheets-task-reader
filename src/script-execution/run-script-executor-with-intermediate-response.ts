import { Response, TextMessage } from 'hubot';

import { ScriptConfiguration } from '../get-configuration';
import { ScriptExecutor, ScriptErrorHandler } from './types';
import { runScriptExecutor } from './run-script-executor';
import { postIntermediateResponseWhenExecutionInProgressForSomeTime } from './post-intermediate-response';

export const runScriptExecutorWithIntermediateResponse = (
  scriptConfiguration: ScriptConfiguration,
  response: Response<any, TextMessage>,
  scriptExecutor: ScriptExecutor,
  scriptErrorHandler: ScriptErrorHandler,
) => {
  const executionPromise = runScriptExecutor(
    scriptConfiguration,
    response,
    scriptExecutor,
    scriptErrorHandler,
  );

  postIntermediateResponseWhenExecutionInProgressForSomeTime(
    response,
    executionPromise,
  );
};
